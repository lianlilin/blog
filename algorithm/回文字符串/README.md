# 回文字符串

## 定义

正读和反读都一样的字符串，比如`moon`、`1234321`。

## 判断是不是回文字串

基础的类型是判断给定的字符串是不是回文字符串，有时候会加上一些特殊条件，例如：
- 忽略其中的非字母数字字符
- 忽略大小写
- ……


### 方法1：反转字符串和原字符串对比
```js
function judge(str) {
    return str.split('').reverse().join('') === str;
}
```

### 方法2：从两端向中间遍历
```js
function judge(str) {
    let left = 0;
    let right = str.length - 1;
    while(left <= right) {
        if (str[left] !==  str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

console.log(judge('abcdd'), judge('abcddcba'));
```

### 方法3：从中间向两端遍历

left与right指针分别从字符串中间向两端移动，因为需要考虑到字符串长度为奇数或者偶数的情况，即回文串有可能是(a, b, a)或者(a, a)两种模式，左右指针的起始位置需要略做计算。


## 求最长回文子串


### 遍历思路
有两种常规思路：

- 遍历所有子串，并判断每一个子串是否是回文串，找到最长的那一个。时间复杂度O(n^3)
- 遍历字符串，以每一个字符作为回文串的中心向两端遍历，时间复杂度O(n^2)，有一个问题需要注意
  - 以该字符作为中心时，存在奇数偶数两种情况，需要分别枚举遍历


```js
function judge(str) {
    for (let i = 0; i < str.length; i++) {
        // 先处理奇数情况
        let left = i - 1, right = i + 1;
        while(left >= 0 && right < str.length) {
            if (str[left] === str[right]) {
                // 计算回文串个数或者长度
                left--;
                right++;
            }
            else {
                break;
            }
        }
        // 处理偶数情况
        left = i, right = i + 1;
        while(left >= 0 && right < str.length) {
            if (str[left] === str[right]) {
                // 计算回文串个数或者长度
                left--;
                right++;
            } else {
                break;
            }
        }
    }
}
```

### 动态规划

思路是最长子串最短长度是1，最长长度是字符串长度，外层遍历子串长度，内层遍历字符串。

相当于先算所有两个字符的回文串，再算三个的以此类推，最后就是最长的情况。



## 最长回文子序列

注意，子序列和子串是不一样的。所以递归方程是不一样的。

if (s[i] === s[j]) {
    dp[i][j] = dp[i + 1][j - 1] + 2;
}
else {
    dp[i][j] = Max(dp[i + 1][j], dp[i][j - 1]);
}


## 判断字符组组成回文串的情况
统计每个字符出现的次数进行计算。

## 切分回文字符串

- 返回切分方案
- 返回最小切割次数

dp数组里存储了每个开始结束子串的情况.

dp[i] = Math.min(dp[i], dp[j - 1] + 1);