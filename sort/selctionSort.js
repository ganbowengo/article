function selctionSort() {
    let len = arr.length
    let i = 0
    let j = 0
    while(i < len - 1){
        let minIndex = i
        j = i + 1
        while(j < len){
            if(arr[j] < arr[minIndex]){
                minIndex = j
            }
            j++
        }
        if(minIndex !== i){
            let temp = arr[minIndex]
            arr[minIndex] = arr[i]
            arr[i] = temp
        }
        i++
    }
}


let arr = [1,2,3,1,8,6,9,4,3]
console.time('selctionSort')
selctionSort(arr)
console.timeEnd('selctionSort')


console.log('selctionSort', arr)