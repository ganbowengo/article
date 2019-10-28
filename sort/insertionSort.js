function insertionSort() {
    let len = arr.length
    let i = 0
    let j = 0
    while(i < len){
        j = i + 1
        while(j > 0){
            if(arr[j] < arr[j - 1]){
                let temp = arr[j - 1]
                arr[j - 1] = arr[j]
                arr[j] = temp
            }
            j--
        }
        i++
    }
}

let arr = [1,2,3,1,8,6,9,4,3]
console.time('insertionSort')
insertionSort(arr)
console.timeEnd('insertionSort')


console.log('insertionSort', arr)