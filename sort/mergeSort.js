// function mergeSort(arr) {
//     let len = arr.length
//     if (len === 1) return arr
//     let middle = Math.floor(len / 2)
//     let left = arr.slice(0, middle)
//     let right = arr.slice(middle)
//     return merge(mergeSort(left), mergeSort(right))
// }

// function merge(left, right) {
//     let result = []
//     while (left.length && right.length) {
//         if (left[0] > right[0]) {
//             result.push(right.shift())
//         } else {
//             result.push(left.shift())
//         }
//     }
//     return result.concat(left).concat(right)
// }


function mergeSort(arr) {
    let temp = []
    split(arr, 0, arr.length - 1, temp)
}

// 拆
function split(arr, left, right, temp) {
    if (left < right) {
        let middle = Math.floor((left + right) / 2)
        split(arr, left, middle, temp)
        split(arr, middle + 1, right, temp)
        merge(arr, left, middle, right, temp)
    }
}

// 合
function merge(arr, left, middle, right, temp) {
    let first = left
    let j = middle + 1
    let k = 0
    // temp 记录当前的left开始到right结束的位置替换元素数组
    while (left <= middle && j <= right) {
        if (arr[left] <= arr[j]) {
            temp[k++] = arr[left++]
        } else {
            temp[k++] = arr[j++]
        }
    }
    while (left <= middle) temp[k++] = arr[left++]
    while (j <= right) temp[k++] = arr[j++]
    let i = 0
    while (i < k) arr[i + first] = temp[i++]
}

let arr = [1,2,3,1,8,6,9,4,3]
console.time('mergeSort')
mergeSort(arr)
console.timeEnd('mergeSort')

console.log('mergeSort', arr)