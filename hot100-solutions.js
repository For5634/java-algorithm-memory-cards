(function () {
  function s(complexity, details, code) {
    return { complexity, details, code };
  }

  window.HOT100_SOLUTIONS = {
    1: s("时间 O(n)，空间 O(n)", "用 HashMap 记录已经遍历过的数字及下标。遍历 nums 时计算 complement = target - nums[i]，如果 complement 已存在，就返回两个下标；否则把当前数字放入 map。注意不能使用同一个元素两次，所以先查再放。", `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (map.containsKey(need)) return new int[]{map.get(need), i};
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`),
    49: s("时间 O(n * k log k)，空间 O(n * k)，k 为单词长度", "字母异位词排序后字符串相同。遍历每个单词，把字符数组排序后作为 key，放入 HashMap<key, list>。最后返回所有分组。若想优化，可用 26 位计数作为 key。", `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String str : strs) {
            char[] chars = str.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
        }
        return new ArrayList<>(map.values());
    }
}`),
    128: s("时间 O(n)，空间 O(n)", "把所有数放入 HashSet。只有当 num - 1 不存在时，num 才可能是连续序列起点，然后向后数 num + 1、num + 2... 的长度。这样每个数最多被访问常数次。", `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int ans = 0;
        for (int x : set) {
            if (set.contains(x - 1)) continue;
            int cur = x, len = 1;
            while (set.contains(cur + 1)) {
                cur++;
                len++;
            }
            ans = Math.max(ans, len);
        }
        return ans;
    }
}`),
    283: s("时间 O(n)，空间 O(1)", "用 slow 指向下一个非零元素应该放的位置。遍历数组，遇到非零就写到 nums[slow++]，最后把 slow 之后的位置全部置 0。这样保持非零元素相对顺序。", `class Solution {
    public void moveZeroes(int[] nums) {
        int slow = 0;
        for (int x : nums) {
            if (x != 0) nums[slow++] = x;
        }
        while (slow < nums.length) nums[slow++] = 0;
    }
}`),
    11: s("时间 O(n)，空间 O(1)", "左右指针分别指向两端，面积由较短边决定。每次计算面积后，移动较短的一侧，因为移动较高的一侧不会提升当前宽度下的短板。", `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, ans = 0;
        while (l < r) {
            ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return ans;
    }
}`),
    15: s("时间 O(n^2)，空间 O(log n) 到 O(n)，取决于排序实现", "先排序，固定第一个数 i，再用左右指针在 i 右侧找两数和。为了避免重复答案，i、left、right 都要跳过相同值。", `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    ans.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return ans;
    }
}`),
    42: s("时间 O(n)，空间 O(1)", "维护左右两侧最高柱 leftMax、rightMax。哪边较低就先结算哪边，因为较低边决定当前位置能接的水。移动指针时更新最大值或累加水量。", `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, ans = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else ans += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax) rightMax = height[r];
                else ans += rightMax - height[r];
                r--;
            }
        }
        return ans;
    }
}`),
    3: s("时间 O(n)，空间 O(字符集大小)", "用 map 记录字符最近出现位置，left 表示当前无重复窗口左边界。遇到重复字符时，left 跳到上次出现位置之后，但不能后退，所以取 max。", `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, ans = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last.containsKey(c)) left = Math.max(left, last.get(c) + 1);
            last.put(c, right);
            ans = Math.max(ans, right - left + 1);
        }
        return ans;
    }
}`),
    438: s("时间 O(n + m)，空间 O(1)", "固定窗口长度为 p.length。用两个 26 位数组统计 p 和当前窗口字符频次，右侧加入字符，窗口过长时左侧移出，频次相同则记录左边界。", `class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> ans = new ArrayList<>();
        if (s.length() < p.length()) return ans;
        int[] need = new int[26], win = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        for (int r = 0; r < s.length(); r++) {
            win[s.charAt(r) - 'a']++;
            if (r >= p.length()) win[s.charAt(r - p.length()) - 'a']--;
            if (Arrays.equals(need, win)) ans.add(r - p.length() + 1);
        }
        return ans;
    }
}`),
    560: s("时间 O(n)，空间 O(n)", "令 prefix 为当前位置前缀和。若存在之前前缀和 prefix - k，则两者之间子数组和为 k。用 HashMap 统计每种前缀和出现次数。初始化 map[0] = 1。", `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        count.put(0, 1);
        int prefix = 0, ans = 0;
        for (int x : nums) {
            prefix += x;
            ans += count.getOrDefault(prefix - k, 0);
            count.put(prefix, count.getOrDefault(prefix, 0) + 1);
        }
        return ans;
    }
}`),
    239: s("时间 O(n)，空间 O(k)", "用双端队列存下标，队列中对应值保持递减。新元素进入时弹出所有更小元素；队头若离开窗口则弹出。窗口形成后，队头就是最大值下标。", `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int[] ans = new int[nums.length - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];
        }
        return ans;
    }
}`),
    76: s("时间 O(n + m)，空间 O(字符集大小)", "用 need 记录 t 的字符需求，用 window 记录窗口字符数。right 扩张直到满足所有需求，再移动 left 收缩并更新最短答案。valid 表示满足需求的字符种类数。", `class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>(), win = new HashMap<>();
        for (char c : t.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);
        int left = 0, valid = 0, start = 0, len = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            char in = s.charAt(right);
            if (need.containsKey(in)) {
                win.put(in, win.getOrDefault(in, 0) + 1);
                if (win.get(in).equals(need.get(in))) valid++;
            }
            while (valid == need.size()) {
                if (right - left + 1 < len) {
                    start = left;
                    len = right - left + 1;
                }
                char out = s.charAt(left++);
                if (need.containsKey(out)) {
                    if (win.get(out).equals(need.get(out))) valid--;
                    win.put(out, win.get(out) - 1);
                }
            }
        }
        return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
    }
}`),
    53: s("时间 O(n)，空间 O(1)", "dp 含义是以当前位置结尾的最大子数组和。遍历时决定是接在前面后面，还是从当前元素重新开始；同时维护全局最大值。", `class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            ans = Math.max(ans, cur);
        }
        return ans;
    }
}`),
    56: s("时间 O(n log n)，空间 O(n)", "先按区间左端点排序。遍历区间，如果当前区间与结果最后一个区间重叠，就合并右端点；否则加入新区间。", `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> ans = new ArrayList<>();
        for (int[] cur : intervals) {
            if (ans.isEmpty() || ans.get(ans.size() - 1)[1] < cur[0]) ans.add(cur);
            else ans.get(ans.size() - 1)[1] = Math.max(ans.get(ans.size() - 1)[1], cur[1]);
        }
        return ans.toArray(new int[ans.size()][]);
    }
}`),
    189: s("时间 O(n)，空间 O(1)", "先把 k 对 n 取模。整体反转数组，再反转前 k 个元素，最后反转剩余元素。三次反转即可完成右轮转。", `class Solution {
    public void rotate(int[] nums, int k) {
        k %= nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }
    private void reverse(int[] nums, int l, int r) {
        while (l < r) {
            int t = nums[l];
            nums[l++] = nums[r];
            nums[r--] = t;
        }
    }
}`),
    238: s("时间 O(n)，空间 O(1)，不计输出数组", "answer[i] 先保存 i 左侧所有元素乘积，再从右向左维护右侧乘积 right，把左右乘积相乘。避免使用除法，也能处理 0。", `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
    }
}`),
    41: s("时间 O(n)，空间 O(1)", "把值 x 放到下标 x-1 的位置上。遍历数组不断交换，直到当前位置不需要交换。最后第一个 nums[i] != i+1 的位置就是缺失的最小正数。", `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int idx = nums[i] - 1;
                int t = nums[i];
                nums[i] = nums[idx];
                nums[idx] = t;
            }
        }
        for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`),
    73: s("时间 O(mn)，空间 O(1)", "使用第一行和第一列作为标记位，额外记录第一列是否需要置零。先扫描并打标记，再根据标记置零，最后处理第一行和第一列。", `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstCol = false;
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstCol = true;
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 1; j--) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            }
            if (firstCol) matrix[i][0] = 0;
        }
    }
}`),
    54: s("时间 O(mn)，空间 O(1)，不计答案", "维护 top、bottom、left、right 四条边界。每轮按右、下、左、上四个方向遍历一圈，然后收缩边界，注意每个方向前判断边界是否仍有效。", `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> ans = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) ans.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) ans.add(matrix[i][right]);
            right--;
            if (top <= bottom) for (int j = right; j >= left; j--) ans.add(matrix[bottom][j]);
            bottom--;
            if (left <= right) for (int i = bottom; i >= top; i--) ans.add(matrix[i][left]);
            left++;
        }
        return ans;
    }
}`),
    48: s("时间 O(n^2)，空间 O(1)", "顺时针旋转 90 度可以拆成两步：先沿主对角线转置，再反转每一行。这样可以原地完成。", `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = t;
            }
        }
        for (int[] row : matrix) {
            for (int l = 0, r = n - 1; l < r; l++, r--) {
                int t = row[l];
                row[l] = row[r];
                row[r] = t;
            }
        }
    }
}`),
    240: s("时间 O(m+n)，空间 O(1)", "从右上角开始。若当前值大于 target，说明该列下面更大，只能左移；若当前值小于 target，说明该行左边更小，只能下移。", `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int i = 0, j = matrix[0].length - 1;
        while (i < matrix.length && j >= 0) {
            if (matrix[i][j] == target) return true;
            if (matrix[i][j] > target) j--;
            else i++;
        }
        return false;
    }
}`),
    160: s("时间 O(m+n)，空间 O(1)", "两个指针分别从 A、B 出发，走到 null 后切换到另一个链表头。若相交，两指针会在相交点相遇；若不相交，会同时为 null。", `public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA, b = headB;
        while (a != b) {
            a = a == null ? headB : a.next;
            b = b == null ? headA : b.next;
        }
        return a;
    }
}`),
    206: s("时间 O(n)，空间 O(1)", "用 prev 保存反转后链表的前驱，用 cur 遍历原链表。每次先保存 next，再让 cur.next 指向 prev，然后整体向前推进。", `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`),
    234: s("时间 O(n)，空间 O(1)", "用快慢指针找到中点，反转后半段链表，再从两端同步比较。若都相同则是回文。实际面试中可选择最后恢复链表。", `class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = reverse(slow);
        while (second != null) {
            if (head.val != second.val) return false;
            head = head.next;
            second = second.next;
        }
        return true;
    }
    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`),
    141: s("时间 O(n)，空间 O(1)", "快慢指针同时从头出发。slow 每次走一步，fast 每次走两步。如果链表有环，fast 最终会追上 slow；如果无环，fast 会先到 null。", `public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`),
    142: s("时间 O(n)，空间 O(1)", "先用快慢指针判断是否有环并找到相遇点。相遇后让一个指针回到 head，另一个留在相遇点，两者每次走一步，再次相遇处就是环入口。", `public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode p = head;
                while (p != slow) {
                    p = p.next;
                    slow = slow.next;
                }
                return p;
            }
        }
        return null;
    }
}`),
    21: s("时间 O(m+n)，空间 O(1)", "使用哑节点 dummy 简化头节点处理。比较两个链表当前节点，小的接到结果链表后面。最后把剩余链表接上。", `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0), cur = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        cur.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}`),
    2: s("时间 O(max(m,n))，空间 O(max(m,n))", "链表按逆序存储数字，直接从头到尾模拟竖式加法。维护 carry，两个链表当前位不存在时按 0 处理，最后若 carry 不为 0 还要补一个节点。", `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), cur = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            cur.next = new ListNode(sum % 10);
            carry = sum / 10;
            cur = cur.next;
        }
        return dummy.next;
    }
}`),
    19: s("时间 O(n)，空间 O(1)", "使用哑节点。fast 先走 n 步，然后 slow 和 fast 同步走到 fast.next 为 null，此时 slow.next 就是要删除的节点。", `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`),
    24: s("时间 O(n)，空间 O(1)", "用 dummy 和 prev 指向当前待交换 pair 前一个节点。每轮取 a=prev.next、b=a.next，调整三条指针完成交换，再让 prev 移到 a。", `class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head), prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode a = prev.next, b = a.next;
            a.next = b.next;
            b.next = a;
            prev.next = b;
            prev = a;
        }
        return dummy.next;
    }
}`),
    25: s("时间 O(n)，空间 O(1)", "每次先检查后面是否有 k 个节点。若有，就反转这一段，并把反转后的尾部接回后续链表。注意 groupPrev、groupNext 和新尾节点的连接。", `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;
            ListNode groupNext = kth.next;
            ListNode prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) {
                ListNode next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
            }
            ListNode tail = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = tail;
        }
        return dummy.next;
    }
}`),
    138: s("时间 O(n)，空间 O(n)", "用 HashMap 建立原节点到新节点的映射。第一遍创建所有新节点，第二遍补 next 和 random 指针。也可以用原地穿插法做到 O(1) 额外空间。", `class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>();
        for (Node cur = head; cur != null; cur = cur.next) map.put(cur, new Node(cur.val));
        for (Node cur = head; cur != null; cur = cur.next) {
            map.get(cur).next = map.get(cur.next);
            map.get(cur).random = map.get(cur.random);
        }
        return map.get(head);
    }
}`),
    148: s("时间 O(n log n)，空间 O(log n)", "链表排序常用归并排序。用快慢指针找到中点并断开，分别排序左右链表，再合并两个有序链表。", `class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        return merge(sortList(head), sortList(mid));
    }
    private ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), cur = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { cur.next = a; a = a.next; }
            else { cur.next = b; b = b.next; }
            cur = cur.next;
        }
        cur.next = a != null ? a : b;
        return dummy.next;
    }
}`),
    23: s("时间 O(n log k)，空间 O(k)", "把每个链表的头节点放入小根堆。每次弹出最小节点接到结果后面，如果该节点还有 next，就把 next 放入堆。", `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) if (node != null) pq.offer(node);
        ListNode dummy = new ListNode(0), cur = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            cur.next = node;
            cur = cur.next;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }
}`),
    146: s("get/put 时间 O(1)，空间 O(capacity)", "HashMap 负责根据 key 定位节点，双向链表负责维护最近使用顺序。访问或更新节点时移到头部；容量超限时删除尾部最久未使用节点。", `class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);
    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }
    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToHead(node);
        return node.value;
    }
    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
            return;
        }
        node = new Node(key, value);
        map.put(key, node);
        addFirst(node);
        if (map.size() > capacity) {
            Node old = tail.prev;
            remove(old);
            map.remove(old.key);
        }
    }
    private void moveToHead(Node node) { remove(node); addFirst(node); }
    private void addFirst(Node node) {
        node.next = head.next; node.prev = head;
        head.next.prev = node; head.next = node;
    }
    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}`),
    394: s("时间 O(n)，空间 O(n)", "用两个栈分别保存重复次数和进入括号前的字符串。遇到数字累计次数，遇到 '[' 入栈并重置，遇到 ']' 弹出并拼接重复字符串。", `class Solution {
    public String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> stack = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int num = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + c - '0';
            else if (c == '[') {
                counts.push(num);
                stack.push(cur);
                cur = new StringBuilder();
                num = 0;
            } else if (c == ']') {
                int k = counts.pop();
                StringBuilder prev = stack.pop();
                while (k-- > 0) prev.append(cur);
                cur = prev;
            } else cur.append(c);
        }
        return cur.toString();
    }
}`),
    739: s("时间 O(n)，空间 O(n)", "用单调递减栈保存还没找到更高温度的下标。当前温度高于栈顶温度时，弹出栈顶并结算等待天数。", `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] ans = new int[temperatures.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < temperatures.length; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int j = stack.pop();
                ans[j] = i - j;
            }
            stack.push(i);
        }
        return ans;
    }
}`),
    84: s("时间 O(n)，空间 O(n)", "单调递增栈保存柱子下标。遇到更矮柱子时，弹出栈顶作为矩形高度，当前下标和新栈顶确定左右边界。首尾加哨兵可以简化结算。", `class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, ans = 0;
        int[] h = new int[n + 2];
        System.arraycopy(heights, 0, h, 1, n);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < h.length; i++) {
            while (!stack.isEmpty() && h[i] < h[stack.peek()]) {
                int height = h[stack.pop()];
                int width = i - stack.peek() - 1;
                ans = Math.max(ans, height * width);
            }
            stack.push(i);
        }
        return ans;
    }
}`),
    215: s("平均时间 O(n)，最坏 O(n^2)，空间 O(log n)", "快速选择只递归包含第 k 大元素的一侧。把问题转成找升序下标 n-k 的元素，通过 partition 把 pivot 放到最终位置。", `class Solution {
    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k, l = 0, r = nums.length - 1;
        while (l <= r) {
            int p = partition(nums, l, r);
            if (p == target) return nums[p];
            if (p < target) l = p + 1;
            else r = p - 1;
        }
        return -1;
    }
    private int partition(int[] a, int l, int r) {
        int pivot = a[r], i = l;
        for (int j = l; j < r; j++) {
            if (a[j] <= pivot) {
                int t = a[i]; a[i++] = a[j]; a[j] = t;
            }
        }
        int t = a[i]; a[i] = a[r]; a[r] = t;
        return i;
    }
}`),
    347: s("时间 O(n log k)，空间 O(n)", "先用 HashMap 统计频次，再维护大小为 k 的小根堆。堆顶是当前前 k 高频元素中频率最小的，超过 k 就弹出。", `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));
        for (int x : freq.keySet()) {
            pq.offer(x);
            if (pq.size() > k) pq.poll();
        }
        int[] ans = new int[k];
        for (int i = 0; i < k; i++) ans[i] = pq.poll();
        return ans;
    }
}`),
    295: s("addNum 时间 O(log n)，findMedian 时间 O(1)，空间 O(n)", "用两个堆维护左右两半。small 是大根堆保存较小一半，large 是小根堆保存较大一半。保证 size 差不超过 1，并且 small 堆顶 <= large 堆顶。", `class MedianFinder {
    private PriorityQueue<Integer> small = new PriorityQueue<>((a, b) -> b - a);
    private PriorityQueue<Integer> large = new PriorityQueue<>();
    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        if (large.size() > small.size()) small.offer(large.poll());
    }
    public double findMedian() {
        if (small.size() > large.size()) return small.peek();
        return (small.peek() + large.peek()) / 2.0;
    }
}`),
    121: s("时间 O(n)，空间 O(1)", "遍历价格时维护历史最低买入价 minPrice。当天卖出的利润是 price - minPrice，用它更新最大利润，再更新最低价。", `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, ans = 0;
        for (int p : prices) {
            ans = Math.max(ans, p - minPrice);
            minPrice = Math.min(minPrice, p);
        }
        return ans;
    }
}`),
    55: s("时间 O(n)，空间 O(1)", "维护当前能到达的最远下标 farthest。遍历到 i 时，如果 i 已经超过 farthest，说明不可达；否则用 i + nums[i] 更新覆盖范围。", `class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > farthest) return false;
            farthest = Math.max(farthest, i + nums[i]);
        }
        return true;
    }
}`),
    45: s("时间 O(n)，空间 O(1)", "按层贪心。end 表示当前跳跃次数能到达的边界，farthest 表示下一跳能到达的最远位置。遍历到 end 时必须再跳一次。", `class Solution {
    public int jump(int[] nums) {
        int steps = 0, end = 0, farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == end) {
                steps++;
                end = farthest;
            }
        }
        return steps;
    }
}`),
    763: s("时间 O(n)，空间 O(1)", "先记录每个字符最后出现位置。遍历字符串时维护当前片段的最远右边界 end，当 i == end 时可以切出一个片段。", `class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> ans = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                ans.add(end - start + 1);
                start = i + 1;
            }
        }
        return ans;
    }
}`),
    70: s("时间 O(n)，空间 O(1)", "到第 i 阶只能从 i-1 或 i-2 来，所以 f(i)=f(i-1)+f(i-2)。用两个变量滚动保存前两项即可。", `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`),
    118: s("时间 O(numRows^2)，空间 O(1)，不计答案", "杨辉三角每行首尾是 1，中间元素等于上一行相邻两个元素之和。按行构造即可。", `class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) row.add(1);
                else row.add(ans.get(i - 1).get(j - 1) + ans.get(i - 1).get(j));
            }
            ans.add(row);
        }
        return ans;
    }
}`),
    198: s("时间 O(n)，空间 O(1)", "每间房有偷或不偷两种选择。滚动维护前两间房的最优值，当前最优为 max(不偷当前, 偷当前加 i-2 最优)。", `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`),
    279: s("时间 O(n sqrt n)，空间 O(n)", "dp[i] 表示组成 i 的最少完全平方数数量。枚举所有 j*j <= i，用 dp[i - j*j] + 1 更新 dp[i]。", `class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[0] = 0;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j * j <= i; j++) {
                dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
            }
        }
        return dp[n];
    }
}`),
    322: s("时间 O(amount * coins.length)，空间 O(amount)", "dp[x] 表示凑成金额 x 的最少硬币数。dp[0]=0，其余初始化为不可达的大数。对每个金额枚举硬币转移。", `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int x = 1; x <= amount; x++) {
            for (int coin : coins) {
                if (x >= coin) dp[x] = Math.min(dp[x], dp[x - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`),
    139: s("时间 O(n^2 * k)，空间 O(n)", "dp[i] 表示 s[0..i) 能否被拆分。枚举 j，如果 dp[j] 为 true 且 s[j..i) 在字典中，则 dp[i] 为 true。", `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> set = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && set.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}`),
    300: s("时间 O(n log n)，空间 O(n)", "tails[len] 表示长度为 len+1 的递增子序列的最小结尾值。遍历每个数，用二分找到它能替换的位置，保持 tails 尽量小。", `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int l = 0, r = size;
            while (l < r) {
                int m = l + (r - l) / 2;
                if (tails[m] >= x) r = m;
                else l = m + 1;
            }
            tails[l] = x;
            if (l == size) size++;
        }
        return size;
    }
}`),
    152: s("时间 O(n)，空间 O(1)", "因为负数会让最大值和最小值互换，所以同时维护以当前位置结尾的最大乘积和最小乘积。遇到负数时交换两者。", `class Solution {
    public int maxProduct(int[] nums) {
        int max = nums[0], min = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) {
                int t = max; max = min; min = t;
            }
            max = Math.max(nums[i], max * nums[i]);
            min = Math.min(nums[i], min * nums[i]);
            ans = Math.max(ans, max);
        }
        return ans;
    }
}`),
    46: s("时间 O(n * n!)，空间 O(n)", "全排列每一层从所有未使用元素中选一个。用 used 数组标记当前路径已选元素，路径长度等于 nums.length 时收集答案，递归返回后撤销选择。", `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> ans = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), ans);
        return ans;
    }
    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
        if (path.size() == nums.length) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path, ans);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}`),
    78: s("时间 O(n * 2^n)，空间 O(n)", "子集问题每个元素都有选或不选。回溯中每到一个节点都收集当前 path，然后从 start 之后继续选择，避免重复组合。", `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> ans = new ArrayList<>();
        dfs(nums, 0, new ArrayList<>(), ans);
        return ans;
    }
    private void dfs(int[] nums, int start, List<Integer> path, List<List<Integer>> ans) {
        ans.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            dfs(nums, i + 1, path, ans);
            path.remove(path.size() - 1);
        }
    }
}`),
    17: s("时间 O(4^n * n)，空间 O(n)", "每个数字对应一组字母。按 digits 的位置递归，每层枚举当前数字对应的字母，加入路径后进入下一位。", `class Solution {
    private final String[] map = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    public List<String> letterCombinations(String digits) {
        List<String> ans = new ArrayList<>();
        if (digits.length() == 0) return ans;
        dfs(digits, 0, new StringBuilder(), ans);
        return ans;
    }
    private void dfs(String digits, int idx, StringBuilder path, List<String> ans) {
        if (idx == digits.length()) {
            ans.add(path.toString());
            return;
        }
        for (char c : map[digits.charAt(idx) - '0'].toCharArray()) {
            path.append(c);
            dfs(digits, idx + 1, path, ans);
            path.deleteCharAt(path.length() - 1);
        }
    }
}`),
    39: s("时间指数级，空间 O(target / min)", "组合题要用 start 控制选择起点，避免 [2,3] 和 [3,2] 重复。因为同一数字可以重复使用，递归时继续传 i，而不是 i + 1。", `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> ans = new ArrayList<>();
        dfs(candidates, target, 0, new ArrayList<>(), ans);
        return ans;
    }
    private void dfs(int[] nums, int rest, int start, List<Integer> path, List<List<Integer>> ans) {
        if (rest == 0) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length && nums[i] <= rest; i++) {
            path.add(nums[i]);
            dfs(nums, rest - nums[i], i, path, ans);
            path.remove(path.size() - 1);
        }
    }
}`),
    22: s("时间 O(Cn * n)，空间 O(n)", "生成过程中保证任意前缀的右括号数不超过左括号数。left 表示已用左括号，right 表示已用右括号；能放左就放左，right < left 时才能放右。", `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> ans = new ArrayList<>();
        dfs(n, 0, 0, new StringBuilder(), ans);
        return ans;
    }
    private void dfs(int n, int left, int right, StringBuilder path, List<String> ans) {
        if (path.length() == 2 * n) {
            ans.add(path.toString());
            return;
        }
        if (left < n) {
            path.append('(');
            dfs(n, left + 1, right, path, ans);
            path.deleteCharAt(path.length() - 1);
        }
        if (right < left) {
            path.append(')');
            dfs(n, left, right + 1, path, ans);
            path.deleteCharAt(path.length() - 1);
        }
    }
}`),
    79: s("时间 O(mn * 4^L)，空间 O(L)", "从每个格子尝试作为起点。DFS 匹配 word 的第 idx 个字符，访问过的格子临时标记，递归后恢复，避免同一格重复使用。", `class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                if (dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }
    private boolean dfs(char[][] b, String w, int i, int j, int k) {
        if (k == w.length()) return true;
        if (i < 0 || i >= b.length || j < 0 || j >= b[0].length || b[i][j] != w.charAt(k)) return false;
        char old = b[i][j];
        b[i][j] = '#';
        boolean ok = dfs(b, w, i + 1, j, k + 1) || dfs(b, w, i - 1, j, k + 1)
            || dfs(b, w, i, j + 1, k + 1) || dfs(b, w, i, j - 1, k + 1);
        b[i][j] = old;
        return ok;
    }
}`),
    131: s("时间 O(n * 2^n)，空间 O(n)", "枚举每个切割点，如果 s[start..end] 是回文，就加入路径并递归处理 end+1。到字符串末尾时收集一种分割方案。", `class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> ans = new ArrayList<>();
        dfs(s, 0, new ArrayList<>(), ans);
        return ans;
    }
    private void dfs(String s, int start, List<String> path, List<List<String>> ans) {
        if (start == s.length()) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!isPal(s, start, end)) continue;
            path.add(s.substring(start, end + 1));
            dfs(s, end + 1, path, ans);
            path.remove(path.size() - 1);
        }
    }
    private boolean isPal(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}`),
    51: s("时间 O(n!)，空间 O(n^2)", "逐行放皇后。用列、主对角线、副对角线三个布尔数组判断冲突。放置后进入下一行，返回时撤销。", `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> ans = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        dfs(0, board, new boolean[n], new boolean[2 * n], new boolean[2 * n], ans);
        return ans;
    }
    private void dfs(int row, char[][] board, boolean[] col, boolean[] d1, boolean[] d2, List<List<String>> ans) {
        int n = board.length;
        if (row == n) {
            List<String> one = new ArrayList<>();
            for (char[] r : board) one.add(new String(r));
            ans.add(one);
            return;
        }
        for (int c = 0; c < n; c++) {
            int a = row - c + n, b = row + c;
            if (col[c] || d1[a] || d2[b]) continue;
            board[row][c] = 'Q'; col[c] = d1[a] = d2[b] = true;
            dfs(row + 1, board, col, d1, d2, ans);
            board[row][c] = '.'; col[c] = d1[a] = d2[b] = false;
        }
    }
}`),
    35: s("时间 O(log n)，空间 O(1)", "标准二分找第一个大于等于 target 的位置。left/right 用左闭右开写法，循环结束时 left 就是插入位置。", `class Solution {
    public int searchInsert(int[] nums, int target) {
        int l = 0, r = nums.length;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] >= target) r = m;
            else l = m + 1;
        }
        return l;
    }
}`),
    74: s("时间 O(log mn)，空间 O(1)", "矩阵整体可以看成一维升序数组。用下标 mid 映射到 matrix[mid / n][mid % n]，做普通二分。", `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            if (val < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
}`),
    34: s("时间 O(log n)，空间 O(1)", "分别找第一个大于等于 target 的位置和第一个大于 target 的位置。若左边界越界或不是 target，说明不存在。", `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = lower(nums, target);
        int right = lower(nums, target + 1) - 1;
        if (left == nums.length || nums[left] != target) return new int[]{-1, -1};
        return new int[]{left, right};
    }
    private int lower(int[] nums, int target) {
        int l = 0, r = nums.length;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] >= target) r = m;
            else l = m + 1;
        }
        return l;
    }
}`),
    33: s("时间 O(log n)，空间 O(1)", "旋转数组中至少有一半是有序的。每次根据 nums[l] <= nums[mid] 判断左半是否有序，再判断 target 是否落在有序半边，决定收缩方向。", `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {
                if (nums[l] <= target && target < nums[m]) r = m - 1;
                else l = m + 1;
            } else {
                if (nums[m] < target && target <= nums[r]) l = m + 1;
                else r = m - 1;
            }
        }
        return -1;
    }
}`),
    153: s("时间 O(log n)，空间 O(1)", "与右端点比较。若 nums[mid] > nums[right]，说明最小值在右侧；否则最小值在 mid 或左侧。循环结束 left 指向最小值。", `class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] > nums[r]) l = m + 1;
            else r = m;
        }
        return nums[l];
    }
}`),
    4: s("时间 O(log(m+n))，空间 O(1)", "把中位数问题转成找第 k 小。每次比较两个数组当前第 k/2 个候选，排除较小的一段。注意数组越界和 k==1 的边界。", `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int total = nums1.length + nums2.length;
        if (total % 2 == 1) return kth(nums1, 0, nums2, 0, total / 2 + 1);
        return (kth(nums1, 0, nums2, 0, total / 2) + kth(nums1, 0, nums2, 0, total / 2 + 1)) / 2.0;
    }
    private int kth(int[] a, int i, int[] b, int j, int k) {
        if (i >= a.length) return b[j + k - 1];
        if (j >= b.length) return a[i + k - 1];
        if (k == 1) return Math.min(a[i], b[j]);
        int ai = Math.min(i + k / 2, a.length) - 1;
        int bj = Math.min(j + k / 2, b.length) - 1;
        if (a[ai] <= b[bj]) return kth(a, ai + 1, b, j, k - (ai - i + 1));
        return kth(a, i, b, bj + 1, k - (bj - j + 1));
    }
}`),
    20: s("时间 O(n)，空间 O(n)", "遇到左括号入栈，遇到右括号时检查栈顶是否是对应左括号。遍历结束后栈为空才合法。", `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`),
    155: s("每个操作时间 O(1)，空间 O(n)", "用一个辅助栈 minStack，同步保存当前位置之前的最小值。push 时把 min(x, 当前最小值) 入 minStack，pop 时两个栈一起弹。", `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> min = new ArrayDeque<>();
    public void push(int val) {
        stack.push(val);
        min.push(min.isEmpty() ? val : Math.min(val, min.peek()));
    }
    public void pop() {
        stack.pop();
        min.pop();
    }
    public int top() {
        return stack.peek();
    }
    public int getMin() {
        return min.peek();
    }
}`),
    416: s("时间 O(n * target)，空间 O(target)", "把问题转成是否能从数组中选出若干数，使和等于总和的一半。若总和为奇数直接返回 false。用一维 0/1 背包，dp[j] 表示能否凑出和 j，遍历每个数时 j 必须从 target 倒序更新，避免同一个数被重复使用。", `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if ((sum & 1) == 1) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums) {
            for (int j = target; j >= x; j--) {
                dp[j] = dp[j] || dp[j - x];
            }
        }
        return dp[target];
    }
}`),
    32: s("时间 O(n)，空间 O(n)", "用栈保存还没有匹配掉的下标，并先放入 -1 作为哨兵边界。遇到 '(' 入栈；遇到 ')' 先弹出一个左括号位置，如果栈空，说明当前位置成为新的无效边界；否则用 i - stack.peek() 更新最长长度。", `class Solution {
    public int longestValidParentheses(String s) {
        int ans = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1);
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i);
            } else {
                stack.pop();
                if (stack.isEmpty()) stack.push(i);
                else ans = Math.max(ans, i - stack.peek());
            }
        }
        return ans;
    }
}`),
    62: s("时间 O(mn)，空间 O(n)", "每个格子只能从上方或左方到达。用一维 dp 表示当前行每一列的路径数，初始化第一行为 1。遍历新行时，dp[j] = dp[j] + dp[j - 1]，其中 dp[j] 是上方路径数，dp[j - 1] 是左方路径数。", `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
}`),
    64: s("时间 O(mn)，空间 O(n)", "dp[j] 表示走到当前行第 j 列的最小路径和。第一行只能从左往右累加，第一列只能从上往下累加；其他位置取上方 dp[j] 和左方 dp[j - 1] 的较小值，再加当前格子。", `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        dp[0] = grid[0][0];
        for (int j = 1; j < n; j++) dp[j] = dp[j - 1] + grid[0][j];
        for (int i = 1; i < m; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < n; j++) {
                dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
            }
        }
        return dp[n - 1];
    }
}`),
    5: s("时间 O(n^2)，空间 O(1)", "枚举每个位置作为回文中心。回文长度可能是奇数，也可能是偶数，所以分别从 (i,i) 和 (i,i+1) 向两侧扩展。每次得到更长回文时更新起止边界。", `class Solution {
    public String longestPalindrome(String s) {
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(s, i, i);
            int len2 = expand(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start + 1) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }
    private int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        return r - l - 1;
    }
}`),
    1143: s("时间 O(mn)，空间 O(mn)", "dp[i][j] 表示 text1 前 i 个字符和 text2 前 j 个字符的最长公共子序列长度。若当前字符相等，则来自 dp[i-1][j-1] + 1；否则取删除 text1 当前字符或删除 text2 当前字符后的较大值。", `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`),
    72: s("时间 O(mn)，空间 O(mn)", "dp[i][j] 表示 word1 前 i 个字符变成 word2 前 j 个字符的最少操作数。初始化空串到另一串需要连续插入或删除。字符相等时沿用左上角；不等时在插入、删除、替换三种操作中取最小值再加 1。", `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1])) + 1;
                }
            }
        }
        return dp[m][n];
    }
}`),
    136: s("时间 O(n)，空间 O(1)", "异或满足 x ^ x = 0 且 x ^ 0 = x，并且交换律成立。数组中成对出现的数字会互相抵消，最后剩下的就是只出现一次的数字。", `class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for (int x : nums) ans ^= x;
        return ans;
    }
}`),
    169: s("时间 O(n)，空间 O(1)", "Boyer-Moore 投票。维护候选值 candidate 和票数 count。票数为 0 时更换候选；遇到相同数字加一票，不同数字抵消一票。因为多数元素出现次数超过一半，最终候选一定是答案。", `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += x == candidate ? 1 : -1;
        }
        return candidate;
    }
}`),
    75: s("时间 O(n)，空间 O(1)", "用三指针维护三个区域：[0,left) 全是 0，(right,n-1] 全是 2，i 扫描未知区。遇到 0 与 left 交换并同时前进；遇到 2 与 right 交换但 i 不动，因为换过来的数还没检查；遇到 1 直接前进。", `class Solution {
    public void sortColors(int[] nums) {
        int left = 0, i = 0, right = nums.length - 1;
        while (i <= right) {
            if (nums[i] == 0) {
                swap(nums, left++, i++);
            } else if (nums[i] == 2) {
                swap(nums, i, right--);
            } else {
                i++;
            }
        }
    }
    private void swap(int[] nums, int i, int j) {
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
}`),
    31: s("时间 O(n)，空间 O(1)", "从右往左找到第一个 nums[i] < nums[i+1] 的位置，说明 i 右侧是降序后缀。再从右往左找第一个大于 nums[i] 的数交换，最后反转后缀，使它变成最小升序排列。若找不到 i，整个数组已经是最大排列，直接整体反转。", `class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums, i, j);
        }
        reverse(nums, i + 1, nums.length - 1);
    }
    private void reverse(int[] nums, int l, int r) {
        while (l < r) swap(nums, l++, r--);
    }
    private void swap(int[] nums, int i, int j) {
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
}`),
    287: s("时间 O(n)，空间 O(1)", "把数组值看成链表 next 指针：当前位置 i 指向 nums[i]。因为数字范围是 1..n 且有重复值，一定会形成环，重复数就是环入口。先用快慢指针相遇，再让一个指针回到起点，两者同步走，相遇点就是重复数字。", `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`),
    94: s("时间 O(n)，空间 O(n)", "中序遍历顺序是左、根、右。递归写法最直接：先遍历左子树，再记录当前节点，最后遍历右子树。", `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        dfs(root, ans);
        return ans;
    }
    private void dfs(TreeNode node, List<Integer> ans) {
        if (node == null) return;
        dfs(node.left, ans);
        ans.add(node.val);
        dfs(node.right, ans);
    }
}`),
    104: s("时间 O(n)，空间 O(h)", "树的最大深度等于左右子树最大深度加 1。递归到 null 返回 0，自底向上返回高度。", `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}`),
    226: s("时间 O(n)，空间 O(h)", "对每个节点交换左右孩子，然后递归翻转左右子树。先交换还是先递归都可以，只要每个节点处理一次。", `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode tmp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(tmp);
        return root;
    }
}`),
    101: s("时间 O(n)，空间 O(h)", "判断两棵子树是否镜像：根值相等，左树的左子树对应右树的右子树，左树的右子树对应右树的左子树。", `class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || mirror(root.left, root.right);
    }
    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    }
}`),
    543: s("时间 O(n)，空间 O(h)", "任意节点作为拐点时，路径长度等于左子树高度 + 右子树高度。DFS 返回当前节点高度，同时更新全局最大直径。", `class Solution {
    private int ans = 0;
    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return ans;
    }
    private int depth(TreeNode node) {
        if (node == null) return 0;
        int l = depth(node.left), r = depth(node.right);
        ans = Math.max(ans, l + r);
        return Math.max(l, r) + 1;
    }
}`),
    102: s("时间 O(n)，空间 O(n)", "层序遍历使用队列。每轮先记录当前队列大小，这一批节点就是同一层，依次弹出并加入左右孩子。", `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            ans.add(level);
        }
        return ans;
    }
}`),
    108: s("时间 O(n)，空间 O(log n)", "升序数组构造高度平衡 BST。每次选择中点作为根，左半部分构造左子树，右半部分构造右子树。", `class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    private TreeNode build(int[] nums, int l, int r) {
        if (l > r) return null;
        int m = l + (r - l) / 2;
        TreeNode root = new TreeNode(nums[m]);
        root.left = build(nums, l, m - 1);
        root.right = build(nums, m + 1, r);
        return root;
    }
}`),
    98: s("时间 O(n)，空间 O(h)", "BST 的每个节点都必须落在允许范围内。递归时把当前节点值作为左子树上界、右子树下界，使用 long 避免 int 边界问题。", `class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        return valid(node.left, low, node.val) && valid(node.right, node.val, high);
    }
}`),
    230: s("时间 O(h+k)，空间 O(h)", "BST 中序遍历是升序。遍历过程中递减 k，当 k 变成 0 时当前节点就是第 k 小。", `class Solution {
    private int k;
    private int ans;
    public int kthSmallest(TreeNode root, int k) {
        this.k = k;
        dfs(root);
        return ans;
    }
    private void dfs(TreeNode node) {
        if (node == null || k == 0) return;
        dfs(node.left);
        if (--k == 0) { ans = node.val; return; }
        dfs(node.right);
    }
}`),
    199: s("时间 O(n)，空间 O(n)", "层序遍历时每层最后一个节点就是右视图节点。也可以 DFS 优先访问右子树，当深度第一次出现时记录。", `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        dfs(root, 0, ans);
        return ans;
    }
    private void dfs(TreeNode node, int depth, List<Integer> ans) {
        if (node == null) return;
        if (depth == ans.size()) ans.add(node.val);
        dfs(node.right, depth + 1, ans);
        dfs(node.left, depth + 1, ans);
    }
}`),
    114: s("时间 O(n)，空间 O(h)", "按先序顺序展开。递归函数返回展开后链表的尾节点。先展开左右子树，再把左链表插到 root 与右链表之间。", `class Solution {
    public void flatten(TreeNode root) {
        flattenTail(root);
    }
    private TreeNode flattenTail(TreeNode root) {
        if (root == null) return null;
        TreeNode leftTail = flattenTail(root.left);
        TreeNode rightTail = flattenTail(root.right);
        if (leftTail != null) {
            leftTail.right = root.right;
            root.right = root.left;
            root.left = null;
        }
        if (rightTail != null) return rightTail;
        if (leftTail != null) return leftTail;
        return root;
    }
}`),
    105: s("时间 O(n)，空间 O(n)", "前序第一个元素是根。用 HashMap 记录中序值到下标的位置，快速确定左子树大小，再递归构造左右子树。", `class Solution {
    private Map<Integer, Integer> index = new HashMap<>();
    private int pre = 0;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) index.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }
    private TreeNode build(int[] preorder, int l, int r) {
        if (l > r) return null;
        int val = preorder[pre++];
        TreeNode root = new TreeNode(val);
        int mid = index.get(val);
        root.left = build(preorder, l, mid - 1);
        root.right = build(preorder, mid + 1, r);
        return root;
    }
}`),
    437: s("时间 O(n)，空间 O(n)", "从根到当前节点维护前缀和 prefix。若之前存在 prefix - targetSum，则这些前缀到当前节点之间的路径和为目标值。回溯时要撤销当前前缀和计数。", `class Solution {
    private Map<Long, Integer> map = new HashMap<>();
    private int ans = 0;
    public int pathSum(TreeNode root, int targetSum) {
        map.put(0L, 1);
        dfs(root, 0L, targetSum);
        return ans;
    }
    private void dfs(TreeNode node, long sum, int target) {
        if (node == null) return;
        sum += node.val;
        ans += map.getOrDefault(sum - target, 0);
        map.put(sum, map.getOrDefault(sum, 0) + 1);
        dfs(node.left, sum, target);
        dfs(node.right, sum, target);
        map.put(sum, map.get(sum) - 1);
    }
}`),
    236: s("时间 O(n)，空间 O(h)", "递归查找 p 和 q。如果当前节点为空或等于 p/q，直接返回当前节点。左右子树都返回非空时，当前节点就是最近公共祖先；否则返回非空一侧。", `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`),
    124: s("时间 O(n)，空间 O(h)", "对每个节点，向父节点只能贡献一条向下路径，所以贡献值是 max(0, 左贡献, 右贡献) + node.val。以当前节点为拐点的路径和是 node.val + 左贡献 + 右贡献，用它更新全局答案。", `class Solution {
    private int ans = Integer.MIN_VALUE;
    public int maxPathSum(TreeNode root) {
        gain(root);
        return ans;
    }
    private int gain(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));
        ans = Math.max(ans, node.val + left + right);
        return node.val + Math.max(left, right);
    }
}`),
    200: s("时间 O(mn)，空间 O(mn)", "遍历网格，遇到陆地就答案加一，并用 DFS/BFS 把与它连通的陆地全部标记为水，避免重复统计。", `class Solution {
    public int numIslands(char[][] grid) {
        int ans = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    ans++;
                    dfs(grid, i, j);
                }
            }
        }
        return ans;
    }
    private void dfs(char[][] g, int i, int j) {
        if (i < 0 || i >= g.length || j < 0 || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0';
        dfs(g, i + 1, j); dfs(g, i - 1, j); dfs(g, i, j + 1); dfs(g, i, j - 1);
    }
}`),
    994: s("时间 O(mn)，空间 O(mn)", "多源 BFS。先把所有腐烂橘子入队，并统计新鲜橘子数量。每一层表示一分钟，腐烂相邻新鲜橘子。最后若仍有新鲜橘子返回 -1。", `class Solution {
    public int orangesRotting(int[][] grid) {
        int fresh = 0, minutes = 0;
        Queue<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 2) q.offer(new int[]{i, j});
                if (grid[i][j] == 1) fresh++;
            }
        }
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (fresh > 0 && !q.isEmpty()) {
            for (int size = q.size(); size > 0; size--) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int x = cur[0] + d[0], y = cur[1] + d[1];
                    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length || grid[x][y] != 1) continue;
                    grid[x][y] = 2;
                    fresh--;
                    q.offer(new int[]{x, y});
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`),
    207: s("时间 O(V+E)，空间 O(V+E)", "课程依赖可以看成有向图。用入度数组和队列做拓扑排序，每学完一门课就降低后续课程入度。若最终学完课程数等于总数，则无环。", `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            indeg[p[0]]++;
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
        int seen = 0;
        while (!q.isEmpty()) {
            int cur = q.poll();
            seen++;
            for (int next : graph.get(cur)) if (--indeg[next] == 0) q.offer(next);
        }
        return seen == numCourses;
    }
}`),
    208: s("插入/查询时间 O(L)，空间 O(字符总量)", "Trie 的每个节点保存 26 个孩子和一个 isEnd 标记。插入时沿字符创建节点；搜索完整单词要走到末尾且 isEnd 为 true；前缀查询只要路径存在。", `class Trie {
    class Node {
        Node[] next = new Node[26];
        boolean end;
    }
    private Node root = new Node();
    public void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) cur.next[i] = new Node();
            cur = cur.next[i];
        }
        cur.end = true;
    }
    public boolean search(String word) {
        Node node = find(word);
        return node != null && node.end;
    }
    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
    private Node find(String s) {
        Node cur = root;
        for (char c : s.toCharArray()) {
            cur = cur.next[c - 'a'];
            if (cur == null) return null;
        }
        return cur;
    }
}`)
  };
})();
