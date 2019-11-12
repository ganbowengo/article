function log(name, fn, show) {
    console.time(name)
    console.log(name, fn())
    console.timeEnd(name)
    if (show) console.log('----------------------------------------')
}

// 在一个长度为 n 的数组中选择不相邻的数可以组成的最大值 假设数组元素都为正整数
/**
 * 有两种方式 -> 递推关系
 *      选择第 n 个数
 *          f(n) = f(n-2) + arr[n]
 *      不选择第 n 个数
 *          f(n) = f(n-1)
 * 结束条件 n = 0 -> arr[0]
 *         n = 1 -> max(arr[0], arr[1])
 */

// 递归解法
function rec_opt(arr, n) {
    if (n === 0) return arr[0]
    else if (n === 1) return Math.max(arr[0], arr[1])
    else {
        let a = rec_opt(arr, n - 2) + arr[n]
        let b = rec_opt(arr, n - 1)
        return Math.max(a, b)
    }
}

// 动态规划解法
function dp_opt(arr) {
    let l = arr.length
    let result = new Array(l).fill(0)
    // 初始值
    result[0] = arr[0]
    result[1] = Math.max(arr[0], arr[1])
    for (let i = 2; i < l; i++) {
        // 条件判断 递推关系
        let a = result[i - 2] + arr[i]
        let b = result[i - 1]
        result[i] = Math.max(a, b)
    }
    return result[l - 1]
}

let a = [1, 2, 4, 2, 3]
log('dp_opt(a)', () => dp_opt(a))
log('rec_opt(a)', () => rec_opt(a, a.length - 1), true)

// 长度为 n 的数组中是否存在可以组成 m 的数 假设数组元素都为正整数
/**
 * 有两种方式 -> 递推关系
 *      选择第 n 个数
 *          subSet(arr, n, m) = subSet(arr, n - 1, m - arr[n])
 *      不选择第 n 个数
 *          subSet(arr, n, m) = subSet(arr, n - 1, m)
 * 结束条件 m = 0 -> true
 *         n = 0 -> arr[n] === m
 */

// 递归解法
function rec_subSet(arr, n, m) {
    if (m === 0) return true
    else if (n === 0) return arr[n] === m
    else if (arr[n] > m) return rec_subSet(arr, n - 1, m)
    else {
        let a = rec_subSet(arr, n - 1, m - arr[n])
        let b = rec_subSet(arr, n - 1, m)
        return a || b
    }
}

// 动态规划解法
function dp_subSet(arr, m) {
    let l = arr.length
    // 设置初始值 填空
    let result = new Array(l).fill(0).map(item => new Array(m + 1).fill(false)).map(item => {
        item[0] = true
        return item
    })
    result[0][arr[0]] = true
    for (let i = 1; i < l; i++) {
        for (let j = 1; j < m + 1; j++) {
            if (arr[i] > m) result[i][j] = result[i - 1][j]
            else {
                let a = result[i - 1][j - arr[i]]
                let b = result[i - 1][j]
                result[i][j] = a || b
            }
        }
    }
    return result[l - 1][m]
}


let b = [1, 2, 4, 2, 3]

log('dp_subSet(a)', () => dp_subSet(b, 13))
log('rec_subSet(a)', () => rec_subSet(b, b.length - 1, 13), true)


// 爬楼梯问题 每次只能走一步或者两步 到第N个台阶有多少种组合
/**
 * 有两种方式 -> 递推关系
 *      选择第 n 个数
 *          f(n) = f(n-1) + f(n-2)
 * 结束条件 n = 1 -> 1
 *         n = 2 -> 2
 */

// 递归解法
function rec_climbStairs(n) {
    if (n === 1) return 1
    if (n === 2) return 2
    return rec_climbStairs(n - 1) + rec_climbStairs(n - 2)
}

// 动态规划解法
function dp_climbStairs(n) {
    let arr = new Array(n + 1)
    arr[0] = 1
    arr[1] = 1
    arr[2] = 2
    for (let i = 3; i < n + 1; i++) {
        arr[i] = arr[i - 1] + arr[i - 2]
    }
    return arr[n]
}

log('rec_climbStairs', () => rec_climbStairs(33))
log('dp_climbStairs', () => dp_climbStairs(33), true)


// 挖金矿 有 n座金矿 每座金矿产量为m、需要人数为r 共有h个工人 前提每座金矿必须全部挖完 最多挖多少
/**
 * 有两种方式 -> 递推关系
 *      arr -> 表示是每座金矿产量
 *      person -> 表示是每座需要人数
 *      arr 与 person 对应
 *      选择第 n 个数
 *          f(n) = f(n-1, h - person[n]) + arr[n]
 *      不选择选择第 n 个数
 *          f(n) = f(n-1, h)
 * 结束条件 n <= 1 && h < person[n]  -> 0
 *         n == 1 &&& h > person[n] -> arr[]
 */


// 递归解法
function rec_gold(n, h, person, arr) {
    if (n === 1 && h < person[0]) return 0
    if (n === 1 && h >= person[0]) return arr[0]
    if (n > 1 && h < person[n - 1]) return rec_gold(n - 1, h, person, arr)
    let a = rec_gold(n - 1, h - person[n - 1], person, arr) + arr[n - 1]
    let b = rec_gold(n - 1, h, person, arr)
    return Math.max(a, b)
}

// 动态规划解法
function dp_gold(n, h, person, arr) {
    // 初始化数组
    let w = new Array(n).fill(0).map((item, p) => new Array(h + 1).fill(0).map((item, index) => (p === 0 && index >= person[0]) ? arr[0] : 0))
    let a, b
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < h + 1; j++) {
            if (j < person[i]) w[i][j] = w[i - 1][j]
            else {
                a = w[i - 1][j - person[i]] + arr[i]
                b = w[i - 1][j]
                w[i][j] = Math.max(a, b)
            }
        }
    }
    let result = [] // 获取最佳子路径
    let i = n - 1
    let j = h
    while (i >= 0) { // 从最优解向前回溯
        // 如果c[i][j] = c[i-1][j],表明商品i没有被选择；否则就被选择
        // 从表格的右下端开始，即c[5][10]，回溯。
        // 如c[5][10]≠c[4][10]c[5][10]≠c[4][10]则商品5被选择，而此时背包容量j-w[5]=4;继续向上回溯，比较c[4][4]=c[3][4],表明商品4不选。
        // 回溯到第一个商品时，如果c[1][j]≠0c[1][j]≠0,表明被选择
        if (i > 0 && w[i][j] !== w[i - 1][j]) {
            j = j - person[i]
            result.unshift(i)
        }
        if (i === 0 && w[i][j] !== 0) {
            result.unshift(i)
        }
        i--
    }
    return w[n - 1][h]
}

// 动态规划解法 优化空间
function dp_gold1(n, h, person, arr) {
    // 初始化数组
    let w = new Array(h).fill(0).map((item, index) => index < person[0] ? 0 : arr[0])
    let result = new Array(h).fill(0)
    let c = []
    let a, b
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= h; j++) {
            if (j < person[i]) result[j] = w[j]
            else {
                a = w[j - person[i]] + arr[i]
                b = w[j]
                result[j] = Math.max(a, b)
            }
        }
        w = JSON.parse(JSON.stringify(result)) // 不深拷贝 数据会出现问题
    }
    return w[h]
}

log('rec_gold', () => rec_gold(5, 10, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]))
log('dp_gold', () => dp_gold(5, 10, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]))
log('dp_gold1', () => dp_gold1(5, 10, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]), true)


// leetcode 62题 m*n个格子 每个格子只能向右或向下移动一步 到m*n格子有多少路径
/**
 * 有两种方式 -> 递推关系
 *      f(m,n) =  f(m-1, n) + f(m, n)
 * 结束条件 
 *      n == 1 || m == 1  -> 1
 */

// 递归解法
function rec_box(m, n) {
    if (m === 1 || n === 1) {
        return 1
    }
    return rec_box(m - 1, n) + rec_box(m, n - 1)
}

// 动态规划 空间O(n * m)
function dp_box(m, n) {
    let arr = new Array(m)
    for (let i = 0; i < m; i++) {
        arr[i] = new Array(n)
        for (let j = 0; j < n; j++) {
            if (i === 0 || j === 0) arr[i][j] = 1
            else arr[i][j] = arr[i - 1][j] + arr[i][j - 1]
        }
    }
    return arr[m - 1][n - 1]
}

// 优化动态规划 空间O(n)
function dp_box1(m, n) {
    let arr = new Array(m).fill(1)
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            arr[j] = arr[j] + arr[j - 1]
        }
    }
    return arr[n - 1]
}
log('rec_box', () => rec_box(7, 3))
log('dp_box', () => dp_box(7, 3))
log('dp_box1', () => dp_box1(7, 3), true)


// 公共序列数问题 - 不需要连续
// A字符串长度为m  B字符串长度为n 找到两个的公共子序列
/**
 * -> 递推关系
 *      A[m] === B[n]
 *      f(m,n) = f(m-1,n-1) + 1
 *      A[m] !== B[n]
 *      f(m,n) = Max(f(m,n-1), f(m-1,n))
 * 结束条件
 *      n === 0 || m === 0 -> 0
 */

//  递归解法
function rec_common_str(m, n, str1, str2) {
    if (m === 0 || n === 0) {
        return 0
    }
    if (str1[m] === str2[n]) {
        return rec_common_str(m - 1, n - 1, str1, str2) + 1
    } else {
        let a = rec_common_str(m - 1, n, str1, str2)
        let b = rec_common_str(m, n - 1, str1, str2)
        return Math.max(a, b)
    }
}

//  动态规划解法
function dp_common_str(str1, str2) {
    let m = str1.length
    let n = str2.length
    let res = new Array(m + 1)
    let a, b
    for (let i = 0; i <= m; i++) {
        res[i] = new Array(n + 1)
        for (let j = 0; j <= n; j++) {
            if (i === 0 || j === 0) res[i][j] = 0
            else if (str1[i] === str2[j]) {
                res[i][j] = res[i - 1][j - 1] + 1
            } else {
                a = res[i - 1][j]
                b = res[i][j - 1]
                res[i][j] = Math.max(a, b)
            }
        }
    }
    return res[m][n]
}

let str1 = 'ABCBDAB'
let str2 = 'BDCABA'
log('rec_common_str', () => rec_common_str(str1.length, str2.length, str1, str2))
log('dp_common_str', () => dp_common_str(str1, str2), true)


// 最长公共子串数问题 - 连续
// A字符串长度为m  B字符串长度为n 找到两个的公共子串
/**
 * -> 递推关系
 *      A[m] === B[n]
 *      f(m,n) = f(m-1,n-1) + 1
 *      A[m] !== B[n]
 *      f(m,n) = 0
 * 结束条件
 *      n === 0 || m === 0 -> 0
 */

// 动态规划
function dp_max_common_str(str1, str2) {
    let m = str1.length
    let n = str2.length
    let max = 0
    let res = new Array(m + 1)
    for (let i = 0; i <= m; i++) {
        res[i] = new Array(n + 1)
        for (let j = 0; j <= n; j++) {
            if (i === 0 || j === 0) res[i][j] = 0
            else if (str1[i] === str2[j]) {
                res[i][j] = res[i - 1][j - 1] + 1
                max = Math.max(max, res[i][j])
            } else {
                res[i][j] = 0
            }
        }
    }
    return max
}

let str3 = 'ABCBDAB'
let str4 = 'BDCABA'
log('dp_max_common_str', () => dp_max_common_str(str3, str4), true)


// 背包问题
// 小偷发现了n个商品，第i个商品重量为wi,价值为vi。小偷希望尽量拿走价值高的商品，但是他的背包只能容纳W重的商品。求如何取舍这些商品？
/**
 * -> 递推关系
 *      选择 i 
 *      f(i, w) = max(f(i - 1, w - wi) + vi,f(i - 1, w)) 
 *      不选择 i
 *      f(i, w) = f(i - 1, w)
 * 结束条件
 *      i === 0 => 0
 *      i === 1 => v1
 *      i > 1 && w < wi  => f(i - 1, w)
 *      i > 1 && w > wi  => f(i, w) = max(f(i - 1, w - wi) + vi,f(i - 1, w))
 */

// 递归解法
function rec_package(n, w, wArr, vArr) {
    if (n === 0 && w < wArr[0]) return 0
    if (n === 0 && w >= wArr[0]) return vArr[0]
    if (n >= 1 && w < wArr[n]) return rec_package(n - 1, w, wArr, vArr)
    let a = rec_package(n - 1, w - wArr[n], wArr, vArr) + vArr[n]
    let b = rec_package(n - 1, w, wArr, vArr)
    return Math.max(a, b)
}

// 动态规划解法
function dp_package(n, w, wArr, vArr) {
    let arr = new Array(n).fill(0)
    let a, b
    for (let i = 0; i < n; i++) {
        arr[i] = new Array(w).fill(0)
        for (let j = 0; j < w; j++) {
            if (i === 0 && j < wArr[0]) arr[i][j] = 0
            else if (i === 0 && j >= wArr[0]) arr[i][j] = vArr[0]
            else if (i >= 1 && j < wArr[i]) arr[i][j] = arr[i - 1][j]
            else {
                a = arr[i - 1][j - wArr[i]] + vArr[i]
                b = arr[i - 1][j]
                arr[i][j] = Math.max(a, b)
            }
        }
    }
    return arr[n - 1][w - 1]
}

let wArr = [3, 6, 3, 8, 6]
let vArr = [4, 6, 6, 12, 10]
log('rec_package', () => rec_package(4, 10, wArr, vArr))
log('dp_package', () => dp_package(wArr.length, 10, wArr, vArr))