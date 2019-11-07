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
console.log('dp_opt(a)', dp_opt(a))
console.log('dp_opt(a)', rec_opt(a, a.length - 1))


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
    let result = new Array(l).fill(0).map(item => new Array(m + 1).fill(false)).map(item => {
        item[0] = true
        return item
    })
    result[0][0] = true
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
    return result[l - 1][m - 1]
}


let b = [1, 2, 4, 2, 3]

console.log('dp_opt(a)', dp_subSet(a, 13))
console.log('dp_opt(a)', rec_subSet(b, b.length - 1, 13))

