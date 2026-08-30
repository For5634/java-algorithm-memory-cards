(function () {
  const STORAGE_KEY = "java-algorithm-flashcards:v2";
  const LEGACY_STORAGE_KEY = "java-algorithm-flashcards:v1";
  const OVERRIDES_KEY = "java-algorithm-overrides:v1";
  const DELETED_KEY = "java-algorithm-deleted:v1";
  const PROGRESS_KEY = "java-algorithm-progress:v1";
  const DAILY_KEY = "java-algorithm-daily:v1";
  const AI_CONFIG_KEY = "java-algorithm-ai-config:v1";
  const TOPICS = ["哈希", "双指针", "滑动窗口", "栈", "动态规划", "数组", "矩阵", "链表", "堆", "二叉树", "图论", "回溯", "二分", "贪心", "多维动态规划", "技巧", "高频面试"];
  const LEETCODE_SLUGS = {
    1: "two-sum",
    2: "add-two-numbers",
    3: "longest-substring-without-repeating-characters",
    4: "median-of-two-sorted-arrays",
    5: "longest-palindromic-substring",
    7: "reverse-integer",
    8: "string-to-integer-atoi",
    9: "palindrome-number",
    10: "regular-expression-matching",
    11: "container-with-most-water",
    13: "roman-to-integer",
    15: "3sum",
    17: "letter-combinations-of-a-phone-number",
    19: "remove-nth-node-from-end-of-list",
    20: "valid-parentheses",
    21: "merge-two-sorted-lists",
    22: "generate-parentheses",
    23: "merge-k-sorted-lists",
    24: "swap-nodes-in-pairs",
    25: "reverse-nodes-in-k-group",
    31: "next-permutation",
    32: "longest-valid-parentheses",
    33: "search-in-rotated-sorted-array",
    34: "find-first-and-last-position-of-element-in-sorted-array",
    35: "search-insert-position",
    39: "combination-sum",
    40: "combination-sum-ii",
    41: "first-missing-positive",
    42: "trapping-rain-water",
    45: "jump-game-ii",
    46: "permutations",
    48: "rotate-image",
    49: "group-anagrams",
    51: "n-queens",
    53: "maximum-subarray",
    54: "spiral-matrix",
    55: "jump-game",
    56: "merge-intervals",
    62: "unique-paths",
    64: "minimum-path-sum",
    70: "climbing-stairs",
    72: "edit-distance",
    73: "set-matrix-zeroes",
    74: "search-a-2d-matrix",
    75: "sort-colors",
    76: "minimum-window-substring",
    78: "subsets",
    79: "word-search",
    84: "largest-rectangle-in-histogram",
    94: "binary-tree-inorder-traversal",
    98: "validate-binary-search-tree",
    100: "same-tree",
    101: "symmetric-tree",
    102: "binary-tree-level-order-traversal",
    104: "maximum-depth-of-binary-tree",
    105: "construct-binary-tree-from-preorder-and-inorder-traversal",
    108: "convert-sorted-array-to-binary-search-tree",
    114: "flatten-binary-tree-to-linked-list",
    118: "pascals-triangle",
    121: "best-time-to-buy-and-sell-stock",
    124: "binary-tree-maximum-path-sum",
    128: "longest-consecutive-sequence",
    131: "palindrome-partitioning",
    136: "single-number",
    138: "copy-list-with-random-pointer",
    139: "word-break",
    141: "linked-list-cycle",
    142: "linked-list-cycle-ii",
    146: "lru-cache",
    148: "sort-list",
    152: "maximum-product-subarray",
    153: "find-minimum-in-rotated-sorted-array",
    155: "min-stack",
    160: "intersection-of-two-linked-lists",
    169: "majority-element",
    189: "rotate-array",
    198: "house-robber",
    199: "binary-tree-right-side-view",
    200: "number-of-islands",
    206: "reverse-linked-list",
    207: "course-schedule",
    208: "implement-trie-prefix-tree",
    215: "kth-largest-element-in-an-array",
    226: "invert-binary-tree",
    230: "kth-smallest-element-in-a-bst",
    234: "palindrome-linked-list",
    236: "lowest-common-ancestor-of-a-binary-tree",
    238: "product-of-array-except-self",
    239: "sliding-window-maximum",
    240: "search-a-2d-matrix-ii",
    279: "perfect-squares",
    283: "move-zeroes",
    287: "find-the-duplicate-number",
    295: "find-median-from-data-stream",
    300: "longest-increasing-subsequence",
    322: "coin-change",
    347: "top-k-frequent-elements",
    394: "decode-string",
    416: "partition-equal-subset-sum",
    437: "path-sum-iii",
    438: "find-all-anagrams-in-a-string",
    543: "diameter-of-binary-tree",
    560: "subarray-sum-equals-k",
    704: "binary-search",
    739: "daily-temperatures",
    763: "partition-labels",
    875: "koko-eating-bananas",
    994: "rotting-oranges",
    1011: "capacity-to-ship-packages-within-d-days",
    1143: "longest-common-subsequence"
  };

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

  const FAMILIAR_CARDS = [
    {
      id: "familiar-card-flow",
      title: "熟悉 01 标准复习流程",
      topic: "高频面试",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "复习流程", "自测"],
      front: "拿到一张算法卡时，如何在不急着看答案的情况下完成一次有效自测？请按题面、示例、约束、边界四个角度回忆。",
      hint: "先说输入输出，再说关键状态，最后说边界。",
      shortAnswer: "先用自己的话复述题目，再根据示例手推一遍。接着回忆要维护的状态或数据结构，最后检查空输入、重复值、越界、溢出等边界。翻面后只对照差距，不要直接背代码。",
      details: "这一组卡不是为了背某一道题，而是让你熟悉卡片结构。正面只做回忆触发，提示需要手动点开，答案面再看方法、复杂度和代码。评分时不要按“看懂了”评分，而要按“刚才是否能独立说出来”评分。",
      code: "void review(Card card) {\n    read(card.front);\n    speak(\"input, output, example, edge cases\");\n    if (needHint) read(card.hint);\n    flip();\n    compareWith(card.shortAnswer, card.details, card.code);\n    rateByRecall();\n}",
      complexity: "每张卡建议 1 到 3 分钟；薄弱卡优先复盘。",
      related: "卡面熟悉，Anki 式主动回忆"
    },
    {
      id: "familiar-problem-reading",
      title: "熟悉 02 题面拆解",
      topic: "高频面试",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "读题", "边界"],
      front: "看到一段 LeetCode 题面时，如何快速拆出输入、输出、隐含条件和最容易错的边界？",
      hint: "把题目改写成函数契约。",
      shortAnswer: "先确定函数输入类型和返回值，再找题目里的“必须、恰好、至少、至多、不同、连续、有序、原地”等关键词。示例用来验证流程，边界用来验证鲁棒性。",
      details: "很多错题不是算法不会，而是题意没收紧。比如“连续”通常意味着子数组/子串，“不重复”可能需要去重策略，“原地”限制额外空间，“恰好”通常比“至少”更容易漏边界。读题时先不要猜专题，避免被方法名带偏。",
      code: "record ProblemContract(String input, String output, List<String> constraints) {}\n\nProblemContract parse() {\n    return new ProblemContract(\n        \"参数和数据范围\",\n        \"返回值或修改目标\",\n        List.of(\"连续\", \"去重\", \"原地\", \"边界\")\n    );\n}",
      complexity: "读题阶段不评估复杂度，先确认目标和限制。",
      related: "题面拆解，示例手推"
    },
    {
      id: "familiar-two-pointer-invariant",
      title: "熟悉 03 指针不变量",
      topic: "双指针",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "不变量", "边界"],
      front: "当题目需要在数组或字符串中维护两个位置时，如何判断每个指针移动后仍然没有漏掉答案？",
      hint: "给每个指针一句固定职责。",
      shortAnswer: "先定义指针含义：它们分别代表待处理边界、有效区间边界或候选答案边界。每次移动必须能解释“被丢弃的部分为什么不可能更优或不再需要”。",
      details: "双指针常见错误是只记住移动规则，却说不清丢弃理由。复习时重点问自己：区间是开还是闭？什么时候更新答案？移动左边还是右边的依据是什么？是否需要排序？是否需要跳过重复值？",
      code: "int left = 0, right = nums.length - 1;\nwhile (left < right) {\n    updateAnswer(left, right);\n    if (shouldMoveLeft(nums, left, right)) {\n        left++;\n    } else {\n        right--;\n    }\n}",
      complexity: "常见时间 O(n) 或 O(n log n + n)，空间 O(1) 到 O(n)。",
      related: "LC 11，LC 15，LC 42"
    },
    {
      id: "familiar-window-contract",
      title: "熟悉 04 窗口收缩条件",
      topic: "滑动窗口",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "窗口", "计数"],
      front: "面对连续子串或子数组问题，如何设计窗口的扩大、收缩和答案更新时机？",
      hint: "先写出窗口什么时候合法。",
      shortAnswer: "右边界负责纳入新元素，窗口状态记录当前内容。只要窗口不满足条件就移动左边界并同步撤销状态。答案更新时机取决于题目问最长、最短还是计数。",
      details: "最长问题通常在窗口合法时更新答案；最短问题通常在窗口满足条件后尽量收缩并更新答案；计数问题要特别小心一次右移能贡献多少答案。窗口题的关键不是模板，而是合法条件和贡献计算。",
      code: "Map<Character, Integer> count = new HashMap<>();\nint left = 0, ans = 0;\nfor (int right = 0; right < s.length(); right++) {\n    add(count, s.charAt(right));\n    while (!valid(count)) {\n        remove(count, s.charAt(left++));\n    }\n    ans = Math.max(ans, right - left + 1);\n}",
      complexity: "常见时间 O(n)，空间 O(字符集大小) 或 O(n)。",
      related: "LC 3，LC 76，LC 438"
    },
    {
      id: "familiar-binary-boundary",
      title: "熟悉 05 二分边界自检",
      topic: "二分",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "边界", "单调性"],
      front: "写二分时，如何避免循环条件、mid 更新和返回值互相打架？",
      hint: "先固定区间含义，再写排除逻辑。",
      shortAnswer: "明确使用闭区间还是左闭右开。闭区间常用 left <= right，排除 mid 时更新为 mid - 1 或 mid + 1；答案二分常用 left < right，保留 mid 时更新为 right = mid。",
      details: "二分错误大多来自区间语义混乱。复习时要说清楚：left/right 是否都可能是答案？循环结束时 left 的含义是什么？check(mid) 为 true 时是保留 mid 还是丢弃 mid？",
      code: "int left = low, right = high;\nwhile (left < right) {\n    int mid = left + (right - left) / 2;\n    if (check(mid)) right = mid;\n    else left = mid + 1;\n}\nreturn left;",
      complexity: "时间 O(log 范围 * check 成本)，空间通常 O(1)。",
      related: "LC 35，LC 704，LC 875，LC 1011"
    },
    {
      id: "familiar-backtracking-frame",
      title: "熟悉 06 回溯三件套",
      topic: "回溯",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "递归", "剪枝"],
      front: "写枚举类题目时，如何快速确定路径、选择列表和结束条件？",
      hint: "每层递归只负责一个选择位置。",
      shortAnswer: "路径保存已经选择的内容，选择列表由 start、used 或当前位置决定，结束条件决定何时收集答案。进入递归前做选择，递归返回后撤销选择。",
      details: "组合题关注 start，排列题关注 used，棋盘题关注坐标和合法性。剪枝要建立在排序、剩余目标或合法性判断上。复习时尤其检查：是否复制 path？是否漏了撤销？去重是在树层还是树枝？",
      code: "void dfs(int start) {\n    if (shouldCollect()) {\n        ans.add(new ArrayList<>(path));\n        return;\n    }\n    for (int i = start; i < choices.length; i++) {\n        if (shouldSkip(i)) continue;\n        path.add(choices[i]);\n        dfs(nextStart(i));\n        path.remove(path.size() - 1);\n    }\n}",
      complexity: "通常是指数级；空间取决于递归深度和答案规模。",
      related: "LC 39，LC 46，LC 78，LC 79"
    },
    {
      id: "familiar-dp-state",
      title: "熟悉 07 DP 状态定义",
      topic: "动态规划",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "状态", "转移"],
      front: "遇到最值、计数或可行性问题时，如何把题目转成可复用的状态转移？",
      hint: "先问 dp[i] 或 dp[i][j] 代表什么确定含义。",
      shortAnswer: "定义状态，确定初始值，找最后一步如何由更小子问题转移，决定遍历顺序，最后确认返回哪个状态。状态定义要能直接表达题目目标。",
      details: "DP 不是先套数组，而是先定义含义。比如 dp[i] 表示前 i 个、以 i 结尾、金额 i、容量 j，含义不同会导致遍历顺序和初始化完全不同。复习时优先检查初始化和遍历方向。",
      code: "int[] dp = new int[target + 1];\ninit(dp);\nfor (int i = 0; i < n; i++) {\n    for (int j = target; j >= cost[i]; j--) {\n        dp[j] = Math.max(dp[j], dp[j - cost[i]] + value[i]);\n    }\n}",
      complexity: "一维常见 O(n * target)，二维常见 O(n * m)。",
      related: "LC 70，LC 198，LC 322，LC 416"
    },
    {
      id: "familiar-stack-monotonic",
      title: "熟悉 08 单调结构",
      topic: "栈",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "单调栈", "队列"],
      front: "当题目询问下一个更大值、窗口最大值或最近边界时，如何用结构维护候选元素？",
      hint: "被新元素淘汰的旧元素，以后也不会更优。",
      shortAnswer: "维护一个有序的候选集合。新元素进入时，把已经不可能成为答案的元素弹出；需要答案时，结构顶部或队首就是当前最优候选。",
      details: "单调栈常解决最近更大/更小边界，单调队列常解决滑动窗口最值。复习时要说清：栈里存值还是下标？单调递增还是递减？元素何时出窗口？等于时是否弹出？",
      code: "Deque<Integer> stack = new ArrayDeque<>();\nfor (int i = 0; i < nums.length; i++) {\n    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {\n        int index = stack.pop();\n        ans[index] = nums[i];\n    }\n    stack.push(i);\n}",
      complexity: "每个元素进出结构一次，时间 O(n)，空间 O(n)。",
      related: "LC 739，LC 84，LC 239"
    },
    {
      id: "familiar-graph-visited",
      title: "熟悉 09 搜索访问标记",
      topic: "图论",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "DFS", "BFS"],
      front: "网格、树或图搜索时，如何避免重复访问、漏访问和层数计算错误？",
      hint: "先确定节点是什么，再确定何时标记 visited。",
      shortAnswer: "把状态抽象成节点，边表示可达关系。入队或递归前就标记访问，避免重复加入。BFS 适合最短层数，DFS 适合连通块和路径枚举。",
      details: "搜索题要先说清邻居生成方式：四方向、八方向、前置课程、树的左右孩子等。BFS 计算分钟数或步数时，通常按层处理队列大小；DFS 注意递归出口和越界条件。",
      code: "Queue<int[]> queue = new ArrayDeque<>();\nqueue.offer(new int[] {startR, startC});\nvisited[startR][startC] = true;\nwhile (!queue.isEmpty()) {\n    int size = queue.size();\n    for (int k = 0; k < size; k++) {\n        int[] cur = queue.poll();\n        for (int[] next : neighbors(cur)) visit(next);\n    }\n}",
      complexity: "时间 O(V + E) 或 O(mn)，空间 O(V) 或 O(mn)。",
      related: "LC 200，LC 207，LC 994"
    },
    {
      id: "familiar-java-edge",
      title: "熟悉 10 Java 易错细节",
      topic: "技巧",
      difficulty: "熟悉",
      source: "卡面熟悉",
      tags: ["卡面熟悉", "Java", "易错点"],
      front: "用 Java 写算法题时，哪些语言细节最容易让思路正确但代码出错？",
      hint: "关注比较、溢出、集合默认值和可变对象。",
      shortAnswer: "字符串比较用 equals，整型中间值注意溢出，HashMap 取计数用 getOrDefault，优先队列比较器避免相减溢出，加入答案时复制可变 path。",
      details: "Java 面试代码常见坑：Arrays.asList 返回固定大小列表；PriorityQueue 比较器不要写 a - b；递归 path 加入答案要 new ArrayList<>(path)；char 和 int 转换要明确；二维数组排序要写 Comparator。",
      code: "Map<Integer, Integer> count = new HashMap<>();\ncount.put(x, count.getOrDefault(x, 0) + 1);\n\nPriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));\nans.add(new ArrayList<>(path));",
      complexity: "语言细节本身不改变复杂度，但会影响正确性和鲁棒性。",
      related: "Java 集合，比较器，溢出，可变对象"
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
    selectedCollection: "全部集合",
    selectedTopic: "全部",
    query: "",
    weakOnly: false,
    customOnly: false,
    listCollapsed: false,
    statsExpanded: false,
    flipped: false,
    hintVisible: false,
    lastRating: null,
    aiConfig: { model: "deepseek-v4-pro" }
  };

  const els = {
    searchInput: document.getElementById("searchInput"),
    collectionFilters: document.getElementById("collectionFilters"),
    topicFilters: document.getElementById("topicFilters"),
    weakOnlyToggle: document.getElementById("weakOnlyToggle"),
    customOnlyToggle: document.getElementById("customOnlyToggle"),
    totalCount: document.getElementById("totalCount"),
    weakCount: document.getElementById("weakCount"),
    knownCount: document.getElementById("knownCount"),
    statsProgressText: document.getElementById("statsProgressText"),
    statsPanel: document.getElementById("statsPanel"),
    statsToggleButton: document.getElementById("statsToggleButton"),
    statsDetails: document.getElementById("statsDetails"),
    statusChart: document.getElementById("statusChart"),
    statusBars: document.getElementById("statusBars"),
    topicStats: document.getElementById("topicStats"),
    dailyDeckButton: document.getElementById("dailyDeckButton"),
    redrawDailyButton: document.getElementById("redrawDailyButton"),
    allCardsButton: document.getElementById("allCardsButton"),
    dailyStatus: document.getElementById("dailyStatus"),
    flashcard: document.getElementById("flashcard"),
    cardTopic: document.getElementById("cardTopic"),
    cardDifficulty: document.getElementById("cardDifficulty"),
    cardSource: document.getElementById("cardSource"),
    cardSourceFront: document.getElementById("cardSourceFront"),
    officialLinkFront: document.getElementById("officialLinkFront"),
    officialLinkBack: document.getElementById("officialLinkBack"),
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
    mobileFlipButton: document.getElementById("mobileFlipButton"),
    mobileReviewActions: document.getElementById("mobileReviewActions"),
    mobileAgainButton: document.getElementById("mobileAgainButton"),
    mobileHardButton: document.getElementById("mobileHardButton"),
    mobileGoodButton: document.getElementById("mobileGoodButton"),
    mobileMasteredButton: document.getElementById("mobileMasteredButton"),
    shuffleButton: document.getElementById("shuffleButton"),
    againButton: document.getElementById("againButton"),
    hardButton: document.getElementById("hardButton"),
    goodButton: document.getElementById("goodButton"),
    masteredButton: document.getElementById("masteredButton"),
    undoRatingButton: document.getElementById("undoRatingButton"),
    mobileUndoRatingButton: document.getElementById("mobileUndoRatingButton"),
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
    syncPhoneButton: document.getElementById("syncPhoneButton"),
    syncResult: document.getElementById("syncResult"),
    syncQr: document.getElementById("syncQr"),
    syncUrlInput: document.getElementById("syncUrlInput"),
    syncTargets: document.getElementById("syncTargets"),
    syncStatus: document.getElementById("syncStatus"),
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
    if (window.matchMedia("(max-width: 820px)").matches) {
      state.listCollapsed = true;
    }
    const hot100Cards = (window.HOT100_CARDS || []).map(normalizeCard);
    const hot100Numbers = new Set(hot100Cards.map((card) => getLcNumber(card.title)).filter(Boolean));
    const deleted = new Set(state.deletedIds);
    const defaultCards = DEFAULT_CARDS
      .filter((card) => !hot100Numbers.has(getLcNumber(card.title + " " + card.related)))
      .filter((card) => !deleted.has(card.id))
      .map((card) => normalizeCard({ ...card, ...(state.overrides[card.id] || {}) }));
    const familiarCards = FAMILIAR_CARDS
      .filter((card) => !deleted.has(card.id))
      .map((card) => normalizeCard({ ...card, ...(state.overrides[card.id] || {}) }));
    const seededHot100 = hot100Cards
      .filter((card) => !deleted.has(card.id))
      .map((card) => normalizeCard({ ...card, ...(state.overrides[card.id] || {}) }));
    state.cards = [...seededHot100, ...familiarCards, ...defaultCards, ...customCards.map(normalizeCard).filter((card) => !deleted.has(card.id))];
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

  function getOfficialProblemLink(card) {
    const customUrl = String(card.officialUrl || card.url || card.link || "").trim();
    if (/^https?:\/\//i.test(customUrl)) {
      return { url: customUrl, label: "LeetCode 原题" };
    }
    const number = getLcNumber([card.title, card.source].filter(Boolean).join(" "));
    if (!number) return null;
    const slug = LEETCODE_SLUGS[number];
    if (slug) {
      return {
        url: `https://leetcode.cn/problems/${slug}/`,
        label: "LeetCode 原题"
      };
    }
    return {
      url: `https://leetcode.cn/problemset/?search=${encodeURIComponent(number)}`,
      label: "LeetCode 搜索"
    };
  }

  function renderOfficialLinks(card) {
    const link = card ? getOfficialProblemLink(card) : null;
    [els.officialLinkFront, els.officialLinkBack].forEach((element) => {
      if (!element) return;
      element.classList.toggle("hidden", !link);
      if (!link) {
        element.removeAttribute("href");
        return;
      }
      element.href = link.url;
      element.textContent = link.label;
      element.title = "打开 LeetCode 官网题目";
    });
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

  function getCollectionName(card) {
    const source = card.source || "";
    if (card.custom) return "我的卡片";
    if (source.includes("卡面熟悉")) return "卡面熟悉";
    if (source.includes("Hot100")) return "Hot100";
    if (source.includes("代码随想录")) return "代码随想录";
    return source || "其他";
  }

  function getCollections() {
    const preferred = ["Hot100", "卡面熟悉", "代码随想录", "我的卡片"];
    const names = new Set(state.cards.map(getCollectionName));
    const ordered = preferred.filter((name) => names.has(name));
    const rest = Array.from(names).filter((name) => !preferred.includes(name)).sort();
    return ["全部集合", ...ordered, ...rest];
  }

  function getCollectionCounts() {
    return state.cards.reduce((counts, card) => {
      const name = getCollectionName(card);
      counts[name] = (counts[name] || 0) + 1;
      counts["全部集合"] = (counts["全部集合"] || 0) + 1;
      return counts;
    }, {});
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
        getCollectionName(card),
        ...(card.tags || [])
      ].join(" ").toLowerCase();
      return (!state.dailyMode || dailyIds.has(card.id))
        && (state.selectedCollection === "全部集合" || getCollectionName(card) === state.selectedCollection)
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
    renderCollectionFilters();
    renderTopicFilters();
    renderStats();
    renderDailyStatus();
    renderCardList();
    renderActiveCard();
    renderUndoActions();
  }

  function renderCollectionFilters() {
    els.collectionFilters.innerHTML = "";
    const counts = getCollectionCounts();
    getCollections().forEach((collection) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tag-button collection-button" + (collection === state.selectedCollection ? " active" : "");
      button.innerHTML = `<span>${escapeHtml(collection)}</span><small>${counts[collection] || 0}</small>`;
      button.setAttribute("aria-label", `${collection}，${counts[collection] || 0} 张`);
      button.addEventListener("click", () => {
        state.selectedCollection = collection;
        state.dailyMode = false;
        state.customOnly = collection === "我的卡片";
        els.customOnlyToggle.checked = state.customOnly;
        chooseFirstFiltered();
        render();
      });
      els.collectionFilters.appendChild(button);
    });
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
    const stats = buildProgressStats(filtered);
    els.totalCount.textContent = filtered.length;
    els.weakCount.textContent = progressValues.filter((item) => item.status === "again" || item.status === "hard").length;
    els.knownCount.textContent = progressValues.filter((item) => item.status === "mastered").length;
    renderProgressDashboard(stats);
  }

  function buildProgressStats(cards) {
    const buckets = [
      { key: "new", label: "新卡", color: "#6b7280", count: 0 },
      { key: "again", label: "薄弱", color: "#b84242", count: 0 },
      { key: "hard", label: "模糊", color: "#b98121", count: 0 },
      { key: "good", label: "记住", color: "#3b7c5b", count: 0 },
      { key: "mastered", label: "已掌握", color: "#2463a6", count: 0 }
    ];
    const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    const topicMap = new Map();

    cards.forEach((card) => {
      const status = state.progress[card.id]?.status || "new";
      const bucket = byKey.get(status) || byKey.get("new");
      bucket.count += 1;
      if (!topicMap.has(card.topic)) {
        topicMap.set(card.topic, { topic: card.topic || "未分类", total: 0, weak: 0, hard: 0, mastered: 0 });
      }
      const item = topicMap.get(card.topic);
      item.total += 1;
      if (status === "again" || status === "hard") item.weak += 1;
      if (status === "hard") item.hard += 1;
      if (status === "mastered") item.mastered += 1;
    });

    const total = cards.length;
    const mastered = byKey.get("mastered").count;
    const hard = byKey.get("hard").count;
    const weak = byKey.get("again").count + hard;
    const topics = Array.from(topicMap.values())
      .sort((a, b) => b.weak - a.weak || b.hard - a.hard || b.total - a.total)
      .slice(0, 6);
    return { buckets, total, mastered, hard, weak, topics };
  }

  function renderProgressDashboard(stats) {
    if (!els.statsPanel || !els.statusChart || !els.statusBars || !els.topicStats) return;
    const masteredRate = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0;
    const hardRate = stats.total ? Math.round((stats.hard / stats.total) * 100) : 0;
    els.statsProgressText.textContent = `${masteredRate}%`;
    els.statsPanel.classList.toggle("collapsed", !state.statsExpanded);
    els.statsToggleButton.textContent = state.statsExpanded ? "收起详细统计" : "查看详细统计";
    els.statsToggleButton.setAttribute("aria-expanded", String(state.statsExpanded));

    if (!stats.total) {
      els.statusChart.innerHTML = "<div class=\"empty-state\">当前筛选下没有卡片。</div>";
      els.statusBars.innerHTML = "";
      els.topicStats.innerHTML = "";
      return;
    }

    els.statusChart.innerHTML = `
      <div class="stat-ring" style="--mastered:${masteredRate}; --hard:${hardRate}">
        <span>${masteredRate}%</span>
        <small>已掌握</small>
      </div>
      <div class="stat-callouts">
        <div><strong>${stats.mastered}</strong><span>已掌握</span></div>
        <div><strong>${stats.hard}</strong><span>模糊</span></div>
        <div><strong>${stats.weak}</strong><span>薄弱合计</span></div>
      </div>
    `;

    els.statusBars.innerHTML = stats.buckets.map((bucket) => {
      const percent = stats.total ? Math.round((bucket.count / stats.total) * 100) : 0;
      return `
        <div class="status-bar-row">
          <span>${bucket.label}</span>
          <div class="status-bar-track">
            <i style="width:${percent}%; background:${bucket.color}"></i>
          </div>
          <strong>${bucket.count}</strong>
        </div>
      `;
    }).join("");

    els.topicStats.innerHTML = `
      <div class="section-title">薄弱专题 Top ${stats.topics.length || 0}</div>
      ${stats.topics.length ? stats.topics.map((topic) => `
        <div class="topic-stat-row">
          <span>${escapeHtml(topic.topic)}</span>
          <strong>${topic.weak}/${topic.total}</strong>
        </div>
      `).join("") : "<p class=\"note\">还没有专题统计。</p>"}
    `;
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
    renderMobileActions(true);
    els.cardSourceFront.textContent = [
      card.source || "自定义",
      statusText(progress.status),
      position > 0 ? `${position}/${filtered.length}` : ""
    ].filter(Boolean).join(" · ");
    els.cardTopic.textContent = card.topic;
    els.cardDifficulty.textContent = card.difficulty || "未分级";
    els.cardSource.textContent = card.source || "自定义";
    renderOfficialLinks(card);
    els.cardTitle.textContent = card.title;
    els.cardFront.textContent = card.front;
    els.cardHint.textContent = card.hint || "先用自己的话说出思路，再看答案。";
    els.cardHint.classList.toggle("hidden", !state.hintVisible);
    els.hintButton.textContent = state.hintVisible ? "隐藏提示" : "显示提示";
    els.cardShortAnswer.textContent = card.shortAnswer || "暂无精简答案。";
    els.cardComplexity.textContent = card.complexity || "待补充";
    els.cardDetails.textContent = card.details || "暂无详细复盘。";
    renderCode(card.code || "// 待补充 Java 代码");
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
    renderMobileActions(false);
    els.cardSourceFront.textContent = "没有匹配结果";
    els.cardTitle.textContent = "没有匹配卡片";
    els.cardFront.textContent = "换个关键词、关闭筛选，或回到全部卡池继续复习。";
    els.cardHint.textContent = "当前筛选条件下没有可复习卡片。";
    els.cardHint.classList.add("hidden");
    els.hintButton.textContent = "显示提示";
    els.cardTopic.textContent = "专题";
    els.cardDifficulty.textContent = "难度";
    els.cardSource.textContent = "来源";
    renderOfficialLinks(null);
    els.cardShortAnswer.textContent = "暂无内容。";
    els.cardComplexity.textContent = "暂无内容。";
    els.cardDetails.textContent = "暂无内容。";
    renderCode("");
    els.cardRelated.textContent = "暂无内容。";
    els.cardTags.innerHTML = "";
    els.cardTags.classList.add("hidden");
  }

  function renderMobileActions(hasCard) {
    if (!els.mobileFlipButton || !els.mobileReviewActions) return;
    els.mobileFlipButton.hidden = !hasCard || state.flipped;
    els.mobileReviewActions.hidden = !hasCard || !state.flipped;
    els.mobileFlipButton.textContent = state.flipped ? "回到题面" : "看答案";
    renderUndoActions();
  }

  function renderUndoActions() {
    const canUndo = Boolean(state.lastRating);
    [els.undoRatingButton, els.mobileUndoRatingButton].forEach((button) => {
      if (!button) return;
      button.classList.toggle("hidden", !canUndo);
      button.disabled = !canUndo;
    });
  }

  function flipActiveCard() {
    state.flipped = !state.flipped;
    state.hintVisible = false;
    renderActiveCard();
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
    const currentId = state.activeId;
    const current = state.progress[currentId] || { reviews: 0 };
    state.lastRating = {
      cardId: currentId,
      previousProgress: state.progress[currentId] ? { ...state.progress[currentId] } : null
    };
    state.progress[currentId] = {
      status,
      reviews: (current.reviews || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    saveProgress();
    advanceToNextCard(previousOrder);
    render();
  }

  function undoLastRating() {
    if (!state.lastRating) return;
    const { cardId, previousProgress } = state.lastRating;
    if (previousProgress) {
      state.progress[cardId] = previousProgress;
    } else {
      delete state.progress[cardId];
    }
    state.lastRating = null;
    if (state.cards.some((card) => card.id === cardId)) {
      state.activeId = cardId;
    }
    state.flipped = false;
    state.hintVisible = false;
    saveProgress();
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
    state.selectedCollection = "全部集合";
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

    if (!isLocalAiService()) {
      throw new Error("DeepSeek 智能制卡需要克隆项目并在本地运行 node server.js，再访问 http://localhost:8787/app.html。API Key 只允许放在本地 .env 或环境变量中。");
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

  function buildLocalDataPayload() {
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      customCards: state.cards.filter((card) => card.custom),
      overrides: state.overrides,
      deletedIds: state.deletedIds,
      progress: state.progress,
      daily: state.daily
    };
  }

  function exportData() {
    const payload = buildLocalDataPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "java-algorithm-flashcards.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function applyImportedPayload(payload) {
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
    if (payload.daily && typeof payload.daily === "object") {
      state.daily = {
        date: payload.daily.date || "",
        usedIds: Array.isArray(payload.daily.usedIds) ? payload.daily.usedIds : [],
        deckIds: Array.isArray(payload.daily.deckIds) ? payload.daily.deckIds : []
      };
      saveDaily();
    }
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        applyImportedPayload(payload);
        load();
      } catch (error) {
        alert("导入失败：JSON 格式不正确。");
      }
    };
    reader.readAsText(file);
  }

  async function startPhoneSync() {
    if (!isLocalSyncService()) {
      setSyncStatus("同步到手机需要在本地运行 node server.js，并打开 http://localhost:8787/app.html。");
      els.syncResult.classList.remove("hidden");
      return;
    }

    setSyncBusy(true);
    setSyncStatus("正在生成同步二维码...");
    els.syncResult.classList.remove("hidden");

    try {
      const info = await fetchJson("/api/sync-info");
      const created = await postJson("/api/sync", buildLocalDataPayload());
      const syncUrls = buildSyncUrls(info, created.token);
      const syncUrl = syncUrls[0];
      els.syncUrlInput.value = syncUrl;
      renderSyncQr(syncUrl);
      renderSyncTargets(syncUrls);
      setSyncStatus(`二维码 10 分钟内有效。手机和电脑连接同一 Wi-Fi 后扫码导入。`);
    } catch (error) {
      setSyncStatus("生成失败：" + error.message);
      els.syncQr.innerHTML = "";
      els.syncUrlInput.value = "";
      els.syncTargets.innerHTML = "";
    } finally {
      setSyncBusy(false);
    }
  }

  async function importSyncFromUrl() {
    const token = new URLSearchParams(location.search).get("sync");
    if (!token) return;

    try {
      const data = await fetchJson(`/api/sync/${encodeURIComponent(token)}`);
      applyImportedPayload(data.payload || data);
      history.replaceState(null, "", location.pathname);
      alert("同步完成：电脑端卡片和复习进度已经导入当前手机浏览器。");
    } catch (error) {
      alert("同步失败：" + error.message + "。请在电脑端重新生成二维码，并确认手机和电脑在同一 Wi-Fi。");
    }
  }

  function buildSyncUrls(info, token) {
    const appUrls = Array.isArray(info.appUrls) && info.appUrls.length
      ? info.appUrls
      : [`${location.origin}/app.html`];
    return appUrls.map((appUrl) => {
      const url = new URL(appUrl);
      url.searchParams.set("sync", token);
      return url.toString();
    });
  }

  function renderSyncTargets(urls) {
    els.syncTargets.innerHTML = "";
    if (urls.length <= 1) return;
    const title = document.createElement("p");
    title.className = "note";
    title.textContent = "扫码打不开时，切换下面的备用地址再扫。";
    els.syncTargets.appendChild(title);
    urls.forEach((url, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button compact-button";
      button.textContent = `地址 ${index + 1}`;
      button.addEventListener("click", () => {
        els.syncUrlInput.value = url;
        renderSyncQr(url);
        setSyncStatus("二维码已切换。请用手机重新扫码。");
      });
      els.syncTargets.appendChild(button);
    });
  }

  function isLocalSyncService() {
    return location.protocol === "http:" && !location.hostname.endsWith("github.io");
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `请求失败：${response.status}`);
    return data;
  }

  async function postJson(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `请求失败：${response.status}`);
    return data;
  }

  function setSyncBusy(isBusy) {
    els.syncPhoneButton.disabled = isBusy;
    els.syncPhoneButton.textContent = isBusy ? "正在生成..." : "生成手机同步二维码";
  }

  function setSyncStatus(text) {
    els.syncStatus.textContent = text;
  }

  function renderSyncQr(url) {
    try {
      els.syncQr.innerHTML = makeQrSvg(url);
    } catch (error) {
      els.syncQr.innerHTML = "";
      setSyncStatus("同步链接已生成，但二维码生成失败。可以手动复制地址到手机浏览器打开。");
    }
  }

  function makeQrSvg(text) {
    const matrix = createQrMatrix(text);
    const border = 4;
    const size = matrix.length;
    const viewSize = size + border * 2;
    const cells = [];
    matrix.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) cells.push(`M${x + border},${y + border}h1v1h-1z`);
      });
    });
    return `<svg viewBox="0 0 ${viewSize} ${viewSize}" role="img" aria-label="手机同步二维码" xmlns="http://www.w3.org/2000/svg"><rect width="${viewSize}" height="${viewSize}" fill="#fff"/><path d="${cells.join("")}" fill="#20242c"/></svg>`;
  }

  function createQrMatrix(text) {
    const version = 5;
    const size = version * 4 + 17;
    const dataCodewords = 108;
    const eccCodewords = 26;
    const data = encodeQrData(text, dataCodewords);
    const ecc = reedSolomonRemainder(data, reedSolomonDivisor(eccCodewords));
    const codewords = data.concat(ecc);
    const modules = Array.from({ length: size }, () => Array(size).fill(false));
    const isFunction = Array.from({ length: size }, () => Array(size).fill(false));

    const setFunction = (x, y, dark) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      modules[y][x] = dark;
      isFunction[y][x] = true;
    };

    const drawFinder = (cx, cy) => {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          setFunction(cx + dx, cy + dy, dist !== 2 && dist !== 4);
        }
      }
    };

    drawFinder(3, 3);
    drawFinder(size - 4, 3);
    drawFinder(3, size - 4);
    for (let i = 0; i < size; i++) {
      if (!isFunction[6][i]) setFunction(i, 6, i % 2 === 0);
      if (!isFunction[i][6]) setFunction(6, i, i % 2 === 0);
    }
    drawAlignmentPattern(30, 30, setFunction);
    setFunction(8, size - 8, true);
    drawFormatBits(0, size, modules, isFunction, setFunction);
    placeQrData(codewords, modules, isFunction);
    applyQrMask(0, modules, isFunction);
    drawFormatBits(0, size, modules, isFunction, setFunction);
    return modules;
  }

  function drawAlignmentPattern(cx, cy, setFunction) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunction(cx + dx, cy + dy, dist !== 1);
      }
    }
  }

  function drawFormatBits(mask, size, modules, isFunction, setFunction) {
    const bits = getQrFormatBits(mask);
    for (let i = 0; i <= 5; i++) setFunction(8, i, getBit(bits, i));
    setFunction(8, 7, getBit(bits, 6));
    setFunction(8, 8, getBit(bits, 7));
    setFunction(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) setFunction(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i++) setFunction(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) setFunction(8, size - 15 + i, getBit(bits, i));
    modules[size - 8][8] = true;
    isFunction[size - 8][8] = true;
  }

  function getQrFormatBits(mask) {
    let data = (1 << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) {
      rem = (rem << 1) ^ (((rem >>> 9) & 1) ? 0x537 : 0);
    }
    return ((data << 10) | rem) ^ 0x5412;
  }

  function encodeQrData(text, dataCodewords) {
    const bytes = Array.from(new TextEncoder().encode(text));
    if (bytes.length > 106) throw new Error("同步链接过长");
    const bits = [];
    appendBits(0x4, 4, bits);
    appendBits(bytes.length, 8, bits);
    bytes.forEach((byte) => appendBits(byte, 8, bits));
    const capacity = dataCodewords * 8;
    appendBits(0, Math.min(4, capacity - bits.length), bits);
    while (bits.length % 8) bits.push(false);
    const result = [];
    for (let i = 0; i < bits.length; i += 8) {
      let value = 0;
      for (let j = 0; j < 8; j++) value = (value << 1) | (bits[i + j] ? 1 : 0);
      result.push(value);
    }
    for (let pad = 0; result.length < dataCodewords; pad ^= 1) {
      result.push(pad ? 0x11 : 0xec);
    }
    return result;
  }

  function appendBits(value, length, bits) {
    for (let i = length - 1; i >= 0; i--) bits.push(((value >>> i) & 1) !== 0);
  }

  function placeQrData(codewords, modules, isFunction) {
    const size = modules.length;
    let bitIndex = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right--;
      for (let vert = 0; vert < size; vert++) {
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          if (!isFunction[y][x] && bitIndex < codewords.length * 8) {
            modules[y][x] = getBit(codewords[bitIndex >>> 3], 7 - (bitIndex & 7));
            bitIndex++;
          }
        }
      }
    }
  }

  function applyQrMask(mask, modules, isFunction) {
    modules.forEach((row, y) => {
      row.forEach((_, x) => {
        if (!isFunction[y][x] && getQrMask(mask, x, y)) modules[y][x] = !modules[y][x];
      });
    });
  }

  function getQrMask(mask, x, y) {
    return [
      (x + y) % 2 === 0,
      y % 2 === 0,
      x % 3 === 0,
      (x + y) % 3 === 0,
      (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
      ((x * y) % 2) + ((x * y) % 3) === 0,
      (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
      (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
    ][mask];
  }

  function reedSolomonDivisor(degree) {
    const result = Array(degree).fill(0);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        result[j] = gfMultiply(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = gfMultiply(root, 0x02);
    }
    return result;
  }

  function reedSolomonRemainder(data, divisor) {
    const result = Array(divisor.length).fill(0);
    data.forEach((byte) => {
      const factor = byte ^ result.shift();
      result.push(0);
      divisor.forEach((coef, index) => {
        result[index] ^= gfMultiply(coef, factor);
      });
    });
    return result;
  }

  function gfMultiply(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xff;
  }

  function getBit(value, index) {
    return ((value >>> index) & 1) !== 0;
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

  function isLocalAiService() {
    return location.protocol === "http:"
      && (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      && location.port === "8787";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderCode(code) {
    els.cardCode.className = "language-java";
    els.cardCode.textContent = code;
    if (window.Prism?.highlightElement) {
      window.Prism.highlightElement(els.cardCode);
    }
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
    if (state.customOnly) {
      state.selectedCollection = "我的卡片";
    } else if (state.selectedCollection === "我的卡片") {
      state.selectedCollection = "全部集合";
    }
    chooseFirstFiltered();
    render();
  });

  els.dailyDeckButton.addEventListener("click", () => {
    ensureDailyDeck();
    state.dailyMode = true;
    state.selectedCollection = "全部集合";
    state.selectedTopic = "全部";
    state.weakOnly = false;
    state.customOnly = false;
    els.weakOnlyToggle.checked = false;
    els.customOnlyToggle.checked = false;
    chooseFirstFiltered();
    render();
  });

  els.redrawDailyButton.addEventListener("click", () => {
    if (!confirm("确定重抽今天的 10 张吗？当前今日牌组会放回卡池。")) return;
    redrawDailyDeck();
    state.dailyMode = true;
    state.selectedCollection = "全部集合";
    state.selectedTopic = "全部";
    state.weakOnly = false;
    state.customOnly = false;
    els.weakOnlyToggle.checked = false;
    els.customOnlyToggle.checked = false;
    chooseFirstFiltered();
    render();
  });

  els.allCardsButton.addEventListener("click", () => {
    state.dailyMode = false;
    state.selectedCollection = "全部集合";
    state.selectedTopic = "全部";
    state.weakOnly = false;
    state.customOnly = false;
    els.weakOnlyToggle.checked = false;
    els.customOnlyToggle.checked = false;
    chooseFirstFiltered();
    render();
  });

  els.flipButton.addEventListener("click", flipActiveCard);
  els.mobileFlipButton.addEventListener("click", flipActiveCard);

  els.flashcard.addEventListener("dblclick", flipActiveCard);

  els.flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipActiveCard();
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

  els.statsToggleButton.addEventListener("click", () => {
    state.statsExpanded = !state.statsExpanded;
    renderStats();
  });

  els.againButton.addEventListener("click", () => mark("again"));
  els.hardButton.addEventListener("click", () => mark("hard"));
  els.goodButton.addEventListener("click", () => mark("good"));
  els.masteredButton.addEventListener("click", () => mark("mastered"));
  els.undoRatingButton.addEventListener("click", undoLastRating);
  els.mobileAgainButton.addEventListener("click", () => mark("again"));
  els.mobileHardButton.addEventListener("click", () => mark("hard"));
  els.mobileGoodButton.addEventListener("click", () => mark("good"));
  els.mobileMasteredButton.addEventListener("click", () => mark("mastered"));
  els.mobileUndoRatingButton.addEventListener("click", undoLastRating);

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

  els.syncPhoneButton.addEventListener("click", startPhoneSync);
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
      flipActiveCard();
    }
    if (event.key.toLowerCase() === "r") els.shuffleButton.click();
    if (event.key === "1") mark("again");
    if (event.key === "2") mark("hard");
    if (event.key === "3") mark("good");
    if (event.key === "4") mark("mastered");
  });

  async function init() {
    await importSyncFromUrl();
    load();
  }

  init();
})();
