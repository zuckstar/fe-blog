# 数据结构和算法

数据结构和算法关注前端高频考题。

冲击阶段：直接到 codeTop 选中你要面试的公司，按出题频率刷题 [codeTop](https://codetop.cc/home)

准备阶段：按算法类型分类刷题，更易于记忆

常见前端数据结构和算法分类：

- 数组和双指针
- 递归和回溯 DFS、BFS
- 树和图
- 链表
- 栈与队列
- 贪心和动态规划
- 字符串处理
- 排序和查找
- 字符串处理

## 数组和双指针

| 算法                                                                                                             | 难度 | 完成次数 |
| ---------------------------------------------------------------------------------------------------------------- | ---- | -------- |
| [长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/description/)                          | 中等 | ❌       |
| [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/) | 中等 | ✅ ✅    |
| [螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/description/)                                              | 中等 | ✅       |
| [合并区间](https://leetcode.cn/problems/merge-intervals/description/)                                            | 中等 | ✅       |
| [三数之和](https://leetcode.cn/problems/3sum/description/)                                                       | 中等 | ✅       |
| [接雨水](https://leetcode.cn/problems/trapping-rain-water/)                                                      | 困难 | ❌       |
| [搜索二维矩阵 2](https://leetcode.cn/problems/search-a-2d-matrix-ii/submissions/558077360)                       | 中等 | ❌       |
| [盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/description/)                            | 中等 | ✅       |

## 递归和回溯

| 算法                                                           | 难度 | 完成次数 |
| -------------------------------------------------------------- | ---- | -------- |
| [子集](https://leetcode.cn/problems/subsets/description)       | 中等 | ❌       |
| [括号生成](https://leetcode.cn/problems/generate-parentheses/) | 中等 | ✅       |

## 树和图

| 算法                                                                                                                     | 难度 | 完成次数 |
| ------------------------------------------------------------------------------------------------------------------------ | ---- | -------- |
| [二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/description/)                                        | 简单 | ❌       |
| [二叉树最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/description/)                               | 困难 | ❌❌     |
| [路径总和 3](https://leetcode.cn/problems/path-sum-iii/description/)                                                     | 中等 | ❌       |
| [二叉树中和为目标值的路径](https://leetcode.cn/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/description/) | 中等 | ✅       |
| [N 叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/description/)                                | 简单 | ✅       |

## 链表

| 算法                                                                                   | 难度 | 完成次数 |
| -------------------------------------------------------------------------------------- | ---- | -------- |
| [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)               | 简单 | ✅       |
| [合并 k 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/description/)    | 困难 | ✅       |
| [LRU 缓存](https://leetcode.cn/problems/lru-cache/description/)                        | 中等 | ❌       |
| [反转链表](https://leetcode.cn/problems/reverse-linked-list/description/)              | 简单 | ✅       |
| [K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/) | 困难 | ✅       |
| [两数相加](https://leetcode.cn/problems/add-two-numbers/description/)                  | 中等 |          |
| [回文链表](https://leetcode.cn/problems/palindrome-linked-list/solutions/)             | 简单 | ✅       |
| [相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/) | 简单 | ✅       |

## 栈与队列

| 算法                                                                | 难度 | 完成次数 |
| ------------------------------------------------------------------- | ---- | -------- |
| [简化路径](https://leetcode.cn/problems/simplify-path/description/) | 中等 | ✅       |
| [最小栈](https://leetcode.cn/problems/min-stack/description/)       | 中等 | ✅       |

## 排序和查找

| 算法                                                                                                 | 难度 | 完成次数 |
| ---------------------------------------------------------------------------------------------------- | ---- | -------- |
| [数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/description/) | 中等 |          |
| [手撕快速排序](https://leetcode.cn/problems/sort-an-array/description/)                              | 中等 | ❌       |
| [搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/description)          | 中等 | ❌       |
| [二分查找](https://leetcode.cn/problems/binary-search/)                                              | 简单 |          |

### 冒泡排序

```js
var sortArray = function (nums) {
  const len = nums.length;
  // 外层，排序的次数，需要冒泡的次数
  for (let i = 0; i < len - 1; i++) {
    // 内层，相邻元素比较，左边大于右边则交换位置
    // - i 是已经有 i 个最大元素排好序列了，无需重复遍历
    for (let j = 0; j < len - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
      }
    }
  }

  return nums;
};
```

### 快速排序

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function (nums) {
  const swap = (i, j) => {
    [nums[i], nums[j]] = [nums[j], nums[i]];
  };

  const quicksort = (l, r) => {
    if (l >= r) {
      return;
    }

    const pivot = nums[l];

    let i = l;
    let j = r;

    while (i <= j) {
      // 不能是 >= 因为可能会跳过 pivot 目标值，导致最终定位到 pivot 的 +1 位置
      while (nums[j] > pivot) j--;
      while (nums[i] < pivot) i++;

      if (i <= j) {
        swap(i, j);
        i++;
        j--;
      }
    }

    quicksort(l, i - 1);
    // i ~ r 中可能有重复值，所以 i 也要参与排序
    quicksort(i, r);
  };
  quicksort(0, nums.length - 1);
  return nums;
};
```

## 动态规划

| 算法                                                                                           | 难度 | 完成次数 |
| ---------------------------------------------------------------------------------------------- | ---- | -------- |
| [最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/)                     | 中等 | ❌       |
| [最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/description/)     | 中等 |          |
| [买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description) | 简单 |          |

## 字符串处理

| 算法                                                                                                                                     | 难度 | 完成次数 |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------- |
| [字符串相加](https://leetcode.cn/problems/add-strings/description/)                                                                      | 简单 | ❌       |
| [字符串转整数](https://leetcode.cn/problems/string-to-integer-atoi/solutions/183164/zi-fu-chuan-zhuan-huan-zheng-shu-atoi-by-leetcode-/) | 中等 |          |
