/**
 * 选择排序
 *
 * @param {*} arr 待排序的数组
 * @param {*} order 默认为 'desc' 降序排列
 */

function selectionSort(arr = [], order = 'desc') {
    for (let i = 0, len = arr.length - 1; i < len; i++) {
        let cur = i;
        for (let j = i + 1; j < arr.length; j++) {
            const flag = order === 'desc' ? arr[j] > arr[cur] : arr[j] < arr[cur]
            if (flag) {
                cur = j;
            }
        }
        const temp = arr[i];
        arr[i] = arr[cur];
        arr[cur] = temp;
    }
}

let a = [4, 7, 9, 1, 8, 10, 6];
selectionSort(a, 'asc');
console.log(a);