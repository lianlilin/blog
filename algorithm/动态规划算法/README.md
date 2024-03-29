# 动态规划——未完成

很多文章试图用口语化的语言解释动态规划，提供了某种套路，这对解题很有帮助，但是如果阅读人停留在知其然不知其所以然的阶段，往往会导致这样的局面：一看就懂，一写就废，题目稍作改变就不会了，本文就是作者在学习动态规划中的一些感悟，对相关概念尽量提供相对教科书的解释（便于系统化、正规化的学习）和通俗的解释（便于学习、理解）。

    所有的知识最终需要内化成自己能理解的模式存储下来。

    —— 沃兹基硕德

## 什么是动态规划

    动态规划（Dynamic Programming，DP）是运筹学的一个分支，是求解决策过程最优化的过程。

    20世纪50年代初，美国数学家贝尔曼（R.Bellman）等人在研究多阶段决策过程的优化问题时，提出了著名的最优化原理，从而创立了动态规划。

    动态规划的应用极其广泛，包括工程技术、经济、工业生产、军事以及自动化控制等领域，并在背包问题、生产经营问题、资金管理问题、资源分配问题、最短路径问题和复杂系统可靠性问题等中取得了显著的效果。

—— 来自[百度百科-动态规划](https://baike.baidu.com/item/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92/529408?fr=ge_ala)


看不懂？看不懂就对了，谁一上来就能看得懂如此抽象的定义啊！即使大段内容看不懂，我们仍然能从中提取一些信息：

- 是求解决策过程`最优化`的过程
  - 记住最优化这个词，往往一些题目『求最XXXX的YYYY』同时看起来很复杂，往往就提示着这道题可能和动态规划有关。
- 并在背包问题、生产经营问题、资金管理问题、资源分配问题、最短路径问题和复杂系统可靠性问题等中取得了显著的效果。
  - 眼熟不，算法题目中的什么背包问题、最短路径问题等等为啥能用动态规划解决

动态规划是一种思想，它可以解决编程领域的一类问题。下面我们从一些核心概念开始。

## 动态规划中的核心概念

### 最优子结构
    如果一个问题的最优解包含其子问题的最优解，我们就称此问题具有最优子结构。
    
    ——《算法导论，15.3 动态规划原理》

相关资料：
- [动态规划的最优子结构问题，有什么样的问题它不满足最优子结构？](https://www.zhihu.com/question/52165201/answer/288025858)

### 无后效性

### dp转移方程


## 动态规划适用于解决什么问题
## 动态规划为什么这么难

动态规划不存在多项式解法，换句话说对于这类题目，动态规划几乎是唯一解。（还有暴力递归）

我认为难点主要来自于：

- 这题到底是不是要用动态规划
- 动态规划的dp数组构造问题

## 常规思路

- [什么是动态规划（Dynamic Programming）？动态规划的意义是什么？](https://www.zhihu.com/question/23995189/answer/1094101149)

### 第一步：定义数组元素含义
### 第二步：找出数组元素之间的关系
### 第三步：找出初始值

# 背包问题
背包问题是动态规划的一类，又细分为多种子类型。

- 设v为物品`价值`数组，[i]代表第i件物品的价值
- 设w为物品`重量`数组，w[i]代表第i件物品的重量（体积、价格等等）
- 设b为背包容量

## 01背包

每种物品只有1个，策略为选或者不选。标准解法如下：

```js
// 定义dp数组，dp[i][j]表示对于前i的物品，装满容量j的背包时的最大价值
let dp = new Array(w.length + 1).fill(0).map(() => new Array(b + 1).fill(0));

// 初始化
for (int j = 0; j <= b; j++) {
    dp[0][j] = 0;
}

// w数组的大小 就是物品个数
for(int i = 1; i < w.length; i++) { // 遍历物品
    for(int j = 0; j <= b; j++) { // 遍历背包容量
        if (j < w[i]) {
            dp[i][j] = dp[i - 1][j];
        }
        else {
            dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i]);
        }
    }
}
```

这里有几个关键点：

- ### 初始化问题

#### 为什么定义二维数组时行列数需要+1？

理论上不加也行，但是这样后面计算会比较麻烦，数组下标折腾起来太麻烦了。比如否则dp[i][j]代表前i + 1件物品填满 j + 1时的情况，加上需要在几个数组之间来回倒腾，非常容易出错。

- #### 定义dp数组时默认应该填充什么值？

一个简单的判断法则，填充的是非法情况，比如：

- 求背包內价值最大值时（不要求装满背包），价值不可能为负，最差就是0，那就都填充0
- 求恰好装满时背包时最大值，不一定能装满，所以填充 -Infinity，即默认为没有合法值的状态

此时还没进行计算，每个值都应该是undefined，但是考虑到后面可能有类似于Max(……) Min(……)等计算，默认填充的其实应该是一个无论如何都不会转移到此状态的值即可，这样可以让状态转移方程不比判断是否为undefined。


- #### dp数组如何初始化？

对于求价值类问题，一般dp[0][0] = 0，对于求方案数类问题，一般dp[0][0] = 1，因为什么都不放也是一种方案。由此类推第一行或者第一列。

- #### 先遍历背包还是先遍历物品？

先说结论：先遍历物品，再遍历背包。

大多数情况下反过来也行，但是对于01背包一维dp状态转移方程，不能先遍历背包，原因是，先遍历物品是一个逐行计算的过程，先遍历背包是一个逐列计算的过程，具体来说：

01背包中计算dp[i][j]的值需要用到第i-1行j及j左侧的值，先遍历物品，二维场景下可以保证此时i-1行j及j左侧的值都已经完成计算。但是对于一维场景下，dp[j]只保留了第i-1行的数据，第一轮外层循环走完时，dp中保存的是最后一行的结果。

- #### 对背包的遍历采用正序还是倒序？

先说结论：一维dp01场景下，需要倒序，其余二者都可以。

原因是一维场景下，计算需要用到当前列左侧上一行的值，要是正序遍历会被覆盖成当前行的值。


- #### 循环从0开始还是从1开始？

对于物品（外层循环），因为后续计算涉及i-1，所以至少需要从1开始，对于背包（内层循环），如果第一列完成了初始化，就从1开始，否则从0开始。

`其实从状态转移方程也能反推哪些值需要初始化。`


#### 如何理解二维状态转移方程
```
if (j < w[i]) {
    dp[i][j] = dp[i - 1][j];
}
else {
    dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i]);
}
```
- 对于第i件物品，有两种可能：
  - 剩余的背包容量放不下
  - 剩余的背包容量放得下，此时又有放或者不放两种可能
      - 不选择时，结果等于用前i - 1件物品装满容量j时的值
      - 选择时，接过等于用前 i - 1件物品装满容量j - w[i]时的值加上第i件物品的价值


#### 如何理解一维状态转移方程

因为计算`dp[i][j]`时只用到了`第i-1行`的值，此时可以通过滚动数组的方式对空间复杂度进行优化：

- 整体思路是每一轮计算时，将i-1行的数据先保存到第i行
- 以此类推只需要保留dp数组的第一行即可，每一轮的计算结果都保留到这一行，此时状态转移方程为

```
dp[i][j] = Max(dp[i][j], dp[i][j - w[i]] + v[i]);
```

继续观察二维状态转移方程对于`dp[i - 1][j], dp[i - 1][j - w[i]] + v[i])`，我们只用到了第j列或者第j-w[i]列（位于第j列左侧）的值，加上前面分析只用到了第i-1行的值，我们可以将二维数组降维成一维数组，此时状态转移方程为

```
dp[j] = Max(dp[j], dp[j - w[i]] + v[i])
```

注意，因为计算dp[j]时需要用到第i-1行的结果，此时如果对于背包容量的循环从小到大，当计算到dp[j]时，小于j的结果已经是第i行的计算结果了，这会导致`dp[j - w[i]]`取不到正确的值（原本预期是取dp[i - 1][j - w[i]]，但是因为j-w[i]一定小于j，而小于j的值已经是第i行的计算结果了）。

基于上述分析得到01背包的一维dp遍历的易出错点：

`对于01背包的一维dp遍历，背包大小的遍历需要从大到小，示例代码如下：`

```js
for(int i = 0; i < w.length; i++) { // 遍历物品
    for(int j = b; j >= w[i]; j--) { // 遍历背包容量
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);

    }
}
```

换句话说，对于一维dp遍历，对背包容量的循环要不要从大到小，就是看会不会用到dp[i][j]左侧的数据，对于二维dp遍历，因为历史计算结果保存在第i-1行，不存在被覆盖的问题，所以对背包容量的遍历不用倒序。


## 完全背包

如果将01背包每种物品只有1件的设定，修改为每种物品有无限多件，则问题变成完全背包问题。

完全背包的二维状态转移方程为：

```js
dp[i][j] = Max(dp[i - 1][j - w[i] * k] + v[i] * k);

0 <= k <= b/w[i]
```

经过数学推导（[《夜深人静写算法》动态规划篇](https://zhuanlan.zhihu.com/p/445009442)
）可得：

```js
dp[i][j] = Max(dp[i - 1][j], dp[i][j - w[i]] + v[i])
```
可以理解成，不放第i件物品和第i件物品至少放1个，后者就等于用前i件物品填满j-w[i]（把至少放的那一件拿出来，单独加上）


完全背包的一维状态转移方程为：
```js
dp[j] = Max(dp[j], dp[j - w[i]] + v[i])
```


## 多重背包

01背包每个物品有1个
完全背包每个物品有无数个
多种背包每个物品有有限个

一个简单的思路是，将有限个某个物品拆分成多个只有1个的物品，则此问题转化成01背包问题。

另一个简单思路是在01的内层循环将物品数量再循环一次。

更高级的做法是进行二进制优化。有空再研究

```js
// 完全背包问题思路二伪代码(空间优化版)
dp[0,...,W] = 0
for i = 1,...,N
    for j = W,...,w[i] // 必须逆向枚举!!!
        for k = [0, 1,..., min(n[i], j/w[i])]
            dp[j] = max(dp[j], dp[j−k*w[i]]+k*v[i])


f[i][v]=max{f[i-1][v-k*c[i]]+k*w[i]|0<=k<=n[i]}
```



## 分组背包

分组背包是物品有多组，每组內最多选一个。

一个简单思路是在01的内层循环将物品数量再循环一次。

## 二维费用背包问题

```js
f[i][v][u]=max{f[i-1][v][u],f[i-1][v-a[i]][u-b[i]]+w[i]}
```



- https://www.kancloud.cn/kancloud/pack/70127