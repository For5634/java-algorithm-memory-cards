# Java 算法记忆卡片

一个本地优先的 Java 算法复习小工具，适合按 Anki 的方式刷 LeetCode Hot100、代码随想录和高频面试题。

## 项目简介

这个项目把算法题做成“题面 -> 回忆 -> 翻面 -> 评分”的记忆卡片。正面只展示清晰题面和示例，不提前暴露解法类型；翻面后再查看精简思路、复杂度、详细复盘和 Java 代码。项目内置完整 Hot100 卡池，并支持新增、编辑、删除、搜索、标签筛选、每日 10 张复习和本地进度保存。

智能制卡功能通过本地 Node 服务调用 DeepSeek API。API Key 只放在本地 `.env` 或环境变量中，不会在页面里输入，也不会提交到 Git。

## 功能特性

- 内置 LeetCode Hot100 卡片
- 每张内置卡包含题面、示例、Java 解法、复杂度和详细复盘
- Anki 式翻面复习
- 提示默认隐藏，手动点击后才显示
- 搜索、专题筛选、薄弱卡筛选、自定义卡筛选
- 随机抽卡
- 每日抽 10 张复习，直到抽完整个卡池
- 评分：没想起、模糊、记住了、已掌握
- 已掌握卡片自动后移，薄弱卡优先
- 新增、编辑、删除卡片
- 恢复内置卡片
- 本地保存复习进度
- 导入/导出卡片和进度 JSON
- Java 代码高亮
- DeepSeek 智能制卡：粘贴题目和 Java 代码，自动生成卡片草稿

## 快速启动

### 方式一：双击启动

在 Windows 中双击：

```text
start-cards.bat
```

它会启动本地服务，并打开：

```text
http://localhost:8787
```

### 方式二：命令行启动

```powershell
cd memory-cards
node server.js
```

然后打开：

```text
http://localhost:8787
```

### 方式三：只使用复习功能

如果不需要智能制卡，也可以直接打开：

```text
index.html
```

直接打开 HTML 时可以复习、筛选、编辑和保存本地进度，但不能调用 DeepSeek 智能制卡接口。

## DeepSeek API Key 配置

复制示例文件：

```powershell
copy .env.example .env
```

然后编辑 `.env`：

```text
DEEPSEEK_API_KEY=你的 DeepSeek API Key
```

也可以使用环境变量：

```powershell
$env:DEEPSEEK_API_KEY="你的 DeepSeek API Key"
node server.js
```

注意：`.env` 已在 `.gitignore` 中忽略，不会被提交。

## 快捷键

- `F`：翻面
- `R`：随机抽卡
- `1`：没想起
- `2`：模糊
- `3`：记住了
- `4`：已掌握

## 数据保存

卡片修改、复习进度、每日复习记录会保存在当前浏览器的 `localStorage` 中。换电脑或换浏览器前，建议先在“数据”页导出 JSON。

## 技术栈

- HTML
- CSS
- Vanilla JavaScript
- Node.js 本地静态服务和 DeepSeek API 代理

## 适用场景

- Java 算法面试准备
- LeetCode Hot100 系统复习
- 代码随想录专题复盘
- 把自己的错题整理成可长期回顾的记忆卡片
