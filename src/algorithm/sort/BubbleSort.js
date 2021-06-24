/**
 * 冒泡排序
 * @param {*} arr 待排序的数组
 * @param {*} order 默认为 'desc' 降序排列
 */
function bubbleSort(arr = [], order = 'desc') {
    // 外层循环控制最多需要排序多少轮
    for (let i = 0, leni = arr.length - 1; i < leni; i++) {
        // 假设某轮冒泡结束已经有序，可以提前结束
        let isSort = true;	
        // 注意lenj为什么是 arr.length - 1 - i
        for (let j = 0, lenj = arr.length - 1 - i; j < lenj; j++) {
            const flag = order === 'desc' ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1];
            if (flag) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                // 发生交换证明仍然可能有需要排序的
                isSort = false;
            }
        }
        // 已经有序就中断排序
        if(isSort){	
            break;	
        }
    }
}

let a = [4, 7, 9, 1, 8, 10, 6];
bubbleSort(a);
console.log(a);