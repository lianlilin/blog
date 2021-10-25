## 背景
负责的平台中新增了个表单，允许输入的值是JSON字符串，提交之前要校验一下合法性，没经过什么思考，有了以下代码：
```js
// jsonStr

try {
    JSON.parse(jsonStr);
}
catch(err) {
    // 非法的JSON
}
```
很朴素的思路：
- 是非法的JSON串调用`JSON.parse`会抛出异常
- 反之不抛出异常则能证明是合法的JSON。

## 发现问题
写完后自测发现了问题：
- 测试case1：
```js
JSON.parse('{"p": 5}'）; // {p: 5}，符合预期
```
- 测试case2：
```js
JSON.parse('1'）; // 1，不符合预期，预期会抛出异常
```
随手敲了个数字，想看看是非法JSON的情况下表单是否会正确提示，万万没想到，居然能被正确的解析！

## 分析问题
显然是自己对『合法JSON』的认知出现了偏差，以为能被JSON.parse解析的一定是形如`'{"p": 5}'`这样的字符串，但是显然`'1'`这样的字符串也能被正确解析，而且返回值是`number`类型，不是`Object`类型。

查阅MDN上JSON语法的定义，其中关于JSON语法定义中提到：
```js
JSON = null
    or true or false
    or JSONNumber
    or JSONString
    or JSONObject
    or JSONArray
```
可以看到JSON语法中不仅仅包含『JSONObject』，也包含其它类型。或者说：

- JSON 是一种语法，用来序列化对象、数组、数值、字符串、布尔值和 null
- 它基于 JavaScript语法，但与之不同
- JavaScript不是JSON，JSON也不是JavaScript。

##  反思问题
虽然说JSON.parse不能用于保证数据类型是JSONObject（即经过parse后一定返回Object），但是对于表单验证场景，结合表单填写说明，还是可以有效的避免缺少大括号、多逗号等最常出现的问题，所以除非必要也不用搞得那么复杂。
## 参考文献

- [JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON.stringify()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)