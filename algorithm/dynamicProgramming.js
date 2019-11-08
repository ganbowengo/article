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
    return w[n - 1][h]
}

// 动态规划解法 优化空间
function dp_gold1(n, h, person, arr) {
    // 初始化数组
    let w = new Array(h).fill(0).map((item, index) => index + 1 < person[0] ? 0 : arr[0])
    let result = new Array(h).fill(0)
    let a, b
    for (let i = 1; i < n; i++) {
        console.log(w)
        for (let j = 0; j < h; j++) {
            if (j + 1 < person[i]) result[j] = w[j]
            else {
                a = (w[j + 1 - person[i]] || 0) + arr[i]
                b = w[j]
                result[j] = Math.max(a, b)
            }
        }
        w = result
    }
    console.log(w)
    return w[h - 1]
}


function dp_gold2(n, w, g, p) {
    let s = new Array(p.length)
    let r = new Array(p.length)
    for (let i = 0; i <= n; i++) {
        s[i] = i < p[0] ? 0 : g[0]
    }
    console.log(s)
    let a, b
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= w; j++) {
            if (j < p[i]) r[j] = s[j]
            else {
                a = s[j - p[i]] + g[i]
                b = s[j]
                r[j] = Math.max(a, b)
            }
        }
        s = r
    }
    console.log(r, s)
    return s[n]
}

log('rec_gold', () => rec_gold(5, 10, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]))
log('dp_gold', () => dp_gold(5, 11, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]))
log('dp_gold1', () => dp_gold1(5, 10, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]))
log('dp_gold2', () => dp_gold2(5, 10, [5, 5, 3, 4, 3], [400, 500, 200, 300, 350]))