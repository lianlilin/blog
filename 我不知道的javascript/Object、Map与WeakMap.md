# Object、Map与WeakMap


## 键名的限制

### 传统对象
传统对象只能用字符串、数字、符号作为键名，即使强行将其它数据类型做为键，内部也会通过`toString`方法转换成字符串。

```js
let a = {};
let b = function() {};
a[b] = 1;
console.log(Object.keys(a)); // ['b', 'function() {}']
```
### Map

Map类似于对象，但是键名可以是任何JS合法的数据类型。

```js
// 1. 通过new Map来创建dataMap容器
const dataMap = new Map();
// 2. 获取节点对象，作为测试数据
const element = document.querySelector(".node");
// 3. 通过 set 方法给 dataMap 中指定键和对应的值
dataMap.set(element,'objectData');
// 4. 通过 get 来从 dataMap 中获取键名对应的值
console.log(dataMap.get(element));
// 5. 揭开面目
console.log(dataMap);
```

### WeakMap

WeakMap只能接受对象作为键名（除了null）。

## 性能的区别

- 内存：Object 和 Map 的工程及实现在不同浏览器间存在很大的差异，如果给固定大小的内存，Map 要比 Object 多存储 50%的键值对。
- 查找速度：大型的 Object 和 Map 中查找键值对的性能差异较小，如果只包含少量的键值对，Object 要比 Map 更块一些，在把 Object 当成数组使用的情况下（比如连续使用整数作为属性）浏览器引擎可以进行优化，这对 Map 操作是不可能的。
- 插入性能：向 Object 和 Map 中插入新的键值对消耗大致差不多，如果代码量涉及的比较多的话，Map 的性能更好一些。
- 删除属性：使用 delete 删除 Object 属性的性能在浏览器中一直饱受诟病，有一些人为了删除对象属性会把属性值设为 null 和 undefined。而 Map 的 delete 操作要比插入和查询都快，如果涉及大量代码的话，Map 肯定是最优选。

## WeakMap键名引用的对象是弱引用

```js
// demo1
const myMap = new Map()
let my = {
    name: "ljc",
    sex: "男"
}
myMap.set(my, 'info');
console.log(myMap);
```

```js
// demo2
const myMap = new WeakMap()
let my = {
    name: "ljc",
    sex: "男"
}
myMap.set(my, 'info');
console.log(myMap);
```

demo1中对于数据的引用计数为2，而demo2中为1，对于demo2，只需要`my = null`，就可以等待垃圾回收机制自动清除了。