function shellSort(arr) {
    let len = arr.length
    let step = len
    let temp = null
    while (true) { // 确定增量
        step = Math.floor(step / 2)
        let k = 0
        while (k < step) { //根据增量分为若干子序列
            let i = k + step
            while (i < len) { // 插入排序
                let j = i
                while (j > k) {
                    if (arr[j] < arr[j - step]) {
                        temp = arr[j]
                        arr[j] = arr[j - step]
                        arr[j - step] = temp
                    } else {
                        break
                    }
                    j -= step
                }
                i += step
            }
            k++
        }
        if (step === 1) break
    }
}

let arr = [1, 2, 3, 1, 8, 6, 9, 4, 3]
console.time('shellSort')
shellSort(arr)
console.timeEnd('shellSort')


console.log('shellSort', arr)