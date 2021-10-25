## 场景
拿到一个url，例如"https://www.baidu.com?a=1"（实际业务场景拿到的未必是http协议），修改query中的某个参数值。所以我们的思路就是解析url，更换query中的参数值，然后再拼接成完整的url返回。
## 工具
尝试使用Web API 的URL接口，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)上对URL接口的描述如下：

> URL接口用于解析，构造，规范化和编码 URLs。 它通过提供允许您轻松阅读和修改URL组件的属性来工作。 通常，通过在调用URL的构造函数时将URL指定为字符串或提供相对URL和基本URL来创建新的URL对象。 然后，您可以轻松读取URL的已解析组成部分或对URL进行更改。

具体来说可以通过如下方法将一个url解析成一个对象，通过这个对象上的一些API，我们可以修改url的各个部分。

> new URL()
创建并返回一个URL对象，该URL对象引用使用绝对URL字符串，相对URL字符串和基本URL字符串指定的URL。

URL对象上有很多属性，例如hash、host、hostname等，其中searchParams 属性返回一个 [URLSearchParams 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)，这个对象包含当前 URL 中解码后的 GET 查询参数。这个`URLSearchParams接口`定义了一些实用的方法来处理 URL 的查询字符串。
## 实验
问题就出现在用URLSearchParams接口处理query上。我们知道：为了防止query里含有非法字符（例如空格、&、中文等），需要对参数进行编码，最常用的方法就是`encodeURIComponent`。

```js
console.log(encodeURIComponent('xi an')); // xi%20an
```

```js
let testUrl = new URL('https://www.baidu.com?a=xian');
testUrl.searchParams.set('a', 'xi an');
console.log(testUrl.href); // https://www.baidu.com/?a=xi+an
```

对比我们就能发现，encodeURIComponent将『xi an』中间的空格编码为了`%20`，而searchParams将空格编码为了`+`。

## 解析
如果编码出问题，解析参数的环节肯定会出问题，那么谁是对的呢？答案是：两个都是对的。出现这个问题的原因是encodeURIComponent（ URI 规范）和searchParams（ W3C 规范）是按照不同的标准实现的。根据[URI规范](https://tools.ietf.org/html/rfc3986)，空格应该被编码为`%20`，而根据[application/x-www-form-urlencoded ](https://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1)，空格被编码为了`+`。

这里提到的`application/x-www-form-urlencoded`又是个什么东西呢？早期没有AJAX的时候，大家都是通过form表单提交数据，而form表单遵循的正是这一编码规则。除了空格意外，以下的字符编码也和encodeURIComponent不同：

```js
replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+', // 加号就是从这儿来的
    '%00': '\x00'
}
```
在我遇到的业务场景下，是需要遵循encodeURIComponent的规则的，所以找到了[url-parse](https://www.npmjs.com/package/url-parse)库，来解决这个问题，这个库修改query时是按照encodeURIComponent的规则进行编码的，并且在处理非http协议的链接时候，能正确解析（URL接口似乎在解析host上会有问题）。

## 参考文献
- [HTTP 规范中的那些暗坑](https://zhuanlan.zhihu.com/p/144182427)

