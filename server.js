const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
const os = require("os");
const path = require("path");

const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const SYNC_TTL_MS = 10 * 60 * 1000;
const syncStore = new Map();
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

loadLocalEnv();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "POST" && req.url === "/api/generate-card") {
      await handleGenerateCard(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/sync-info") {
      sendJson(res, 200, getSyncInfo(req));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/sync") {
      await handleCreateSync(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/sync/")) {
      handleReadSync(url.pathname.split("/").pop(), res);
      return;
    }

    if (req.method !== "GET") {
      send(res, 405, "Method not allowed", "text/plain; charset=utf-8");
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const filePath = path.normalize(path.join(ROOT, requested));
    if (!filePath.startsWith(ROOT)) {
      send(res, 403, "Forbidden", "text/plain; charset=utf-8");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        send(res, 404, "Not found", "text/plain; charset=utf-8");
        return;
      }
      send(res, 200, data, MIME[path.extname(filePath)] || "application/octet-stream");
    });
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message }), "application/json; charset=utf-8");
  }
});

async function handleCreateSync(req, res) {
  const body = await readBody(req);
  const payload = JSON.parse(body || "{}");
  if (!payload || typeof payload !== "object") {
    sendJson(res, 400, { error: "同步数据格式不正确。" });
    return;
  }

  cleanupSyncStore();
  const token = crypto.randomBytes(6).toString("base64url");
  const expiresAt = Date.now() + SYNC_TTL_MS;
  syncStore.set(token, { payload, expiresAt });
  sendJson(res, 200, { token, expiresAt, ttlSeconds: SYNC_TTL_MS / 1000 });
}

function handleReadSync(token, res) {
  cleanupSyncStore();
  const item = syncStore.get(token);
  if (!item) {
    sendJson(res, 404, { error: "同步二维码已过期，请在电脑端重新生成。" });
    return;
  }
  sendJson(res, 200, { payload: item.payload, expiresAt: item.expiresAt });
}

function getSyncInfo(req) {
  const urls = getLanAddresses().map((item) => `http://${item.address}:${PORT}/app.html`);
  const hostUrl = req.headers.host ? `http://${req.headers.host}/app.html` : "";
  return {
    appUrls: urls.length ? urls : [hostUrl || `http://localhost:${PORT}/app.html`],
    expiresInSeconds: SYNC_TTL_MS / 1000
  };
}

function getLanAddresses() {
  const addresses = [];
  const interfaces = os.networkInterfaces();
  Object.entries(interfaces).forEach(([name, items]) => {
    (items || []).forEach((item) => {
      if (item.family === "IPv4" && !item.internal) {
        addresses.push({ address: item.address, name, virtual: isVirtualInterface(name) });
      }
    });
  });
  return addresses.sort((a, b) => Number(a.virtual) - Number(b.virtual) || a.address.localeCompare(b.address));
}

function isVirtualInterface(name) {
  return /virtual|vmware|vbox|wsl|hyper-v|vethernet|docker|loopback|tailscale|zerotier/i.test(name);
}

function cleanupSyncStore() {
  const now = Date.now();
  for (const [token, item] of syncStore.entries()) {
    if (item.expiresAt <= now) syncStore.delete(token);
  }
}

async function handleGenerateCard(req, res) {
  const body = await readBody(req);
  const payload = JSON.parse(body || "{}");
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    send(res, 400, JSON.stringify({ error: "没有找到 DEEPSEEK_API_KEY。请设置环境变量，或在 memory-cards\\.env 中填写。" }), "application/json; charset=utf-8");
    return;
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  if (!response.ok) {
    send(res, response.status, text, "application/json; charset=utf-8");
    return;
  }

  const data = JSON.parse(text);
  send(res, 200, JSON.stringify({ content: data.choices?.[0]?.message?.content || "" }), "application/json; charset=utf-8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function send(res, status, body, contentType) {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

server.listen(PORT, () => {
  console.log(`Java algorithm flashcards: http://localhost:${PORT}`);
  getLanAddresses().forEach((item) => {
    console.log(`Phone sync on Wi-Fi: http://${item.address}:${PORT}/app.html`);
  });
});

function loadLocalEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalIndex = trimmed.indexOf("=");
    if (equalIndex <= 0) continue;
    const key = trimmed.slice(0, equalIndex).trim();
    const rawValue = trimmed.slice(equalIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
