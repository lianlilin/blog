// 将数字（正整数）逆序并转换为字符串格式后返回,
// 如传入1234 返回 '4321' 要求 使用递归实现，不能创建变量

const reverseNum = (num) => {
    // 递归结束条件
    if (num >= 0 && num < 10) {
        return num.toString();
    }
    return num % 10 + reverseNum(parseInt(num / 10))
}

// test case

console.log(reverseNum(123456), typeof reverseNum(123456)); // 654321
console.log(reverseNum(8), typeof reverseNum(8)); // 8
console.log(reverseNum(90), typeof reverseNum(90)); // 09