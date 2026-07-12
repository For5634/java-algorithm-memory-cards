(function () {
  const STORAGE_KEY = "java-algorithm-flashcards:v2";
  const LEGACY_STORAGE_KEY = "java-algorithm-flashcards:v1";
  const OVERRIDES_KEY = "java-algorithm-overrides:v1";
  const DELETED_KEY = "java-algorithm-deleted:v1";
  const PROGRESS_KEY = "java-algorithm-progress:v1";
  const DAILY_KEY = "java-algorithm-daily:v1";
  const AI_CONFIG_KEY = "java-algorithm-ai-config:v1";
  const TOPICS = ["哈希", "双指针", "滑动窗口", "栈", "动态规划", "数组", "矩阵", "链表", "堆", "二叉树", "图论", "回溯", "二分", "贪心", "多维动态规划", "技巧", "高频面试"];

  const DEFAULT_CARDS = [
    {
      id: "binary-search-basic",
      title: "LC 704 搜索目标值",
      topic: "二分",
      difficulty: "基础",
      source: "代码随想录 / LC 704",
      tags: ["边界", "有序数组", "闭区间"],
      front: "给定升序数组 nums 和 target，返回下标，不存在返回 -1。如何高效定位目标，并保证边界不会漏掉候选值？",
      hint: "每次用中间位置排除一半候选范围；先固定区间含义，left == right 时仍然要检查。",
      shortAnswer: "闭区间写法：left = 0, right = n - 1；循环条件 left <= right；mid 用 left + (right - left) / 2；排除 mid 时写成 mid - 1 或 mid + 1。",
      details: "二分最重要的是区间定义全程一致。闭区间里 left == right 仍然是候选值，所以循环条件用 <=。如果 nums[mid] 大于 target，mid 不可能是答案，right = mid - 1；小于时 left = mid + 1。",
      code: "public int search(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] > target) right = mid - 1;\n        else left = mid + 1;\n    }\n    return -1;\n}",
      complexity: "时间 O(log n)，空间 O(1)",
      related: "LC 704 二分查找，LC 35 搜索插入位置"
    },
    {
      id: "binary-search-answer",
      title: "最小可行值类问题",
      topic: "二分",
      difficulty: "中等",
      source: "代码随想录 / 高频面试",
      tags: ["答案区间", "check 函数", "单调性"],
      front: "如果给定一个值 x 能判断方案是否可行，如何找到最小的可行答案？",
      hint: "观察可行性是否会在某个边界之后保持同一真假状态。",
      shortAnswer: "把“求最大/最小答案”改成“给定 x 是否可行”。求最小可行值时，可行就收缩右边界，不可行就增大左边界。",
      details: "二分答案的关键不是数组有序，而是答案空间单调。check(x) 只回答 true/false，不要混入优化目标。常见题型包括最小速度、最大间距、最小容量、最长可行长度。",
      code: "int left = low, right = high;\nwhile (left < right) {\n    int mid = left + (right - left) / 2;\n    if (check(mid)) right = mid;\n    else left = mid + 1;\n}\nreturn left;",
      complexity: "通常是 O(log 答案范围 * check 复杂度)",
      related: "LC 875 爱吃香蕉的珂珂，LC 1011 在 D 天内送达包裹"
    },
    {
      id: "sliding-window-longest-unique",
      title: "LC 3 无重复字符的最长子串",
      topic: "滑动窗口",
      difficulty: "中等",
      source: "Hot100 / LC 3",
      tags: ["HashMap", "左右边界", "最长"],
      front: "如何维护一段连续子串，使它始终不含重复字符，并更新最大长度？",
      hint: "新字符加入后，如果它在当前范围内出现过，让左边界越过上次出现位置。",
      shortAnswer: "用 map 记录字符最新位置。右指针遍历字符，如果当前字符在窗口内出现过，就把 left 跳到上次位置 + 1；每一步更新答案长度。",
      details: "易错点是 left 不能后退。更新时要写 left = Math.max(left, last.get(c) + 1)，否则遇到窗口外的旧重复字符会错误缩小窗口。",
      code: "public int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> last = new HashMap<>();\n    int ans = 0, left = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right);\n        if (last.containsKey(c)) left = Math.max(left, last.get(c) + 1);\n        last.put(c, right);\n        ans = Math.max(ans, right - left + 1);\n    }\n    return ans;\n}",
      complexity: "时间 O(n)，空间 O(字符集大小)",
      related: "LC 3 无重复字符的最长子串"
    },
    {
      id: "two-pointers-three-sum",
      title: "LC 15 三数之和",
      topic: "双指针",
      difficulty: "中等",
      source: "Hot100 / LC 15",
      tags: ["排序", "去重", "相向指针"],
      front: "如何找出所有和为 0 的不重复三元组，并避免只靠 Set 做答案去重？",
      hint: "先让相同值相邻，找到一个答案后要跳过连续重复值。",
      shortAnswer: "排序后固定 i，在右侧用 left/right 找两数和。sum 小了 left++，大了 right--，等于 0 加入答案并跳过重复 left/right。i 也要跳过重复值。",
      details: "去重是核心坑。i 的去重和前一个 i 比较；找到答案后，left 和 right 都要移动到不同值。不要靠 Set 粗暴去重，它掩盖了双指针本身。",
      code: "Arrays.sort(nums);\nfor (int i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] == nums[i - 1]) continue;\n    int left = i + 1, right = nums.length - 1;\n    while (left < right) {\n        int sum = nums[i] + nums[left] + nums[right];\n        if (sum == 0) {\n            ans.add(Arrays.asList(nums[i], nums[left], nums[right]));\n            while (left < right && nums[left] == nums[left + 1]) left++;\n            while (left < right && nums[right] == nums[right - 1]) right--;\n            left++;\n            right--;\n        } else if (sum < 0) left++;\n        else right--;\n    }\n}",
      complexity: "时间 O(n^2)，空间不计答案 O(log n) 到 O(n)",
      related: "LC 15 三数之和，LC 18 四数之和"
    },
    {
      id: "backtracking-combination-sum",
      title: "LC 39 组合总和",
      topic: "回溯",
      difficulty: "中等",
      source: "Hot100 / LC 39",
      tags: ["选择列表", "剪枝", "可重复选择"],
      front: "如何枚举所有和为 target 的组合，同时避免 [2,3] 和 [3,2] 这种重复答案？",
      hint: "后续选择只从当前位置或之后开始；如果元素允许重复，当前位置可以再次被选择。",
      shortAnswer: "startIndex 限制下一层从当前位置或之后选，避免排列重复。可重复选择递归传 i，不可重复选择传 i + 1。排序后可以按剩余目标剪枝。",
      details: "回溯三件套：路径、选择起点、剩余目标。进入递归前选择，返回后撤销。组合题不关心顺序，所以不能每层都从 0 开始选。",
      code: "void dfs(int[] nums, int start, int rest, List<Integer> path) {\n    if (rest == 0) {\n        ans.add(new ArrayList<>(path));\n        return;\n    }\n    for (int i = start; i < nums.length; i++) {\n        if (nums[i] > rest) break;\n        path.add(nums[i]);\n        dfs(nums, i, rest - nums[i], path);\n        path.remove(path.size() - 1);\n    }\n}",
      complexity: "指数级，递归栈取决于 target / min",
      related: "LC 39 组合总和，LC 40 组合总和 II"
    },
    {
      id: "dp-coin-change",
      title: "LC 322 零钱兑换",
      topic: "动态规划",
      difficulty: "中等",
      source: "Hot100 / LC 322",
      tags: ["完全背包", "最值", "初始化"],
      front: "给定若干硬币面额，如何求凑成 amount 所需的最少硬币数？无法凑成时返回 -1。",
      hint: "把较小金额的最优结果拿来推较大金额；初始化要能表达“暂时不可达”。",
      shortAnswer: "dp[x] 表示凑成金额 x 的最少硬币数。dp[0]=0，其余初始化为不可能的大数 amount+1。若 x >= coin，则 dp[x] = min(dp[x], dp[x-coin]+1)。",
      details: "amount + 1 是安全哨兵，因为最多用 amount 个 1 元硬币。最后如果 dp[amount] 仍大于 amount，说明无法凑成。完全背包一维写法通常金额正序遍历。",
      code: "public int coinChange(int[] coins, int amount) {\n    int max = amount + 1;\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, max);\n    dp[0] = 0;\n    for (int x = 1; x <= amount; x++) {\n        for (int coin : coins) {\n            if (x >= coin) dp[x] = Math.min(dp[x], dp[x - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
      complexity: "时间 O(amount * coins.length)，空间 O(amount)",
      related: "LC 322 零钱兑换，LC 518 零钱兑换 II"
    },
    {
      id: "greedy-jump-game",
      title: "LC 55 跳跃游戏",
      topic: "贪心",
      difficulty: "中等",
      source: "Hot100 / LC 55",
      tags: ["覆盖范围", "局部最优", "可达性"],
      front: "如何判断从下标 0 出发，能否到达最后一个下标，而不枚举所有跳法？",
      hint: "关心的不是具体路径，而是当前能覆盖到的最远位置。",
      shortAnswer: "维护 farthest 表示目前能到达的最远下标。遍历 i 时，如果 i > farthest 说明不可达；否则更新 farthest = max(farthest, i + nums[i])。",
      details: "局部最优是持续扩大覆盖范围。只要某个位置在覆盖范围内，就不用关心它是怎么来的；它贡献的是新的最大覆盖。",
      code: "public boolean canJump(int[] nums) {\n    int farthest = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (i > farthest) return false;\n        farthest = Math.max(farthest, i + nums[i]);\n        if (farthest >= nums.length - 1) return true;\n    }\n    return true;\n}",
      complexity: "时间 O(n)，空间 O(1)",
      related: "LC 55 跳跃游戏，LC 45 跳跃游戏 II"
    },
    {
      id: "interview-lru",
      title: "LC 146 LRU 缓存",
      topic: "高频面试",
      difficulty: "困难",
      source: "Hot100 / LC 146",
      tags: ["HashMap", "双向链表", "设计题"],
      front: "如何设计一个缓存，使 get 和 put 都是 O(1)，并在容量满时淘汰最久未使用的项？",
      hint: "需要同时解决“快速定位”和“快速调整新旧顺序”两个需求。",
      shortAnswer: "map: key -> node。链表头表示最近使用，尾表示最久未使用。get 命中后移到头部；put 已存在则更新并移头，不存在则新建移头，超过容量删除尾节点。",
      details: "单 HashMap 不知道淘汰谁，单链表定位节点不是 O(1)。双向链表常用 dummyHead/dummyTail 简化边界。面试时先讲不变量，再写 addFirst/remove/moveToHead/removeTail。",
      code: "class Node {\n    int key, value;\n    Node prev, next;\n    Node(int k, int v) { key = k; value = v; }\n}\n// get: if absent return -1; else moveToHead(node)\n// put: update or addFirst; if size > capacity removeTail",
      complexity: "get O(1)，put O(1)，空间 O(capacity)",
      related: "LC 146 LRU 缓存，LC 460 LFU 缓存"
    }
  ];

  const state = {
    cards: [],
    overrides: {},
    deletedIds: [],
    progress: {},
    daily: { date: "", usedIds: [], deckIds: [] },
    dailyMode: false,
    activeId: null,
    editingId: null,
    selectedTopic: "全部",
    query: "",
    weakOnly: false,
    customOnly: false,
    listCollapsed: false,
    flipped: false,
    hintVisible: false,
    aiConfig: { model: "deepseek-v4-pro" }
  };

  const els = {
    searchInput: document.getElementById("searchInput"),
    topicFilters: document.getElementById("topicFilters"),
    weakOnlyToggle: document.getElementById("weakOnlyToggle"),
    customOnlyToggle: document.getElementById("customOnlyToggle"),
    totalCount: document.getElementById("totalCount"),
    weakCount: document.getElementById("weakCount"),
    knownCount: document.getElementById("knownCount"),
    dailyDeckButton: document.getElementById("dailyDeckButton"),
    redrawDailyButton: document.getElementById("redrawDailyButton"),
    allCardsButton: document.getElementById("allCardsButton"),
    dailyStatus: document.getElementById("dailyStatus"),
    flashcard: document.getElementById("flashcard"),
    cardTopic: document.getElementById("cardTopic"),
    cardDifficulty: document.getElementById("cardDifficulty"),
    cardSource: document.getElementById("cardSource"),
    cardSourceFront: document.getElementById("cardSourceFront"),
    cardTitle: document.getElementById("cardTitle"),
    cardFront: document.getElementById("cardFront"),
    cardHint: document.getElementById("cardHint"),
    hintButton: document.getElementById("hintButton"),
    cardTags: document.getElementById("cardTags"),
    cardShortAnswer: document.getElementById("cardShortAnswer"),
    cardComplexity: document.getElementById("cardComplexity"),
    cardDetails: document.getElementById("cardDetails"),
    cardCode: document.getElementById("cardCode"),
    cardRelated: document.getElementById("cardRelated"),
    cardList: document.getElementById("cardList"),
    listSummary: document.getElementById("listSummary"),
    toggleListButton: document.getElementById("toggleListButton"),
    flipButton: document.getElementById("flipButton"),
    shuffleButton: document.getElementById("shuffleButton"),
    againButton: document.getElementById("againButton"),
    hardButton: document.getElementById("hardButton"),
    goodButton: document.getElementById("goodButton"),
    masteredButton: document.getElementById("masteredButton"),
    addTab: document.getElementById("addTab"),
    dataTab: document.getElementById("dataTab"),
    addPane: document.getElementById("addPane"),
    editCurrentButton: document.getElementById("editCurrentButton"),
    deleteCurrentButton: document.getElementById("deleteCurrentButton"),
    editStatus: document.getElementById("editStatus"),
    addCardForm: document.getElementById("addCardForm"),
    saveCardButton: document.getElementById("saveCardButton"),
    cancelEditButton: document.getElementById("cancelEditButton"),
    dataTools: document.getElementById("dataTools"),
    modelSelect: document.getElementById("modelSelect"),
    aiProblemInput: document.getElementById("aiProblemInput"),
    aiCodeInput: document.getElementById("aiCodeInput"),
    aiNoteInput: document.getElementById("aiNoteInput"),
    generateDraftButton: document.getElementById("generateDraftButton"),
    aiStatus: document.getElementById("aiStatus"),
    exportButton: document.getElementById("exportButton"),
    importInput: document.getElementById("importInput"),
    deleteCustomButton: document.getElementById("deleteCustomButton"),
    restoreBuiltInButton: document.getElementById("restoreBuiltInButton"),
    resetProgressButton: document.getElementById("resetProgressButton")
  };

  function load() {
    const customCards = readJson(STORAGE_KEY, readJson(LEGACY_STORAGE_KEY, []));
    state.overrides = readJson(OVERRIDES_KEY, {});
    state.deletedIds = readJson(DELETED_KEY, []);
    state.progress = readJson(PROGRESS_KEY, {});
    state.daily = readJson(DAILY_KEY, { date: "", usedIds: [], deckIds: [] });
    state.aiConfig = readJson(AI_CONFIG_KEY, state.aiConfig);
    const hot100Cards = (window.HOT100_CARDS || []).map(normalizeCard);
    const hot100Numbers = new Set(hot100Cards.map((card) => getLcNumber(card.title)).filter(Boolean));
    const deleted = new Set(state.deletedIds);
    const defaultCards = DEFAULT_CARDS
      .filter((card) => !hot100Numbers.has(getLcNumber(card.title + " " + card.related)))
      .filter((card) => !deleted.has(card.id))
      .map((card) => normalizeCard({ ...card, ...(state.overrides[card.id] || {}) }));
    const seededHot100 = hot100Cards
      .filter((card) => !deleted.has(card.id))
      .map((card) => normalizeCard({ ...card, ...(state.overrides[card.id] || {}) }));
    state.cards = [...seededHot100, ...defaultCards, ...customCards.map(normalizeCard).filter((card) => !deleted.has(card.id))];
    state.activeId = state.cards[0] ? state.cards[0].id : null;
    els.modelSelect.value = state.aiConfig.model || "deepseek-v4-pro";
    render();
  }

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function normalizeCard(card) {
    return {
      difficulty: "自定义",
      source: "我的卡片",
      tags: [],
      hint: "",
      details: "",
      code: "",
      complexity: "",
      related: "",
      ...card,
      custom: Boolean(card.custom)
    };
  }

  function saveCustomCards() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards.filter((card) => card.custom)));
  }

  function saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
  }

  function saveDaily() {
    localStorage.setItem(DAILY_KEY, JSON.stringify(state.daily));
  }

  function saveOverrides() {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(state.overrides));
  }

  function saveDeletedIds() {
    localStorage.setItem(DELETED_KEY, JSON.stringify(state.deletedIds));
  }

  function getLcNumber(text) {
    const match = String(text || "").match(/LC\s*(\d+)/i);
    return match ? match[1] : "";
  }

  function saveAiConfig() {
    state.aiConfig = {
      model: els.modelSelect.value
    };
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(state.aiConfig));
    setAiStatus("模型设置已保存。API Key 由本地服务读取。");
  }

  function getTopics() {
    return ["全部", ...Array.from(new Set([...TOPICS, ...state.cards.map((card) => card.topic)]))];
  }

  function getFilteredCards() {
    const query = state.query.trim().toLowerCase();
    const dailyIds = new Set(state.dailyMode ? state.daily.deckIds : []);
    const filtered = state.cards.filter((card) => {
      const progress = state.progress[card.id] || {};
      const haystack = [
        card.title,
        card.topic,
        card.source,
        card.front,
        card.shortAnswer,
        card.details,
        card.related,
        ...(card.tags || [])
      ].join(" ").toLowerCase();
      return (!state.dailyMode || dailyIds.has(card.id))
        && (state.selectedTopic === "全部" || card.topic === state.selectedTopic)
        && (!query || haystack.includes(query))
        && (!state.weakOnly || progress.status === "again" || progress.status === "hard")
        && (!state.customOnly || card.custom);
    });
    return sortForReview(filtered);
  }

  function sortForReview(cards) {
    return [...cards].sort((a, b) => reviewRank(a) - reviewRank(b));
  }

  function reviewRank(card) {
    const status = state.progress[card.id]?.status;
    if (status === "again") return 0;
    if (status === "hard") return 1;
    if (!status) return 2;
    if (status === "good") return 3;
    if (status === "mastered") return 4;
    return 2;
  }

  function render() {
    renderTopicFilters();
    renderStats();
    renderDailyStatus();
    renderCardList();
    renderActiveCard();
  }

  function renderTopicFilters() {
    els.topicFilters.innerHTML = "";
    getTopics().forEach((topic) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tag-button" + (topic === state.selectedTopic ? " active" : "");
      button.textContent = topic;
      button.addEventListener("click", () => {
        state.selectedTopic = topic;
        chooseFirstFiltered();
        render();
      });
      els.topicFilters.appendChild(button);
    });
  }

  function renderStats() {
    const filtered = getFilteredCards();
    const progressValues = filtered.map((card) => state.progress[card.id] || {});
    els.totalCount.textContent = filtered.length;
    els.weakCount.textContent = progressValues.filter((item) => item.status === "again" || item.status === "hard").length;
    els.knownCount.textContent = progressValues.filter((item) => item.status === "mastered").length;
  }

  function renderDailyStatus() {
    const total = state.cards.length;
    const used = state.daily.usedIds.filter((id) => state.cards.some((card) => card.id === id)).length;
    const deckIds = state.daily.deckIds.filter((id) => state.cards.some((card) => card.id === id));
    const todayCount = deckIds.length;
    const reviewedToday = deckIds.filter((id) => isReviewedToday(state.progress[id])).length;
    els.dailyDeckButton.classList.toggle("active-mode", state.dailyMode);
    els.dailyStatus.textContent = state.dailyMode
      ? `今日 ${todayCount} 张，已复习 ${reviewedToday}/${todayCount}；本轮已抽 ${used}/${total} 张。`
      : `每天抽 10 张，不重复抽完整个卡池。已抽 ${used}/${total} 张。`;
  }

  function todayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isReviewedToday(progress) {
    if (!progress?.updatedAt) return false;
    return formatLocalDate(new Date(progress.updatedAt)) === todayKey();
  }

  function formatLocalDate(date) {
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function ensureDailyDeck() {
    const today = todayKey();
    const validIds = new Set(state.cards.map((card) => card.id));
    state.daily.usedIds = (state.daily.usedIds || []).filter((id) => validIds.has(id));
    state.daily.deckIds = (state.daily.deckIds || []).filter((id) => validIds.has(id));

    if (state.daily.date === today && state.daily.deckIds.length) {
      saveDaily();
      return;
    }

    const used = new Set(state.daily.usedIds);
    let remaining = state.cards.filter((card) => !used.has(card.id));
    if (!remaining.length) {
      state.daily.usedIds = [];
      remaining = [...state.cards];
    }

    const shuffled = shuffleCards(remaining);
    const deck = shuffled.slice(0, Math.min(10, shuffled.length));
    state.daily.date = today;
    state.daily.deckIds = deck.map((card) => card.id);
    state.daily.usedIds = Array.from(new Set([...state.daily.usedIds, ...state.daily.deckIds]));
    saveDaily();
  }

  function redrawDailyDeck() {
    state.daily.usedIds = state.daily.usedIds.filter((id) => !state.daily.deckIds.includes(id));
    state.daily.deckIds = [];
    state.daily.date = "";
    ensureDailyDeck();
  }

  function shuffleCards(cards) {
    const result = [...cards];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function renderCardList() {
    const filtered = getFilteredCards();
    els.cardList.innerHTML = "";
    els.listSummary.textContent = state.dailyMode
      ? `今日复习 ${filtered.length} 张`
      : `当前卡池 ${filtered.length} 张`;
    els.toggleListButton.textContent = state.listCollapsed ? "展开列表" : "收起列表";
    els.cardList.classList.toggle("hidden", state.listCollapsed);
    if (state.listCollapsed) return;
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "list-item";
      empty.innerHTML = "<strong>没有匹配卡片</strong><span>换个关键词或关闭筛选。</span>";
      els.cardList.appendChild(empty);
      return;
    }

    filtered.forEach((card) => {
      const progress = state.progress[card.id] || {};
      const button = document.createElement("button");
      button.type = "button";
      button.className = "list-item" + (card.id === state.activeId ? " active" : "");
      button.innerHTML = `
        <span class="status">${statusText(progress.status)}</span>
        <strong>${escapeHtml(card.title)}</strong>
        <span>${escapeHtml(card.source || "自定义")}</span>
      `;
      button.addEventListener("click", () => {
        state.activeId = card.id;
        state.flipped = false;
        state.hintVisible = false;
        renderActiveCard();
        renderCardList();
      });
      els.cardList.appendChild(button);
    });
  }

  function renderActiveCard() {
    const card = state.cards.find((item) => item.id === state.activeId) || getFilteredCards()[0];
    if (!card) {
      renderEmptyCard();
      return;
    }

    state.activeId = card.id;
    const filtered = getFilteredCards();
    const position = filtered.findIndex((item) => item.id === card.id) + 1;
    const progress = state.progress[card.id] || {};
    els.flashcard.classList.toggle("flipped", state.flipped);
    els.flipButton.textContent = state.flipped ? "回到题面" : "看答案";
    els.cardSourceFront.textContent = [
      card.source || "自定义",
      statusText(progress.status),
      position > 0 ? `${position}/${filtered.length}` : ""
    ].filter(Boolean).join(" · ");
    els.cardTopic.textContent = card.topic;
    els.cardDifficulty.textContent = card.difficulty || "未分级";
    els.cardSource.textContent = card.source || "自定义";
    els.cardTitle.textContent = card.title;
    els.cardFront.textContent = card.front;
    els.cardHint.textContent = card.hint || "先用自己的话说出思路，再看答案。";
    els.cardHint.classList.toggle("hidden", !state.hintVisible);
    els.hintButton.textContent = state.hintVisible ? "隐藏提示" : "显示提示";
    els.cardShortAnswer.textContent = card.shortAnswer || "暂无精简答案。";
    els.cardComplexity.textContent = card.complexity || "待补充";
    els.cardDetails.textContent = card.details || "暂无详细复盘。";
    els.cardCode.innerHTML = highlightJava(card.code || "// 待补充 Java 代码");
    els.cardRelated.textContent = card.related || "待补充";
    els.cardTags.innerHTML = "";
    els.cardTags.classList.toggle("hidden", !state.flipped);
    (card.tags || []).forEach((tag) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = tag;
      els.cardTags.appendChild(span);
    });
  }

  function renderEmptyCard() {
    state.flipped = false;
    state.hintVisible = false;
    els.flashcard.classList.remove("flipped");
    els.flipButton.textContent = "看答案";
    els.cardSourceFront.textContent = "没有匹配结果";
    els.cardTitle.textContent = "没有匹配卡片";
    els.cardFront.textContent = "换个关键词、关闭筛选，或回到全部卡池继续复习。";
    els.cardHint.textContent = "当前筛选条件下没有可复习卡片。";
    els.cardHint.classList.add("hidden");
    els.hintButton.textContent = "显示提示";
    els.cardTopic.textContent = "专题";
    els.cardDifficulty.textContent = "难度";
    els.cardSource.textContent = "来源";
    els.cardShortAnswer.textContent = "暂无内容。";
    els.cardComplexity.textContent = "暂无内容。";
    els.cardDetails.textContent = "暂无内容。";
    els.cardCode.innerHTML = "";
    els.cardRelated.textContent = "暂无内容。";
    els.cardTags.innerHTML = "";
    els.cardTags.classList.add("hidden");
  }

  function statusText(status) {
    return {
      again: "薄弱",
      hard: "模糊",
      good: "记住",
      mastered: "掌握"
    }[status] || "新卡";
  }

  function chooseFirstFiltered() {
    const filtered = getFilteredCards();
    state.activeId = filtered[0] ? filtered[0].id : null;
    state.flipped = false;
    state.hintVisible = false;
  }

  function advanceToNextCard(previousOrder = getFilteredCards()) {
    const filtered = getFilteredCards();
    if (!filtered.length) {
      state.activeId = null;
      state.flipped = false;
      state.hintVisible = false;
      return;
    }
    const currentId = state.activeId;
    const availableIds = new Set(filtered.map((card) => card.id));
    const oldIndex = previousOrder.findIndex((card) => card.id === currentId);
    let next = null;

    if (oldIndex >= 0 && previousOrder.length > 1) {
      for (let step = 1; step < previousOrder.length; step++) {
        const candidate = previousOrder[(oldIndex + step) % previousOrder.length];
        if (candidate.id !== currentId && availableIds.has(candidate.id)) {
          next = candidate;
          break;
        }
      }
    }

    if (!next) {
      next = filtered.find((card) => card.id !== currentId) || filtered[0];
    }

    state.activeId = next.id;
    state.flipped = false;
    state.hintVisible = false;
  }

  function mark(status) {
    if (!state.activeId) return;
    const previousOrder = getFilteredCards();
    if (!state.flipped && (status === "again" || status === "hard")) {
      state.flipped = true;
      state.hintVisible = false;
      render();
      return;
    }
    const current = state.progress[state.activeId] || { reviews: 0 };
    state.progress[state.activeId] = {
      status,
      reviews: (current.reviews || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    saveProgress();
    advanceToNextCard(previousOrder);
    render();
  }

  function addCard(formData) {
    const card = buildCardFromForm(formData, {
      id: "custom-" + Date.now(),
      custom: true,
      difficulty: "自定义",
      source: "我的卡片"
    });
    state.cards.push(card);
    state.activeId = card.id;
    state.selectedTopic = "全部";
    state.flipped = false;
    state.hintVisible = false;
    saveCustomCards();
    els.addCardForm.reset();
    render();
  }

  function buildCardFromForm(formData, base) {
    return normalizeCard({
      ...base,
      title: formData.get("title").trim(),
      topic: formData.get("topic"),
      tags: formData.get("tags").split(",").map((tag) => tag.trim()).filter(Boolean),
      front: formData.get("front").trim(),
      hint: formData.get("hint").trim(),
      shortAnswer: formData.get("shortAnswer").trim(),
      details: formData.get("details").trim(),
      code: formData.get("code").trim(),
      complexity: formData.get("complexity").trim(),
      related: formData.get("related").trim()
    });
  }

  function saveCard(formData) {
    if (!state.editingId) {
      addCard(formData);
      return;
    }

    const existing = state.cards.find((card) => card.id === state.editingId);
    if (!existing) return;

    const updated = buildCardFromForm(formData, existing);
    const index = state.cards.findIndex((card) => card.id === state.editingId);
    state.cards[index] = updated;

    if (updated.custom) {
      saveCustomCards();
    } else {
      state.overrides[updated.id] = updated;
      saveOverrides();
    }

    state.activeId = updated.id;
    state.flipped = false;
    state.hintVisible = false;
    exitEditMode();
    render();
  }

  async function generateDraft() {
    const problem = els.aiProblemInput.value.trim();
    const code = els.aiCodeInput.value.trim();
    const notes = els.aiNoteInput.value.trim();
    const model = els.modelSelect.value;

    if (!problem && !code) {
      alert("先粘贴题目或 Java 代码。");
      return;
    }

    setAiBusy(true);
    setAiStatus("正在生成卡片草稿...");

    try {
      saveAiConfig();
      const draft = await requestCardDraft({ problem, code, notes, model });
      fillForm(draft);
      setAiStatus("草稿已填入下方表单。你可以先检查、修改，再点击添加卡片。");
    } catch (error) {
      setAiStatus("生成失败：" + error.message);
    } finally {
      setAiBusy(false);
    }
  }

  async function requestCardDraft({ problem, code, notes, model }) {
    const payload = {
      model,
      messages: [
        {
          role: "system",
          content: "你是一个 Java 算法面试记忆卡片制卡助手。只输出严格 JSON，不要输出 Markdown。"
        },
        {
          role: "user",
          content: buildPrompt(problem, code, notes)
        }
      ],
      temperature: 0.2,
      stream: false
    };

    if (location.protocol === "file:") {
      throw new Error("智能制卡需要通过本地服务打开。请运行 node server.js 后访问 http://localhost:8787。");
    }

    const response = await fetch("/api/generate-card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "本地服务请求失败：" + response.status);
    }
    return parseDraft((await response.json()).content);
  }

  function buildPrompt(problem, code, notes) {
    return [
      "请根据下面的题目和 Java 代码，生成一张适合 Anki 式复习的 Java 算法记忆卡。",
      "要求：",
      `1. topic 必须是以下之一：${TOPICS.join("、")}。`,
      "2. title 必须写成“LC 题号 题目名”的格式；如果题号未知，写清题目名。示例：LC 11 盛最多水的容器。",
      "3. title 不要出现算法方法名，例如不要写“滑动窗口：xxx”“动态规划：xxx”。",
      "4. front 必须是完整清楚的题面描述，像 LeetCode 原题一样说明输入、输出目标、约束关系或返回值要求。",
      "5. front 必须包含 1 个示例，格式包含“示例：”“输入：”“输出：”，必要时可加“解释：”。",
      "6. front 只描述题目本身，不要说明属于什么方法，也不要说明用什么方法解答，不能出现“双指针/滑动窗口/动态规划/回溯/贪心/二分/哈希/栈/堆”等解法提示词。",
      "7. hint 只给非常轻的边界或观察提示，不要直接写方法名。",
      "8. shortAnswer 用 3 到 5 句话讲核心思路，可以在这里说明方法。",
      "9. details 写清状态、数据结构、边界、易错点、为什么这样做。",
      "10. complexity 必须写清时间复杂度和空间复杂度。",
      "11. code 字段放 Java 代码，不要写伪代码；如果用户给了代码，优先保留并可做少量整理。",
      "12. tags 是字符串数组。",
      "13. 只返回 JSON，字段为 title, topic, front, hint, shortAnswer, details, code, complexity, tags, related。",
      "",
      "题目：",
      problem || "未提供",
      "",
      "Java 代码：",
      code || "未提供",
      "",
      "补充要求：",
      notes || "无"
    ].join("\n");
  }

  function parseDraft(content) {
    const jsonText = extractJson(content);
    const draft = JSON.parse(jsonText);
    if (!TOPICS.includes(draft.topic)) draft.topic = "高频面试";
    draft.tags = Array.isArray(draft.tags) ? draft.tags : String(draft.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    return draft;
  }

  function extractJson(content) {
    const trimmed = content.trim();
    if (trimmed.startsWith("{")) return trimmed;
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (match) return match[1].trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
    throw new Error("模型没有返回可解析的 JSON。");
  }

  function fillForm(draft) {
    const form = els.addCardForm;
    ensureTopicOption(draft.topic);
    form.elements.title.value = draft.title || "";
    form.elements.topic.value = TOPICS.includes(draft.topic) ? draft.topic : "高频面试";
    form.elements.front.value = draft.front || "";
    form.elements.hint.value = draft.hint || "";
    form.elements.shortAnswer.value = draft.shortAnswer || "";
    form.elements.details.value = draft.details || "";
    form.elements.code.value = draft.code || els.aiCodeInput.value.trim();
    form.elements.complexity.value = draft.complexity || "";
    form.elements.tags.value = (draft.tags || []).join(", ");
    form.elements.related.value = draft.related || "";
  }

  function ensureTopicOption(topic) {
    const select = els.addCardForm.elements.topic;
    const value = TOPICS.includes(topic) ? topic : "高频面试";
    if (![...select.options].some((option) => option.value === value)) {
      select.add(new Option(value, value));
    }
  }

  function fillFormFromCard(card) {
    fillForm({
      title: card.title,
      topic: card.topic,
      front: card.front,
      hint: card.hint,
      shortAnswer: card.shortAnswer,
      details: card.details,
      code: card.code,
      complexity: card.complexity,
      tags: card.tags || [],
      related: card.related
    });
  }

  function editCurrentCard() {
    const card = state.cards.find((item) => item.id === state.activeId);
    if (!card) return;
    state.editingId = card.id;
    fillFormFromCard(card);
    els.saveCardButton.textContent = "保存修改";
    els.cancelEditButton.classList.remove("hidden");
    els.editStatus.textContent = "正在编辑当前卡片。保存前可以继续手动修改。";
    els.addTab.click();
    els.addCardForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exitEditMode() {
    state.editingId = null;
    els.addCardForm.reset();
    els.saveCardButton.textContent = "添加卡片";
    els.cancelEditButton.classList.add("hidden");
    els.editStatus.textContent = "编辑会把当前卡片内容载入下方表单。";
  }

  function setAiBusy(isBusy) {
    els.generateDraftButton.disabled = isBusy;
    els.generateDraftButton.textContent = isBusy ? "生成中..." : "智能填写草稿";
  }

  function setAiStatus(text) {
    els.aiStatus.textContent = text;
  }

  function exportData() {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      customCards: state.cards.filter((card) => card.custom),
      overrides: state.overrides,
      deletedIds: state.deletedIds,
      progress: state.progress
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "java-algorithm-flashcards.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        const importedCards = Array.isArray(payload.customCards) ? payload.customCards : [];
        const existing = new Map(state.cards.filter((card) => card.custom).map((card) => [card.id, card]));
        importedCards.forEach((card) => existing.set(card.id || "custom-" + Date.now(), normalizeCard({ ...card, custom: true })));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(existing.values())));
        if (payload.progress && typeof payload.progress === "object") {
          state.progress = { ...state.progress, ...payload.progress };
          saveProgress();
        }
        if (payload.overrides && typeof payload.overrides === "object") {
          state.overrides = { ...state.overrides, ...payload.overrides };
          saveOverrides();
        }
        if (Array.isArray(payload.deletedIds)) {
          state.deletedIds = Array.from(new Set([...state.deletedIds, ...payload.deletedIds]));
          saveDeletedIds();
        }
        load();
      } catch (error) {
        alert("导入失败：JSON 格式不正确。");
      }
    };
    reader.readAsText(file);
  }

  function deleteCurrentCard() {
    const card = state.cards.find((item) => item.id === state.activeId);
    if (!card) return;
    if (!confirm("确定删除这张卡片吗？")) return;
    state.cards = state.cards.filter((item) => item.id !== card.id);
    delete state.progress[card.id];
    state.daily.deckIds = state.daily.deckIds.filter((id) => id !== card.id);
    state.daily.usedIds = state.daily.usedIds.filter((id) => id !== card.id);
    saveDaily();
    if (card.custom) {
      saveCustomCards();
    } else {
      if (!state.deletedIds.includes(card.id)) state.deletedIds.push(card.id);
      delete state.overrides[card.id];
      saveDeletedIds();
      saveOverrides();
    }
    saveProgress();
    if (state.editingId === card.id) exitEditMode();
    chooseFirstFiltered();
    render();
  }

  function restoreBuiltInCards() {
    if (!state.deletedIds.length && !Object.keys(state.overrides).length) {
      alert("内置卡片已经是默认状态。");
      return;
    }
    if (!confirm("确定恢复所有内置卡片吗？这会撤销对内置卡片的删除和修改，自定义卡片与复习进度会保留。")) return;
    state.deletedIds = [];
    state.overrides = {};
    saveDeletedIds();
    saveOverrides();
    load();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function highlightJava(code) {
    const keywords = new Set("public private protected class static final void int long double float boolean char byte short new return if else for while do switch case break continue try catch throw throws extends implements interface import package null true false this super".split(" "));
    const types = new Set("String Integer Long Double Boolean Character List ArrayList LinkedList Map HashMap Set HashSet Deque ArrayDeque Queue PriorityQueue Stack Arrays Collections Math".split(" "));
    const tokenPattern = /(\/\/.*?$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b/gm;
    let output = "";
    let lastIndex = 0;

    String(code).replace(tokenPattern, (token, comment, stringValue, offset) => {
      output += escapeHtml(String(code).slice(lastIndex, offset));
      const safe = escapeHtml(token);
      if (comment) output += `<span class="code-comment">${safe}</span>`;
      else if (stringValue) output += `<span class="code-string">${safe}</span>`;
      else if (/^\d/.test(token)) output += `<span class="code-number">${safe}</span>`;
      else if (keywords.has(token)) output += `<span class="code-keyword">${safe}</span>`;
      else if (types.has(token)) output += `<span class="code-type">${safe}</span>`;
      else output += safe;
      lastIndex = offset + token.length;
      return token;
    });

    output += escapeHtml(String(code).slice(lastIndex));
    return output;
  }

  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    chooseFirstFiltered();
    render();
  });

  els.weakOnlyToggle.addEventListener("change", (event) => {
    state.weakOnly = event.target.checked;
    chooseFirstFiltered();
    render();
  });

  els.customOnlyToggle.addEventListener("change", (event) => {
    state.customOnly = event.target.checked;
    chooseFirstFiltered();
    render();
  });

  els.dailyDeckButton.addEventListener("click", () => {
    ensureDailyDeck();
    state.dailyMode = true;
    chooseFirstFiltered();
    render();
  });

  els.redrawDailyButton.addEventListener("click", () => {
    if (!confirm("确定重抽今天的 10 张吗？当前今日牌组会放回卡池。")) return;
    redrawDailyDeck();
    state.dailyMode = true;
    chooseFirstFiltered();
    render();
  });

  els.allCardsButton.addEventListener("click", () => {
    state.dailyMode = false;
    chooseFirstFiltered();
    render();
  });

  els.flipButton.addEventListener("click", () => {
    state.flipped = !state.flipped;
    state.hintVisible = false;
    renderActiveCard();
  });

  els.flashcard.addEventListener("dblclick", () => {
    state.flipped = !state.flipped;
    state.hintVisible = false;
    renderActiveCard();
  });

  els.flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      state.flipped = !state.flipped;
      state.hintVisible = false;
      renderActiveCard();
    }
  });

  els.hintButton.addEventListener("click", () => {
    state.hintVisible = !state.hintVisible;
    renderActiveCard();
  });

  els.shuffleButton.addEventListener("click", () => {
    const filtered = getFilteredCards();
    if (!filtered.length) return;
    const next = filtered[Math.floor(Math.random() * filtered.length)];
    state.activeId = next.id;
    state.flipped = false;
    state.hintVisible = false;
    render();
  });

  els.toggleListButton.addEventListener("click", () => {
    state.listCollapsed = !state.listCollapsed;
    renderCardList();
  });

  els.againButton.addEventListener("click", () => mark("again"));
  els.hardButton.addEventListener("click", () => mark("hard"));
  els.goodButton.addEventListener("click", () => mark("good"));
  els.masteredButton.addEventListener("click", () => mark("mastered"));

  els.addTab.addEventListener("click", () => {
    els.addTab.classList.add("active");
    els.dataTab.classList.remove("active");
    els.addPane.classList.remove("hidden");
    els.dataTools.classList.add("hidden");
  });

  els.dataTab.addEventListener("click", () => {
    els.dataTab.classList.add("active");
    els.addTab.classList.remove("active");
    els.dataTools.classList.remove("hidden");
    els.addPane.classList.add("hidden");
  });

  els.modelSelect.addEventListener("change", saveAiConfig);
  els.generateDraftButton.addEventListener("click", generateDraft);
  els.editCurrentButton.addEventListener("click", editCurrentCard);
  els.deleteCurrentButton.addEventListener("click", deleteCurrentCard);
  els.cancelEditButton.addEventListener("click", exitEditMode);

  els.addCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCard(new FormData(els.addCardForm));
  });

  els.exportButton.addEventListener("click", exportData);

  els.importInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) importData(file);
    event.target.value = "";
  });

  els.deleteCustomButton.addEventListener("click", deleteCurrentCard);
  els.restoreBuiltInButton.addEventListener("click", restoreBuiltInCards);

  els.resetProgressButton.addEventListener("click", () => {
    if (!confirm("确定清空所有复习进度吗？卡片不会删除。")) return;
    state.progress = {};
    saveProgress();
    render();
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea, select")) return;
    if (event.key.toLowerCase() === "f") {
      state.flipped = !state.flipped;
      state.hintVisible = false;
      renderActiveCard();
    }
    if (event.key.toLowerCase() === "r") els.shuffleButton.click();
    if (event.key === "1") mark("again");
    if (event.key === "2") mark("hard");
    if (event.key === "3") mark("good");
    if (event.key === "4") mark("mastered");
  });

  load();
})();
