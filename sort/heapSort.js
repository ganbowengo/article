function heapSort(arr) {
    let len = arr.length
    let i = Math.floor((len / 2) - 1) // 第一个非叶子节点
    while (i >= 0) {
        createHeap(arr, i, len)
        i--
    }
    while (len--) {
        let temp = arr[len]
        arr[len] = arr[0]
        arr[0] = temp
        createHeap(arr, 0, len)
    }
}

function createHeap(arr, i, len) {
    let temp = arr[i]
    let k = 2 * i + 1
    while (k < len) {
        if (k + 1 < len && arr[k] < arr[k + 1]) {
            k++
        }

        if (arr[k] > temp) { // k = 2 * i + 1 || k = 2 * i + 2      temp为arr[i]  如果叶子节点大于根节点 则两个置换位置
            // 大顶堆：arr[i] >= arr[2i+1] && arr[i] >= arr[2i+2]  
            // 小顶堆：arr[i] <= arr[2i+1] && arr[i] <= arr[2i+2]  
            arr[i] = arr[k]
            i = k
        } else {
            break
        }
        k = 2 * k + 1
    }
    arr[i] = temp
}

let arr = [1, 2, 3, 1, 8, 6, 9, 4, 3]

console.time('heapSort')
heapSort(arr)
console.timeEnd('heapSort')

console.log('heapSort', arr)