function quickSort(arr) {
    split1(arr, 0, arr.length - 1)
}

function split(arr, left, right) {
    if (left < right) {
        let middle = Math.floor((left + right + 1) / 2)
        let target = arr[middle]

        let temp = arr[left]
        arr[left] = arr[middle]
        arr[middle] = temp

        let i = left
        let j = right + 1
        while (true) {
            while (arr[++i] < target) { if (i === right) break }
            while (arr[--j] > target) { if (j === left) break }
            if (i >= j) break

            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        temp = arr[j]
        arr[j] = arr[left]
        arr[left] = temp

        split(arr, left, j - 1)
        split(arr, j + 1, right)
    }
}




function split1(arr, left, right) {
    // 存储当前基点的数 然后从右边找比当前小的数 天
    if (left >= right) return
    let l = left, r = right, target = arr[left]
    while (l < r) {
        while (l < r && arr[r] >= target) { //从右向左找到比当前基数 target 小的下标 r
            r--
        }
        if (l < r) { // 将r中的数放到当前支点 l 中  l的位置向后移动一位
            arr[l] = arr[r]
            l++
        }
        while (l < r && arr[l] <= target) { // 从左向右找到比当前基数 target 大的下标 l
            l++
        }
        if (l < r) { // 将 l 中的数放到当前的r中 （r 的数在上一次已经放到 上一个l中） r的位置向前移动一位
            arr[r] = arr[l]
            r--
        }
    }
    arr[l] = target // 这个位置是最后的 target应该存在的位置 左边都比target小 右边都比target大
    split1(arr, left, l - 1)
    split1(arr, l + 1, right)

}


let arr = [1, 2, 3, 1, 8, 6, 9, 4, 3]
console.time('quickSort')
quickSort(arr)
console.timeEnd('quickSort')

console.log('quickSort', arr)

