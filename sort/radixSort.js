function radixSort(arr) {
    let len = arr.length
    let result = new Array(10)
    let j = 1
    while (true) {
        let flag = 0
        let i = 0
        while (i < len) {
            let current = Math.floor(arr[i] / j) % 10
            if (current === 0) flag++
            (result[current] || (result[current] = [])).push(arr[i])
            i++
        }
        let h = 0
        let g = 0
        while(h < 10){
            let currentlen = result[h] && result[h].length
            if(currentlen > 0) {
                let i = 0
                while(i < currentlen){
                    arr[g++] = result[h][i]
                    i++
                }
            }
            result[h] && (result[h].length = 0)
            h++
        }
        j = j * 10
        if (flag === len) break
    }
}

let arr = [1, 2, 3, 1, 8, 16, 19, 24, 3]
console.time('radixSort')
radixSort(arr)
console.timeEnd('radixSort')

console.log('radixSort', arr)