function countSort(arr) {
    let len = arr.length
    let container = []
    let i = 0
    while (i < len) {
        let current = arr[i]
        container[current] || (container[current] = 0)
        container[current]++
        i++
    }
    let index = 0
    for (let i = 0; i < container.length; i++) {
        while (container[i] > 0) {
            arr[index++] = i
            container[i]--
        }
    }
}

function countSort1(arr) {
    let len = arr.length
    let i = 0
    let min = arr[0]
    let max = arr[0]
    while (i < len) {
        let current = arr[i]
        max = Math.max(max, current)
        min = Math.min(min, current)
        i++
    }
    let k = max - min + 1
    let container = new Array(k)
    i = 0
    while (i < k) {
        let current = arr[i] - min
        container[current] || (container[current] = 0)
        container[current]++
        i++
    }
    let index = 0
    let clen = container.length
    i = 0
    while(i < clen){
        while (container[i] > 0) {
            arr[index++] = i + min
            container[i]--
        }
        i++
    }
}

let arr = [1, 2, 3, 1, 8, 6, 9, 4, 3]

console.time('countSort')
countSort1(arr)
console.timeEnd('countSort')

console.log('countSort', arr)