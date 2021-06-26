/**
 * 插入排序
 * @param {*} arr 待排序的数组
 * @param {*} order 默认为 'desc' 降序排列
 */

function insertionSort(arr = [], order = 'desc') {
    for (let i = 1, leni = arr.length; i < leni; i++) {
        const cur = arr[i];
        let j = i - 1;
        for (; j >= 0; j--) {
            const flag = order === 'desc' ? arr[j] < cur : arr[j] > cur;
            if (flag) {
                arr[j + 1] = arr[j];
            } else {
                break;
            }
        }
        arr[j + 1] = cur;
    }
}

let a = [4, 7, 9, 1, 8, 10, 6];
insertionSort(a, 'aes');
console.log(a);