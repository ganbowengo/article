function bubbleSort(arr){
    let len = arr.length
    let i = 0
    while(i < len){
        let j = len
        while(j-- > i){
            if(arr[j] < arr[j-1]){
                let temp = arr[j]
                arr[j] = arr[j-1]
                arr[j-1] = temp
            }
        }
        i++
    }
}
/*
* * * * *
* * * *
* * *
* *
*
*/

/*
* * * * *
  * * * *
    * * *
      * *
        *
*/
function bubbleSort1(arr){
    let len = arr.length
    let i = 0
    while(i < len){
        let j = len
        let flag = false
        while(j-- > i){
            if(arr[j] < arr[j-1]){
                let temp = arr[j]
                arr[j] = arr[j-1]
                arr[j-1] = temp
                flag = true
            }
        }
        if(!flag) break
        i++
    }
}

function bubbleSort2(arr){
    let len = arr.length
    let i = 0
    let j = len
    let flag = false
    while(i < len){
        j = 0
        flag = false
        while(j < len - i){
            if(arr[j] < arr[j-1]){
                let temp = arr[j]
                arr[j] = arr[j-1]
                arr[j-1] = temp
                flag = true
            }
            j++
        }
        if(!flag) break
        i++
    }
}

let arr = [1,2,3,1,8,6,9,4,3]
let arr1 = [1,2,3,1,8,6,9,4,3]
let arr2 = [1,2,3,1,8,6,9,4,3]
console.time('bubbleSort')
bubbleSort(arr)
console.timeEnd('bubbleSort')

// 优化冒泡排序
console.time('bubbleSort1')
bubbleSort1(arr1)
console.timeEnd('bubbleSort1')

// 优化冒泡排序
console.time('bubbleSort2')
bubbleSort2(arr2)
console.timeEnd('bubbleSort2')
console.log('bubbleSort', arr)
console.log('bubbleSort1', arr1)
console.log('bubbleSort2', arr2)