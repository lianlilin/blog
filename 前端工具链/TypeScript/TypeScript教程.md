# 简介

TypeScript（简称 TS）是微软公司开发的一种基于 JavaScript （简称 JS）语言的编程语言。

JavaScript 的类型系统非常弱，而且没有使用限制，运算符可以接受各种类型的值。在语法上，JavaScript 属于动态类型语言。

TypeScript 引入了一个更强大、更严格的类型系统，属于静态类型语言。

## 静态类型的优点

- 有利于代码的静态分析
  - 例如类型错误
- 有利于发现错误
  - 例如拼写错误
- 更好的IDE支持，做到语法提示和自动补全
- 代码文档
- 有助于代码重构

# 基本用法

## 类型声明

类型声明的写法，一律为在标识符后面添加“冒号 + 类型”。

```ts
let name: string; // 声明一个字符串类型的变量

// 函数参数和返回值
function toString(num:number):string {
  return String(num);
}

// TypeScript 规定，变量只有赋值后才能使用，否则就会报错。
let x:number;
console.log(x) // 报错
```

## 类型推断

- TypeScript 的设计思想是，类型声明是可选的
- 没有类型声明，TypeScript 就会推断它的类型

## 编译
- TypeScript 官方没有做运行环境，只提供编译器
- 编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果
- TypeScript 的类型检查只是编译时的类型检查，而不是运行时的类型检查
- TypeScript 官方提供的编译器叫做 tsc，可以将 TypeScript 脚本编译成 JavaScript 脚本
  - tsc可以指定输出文件、输出目录、js版本、有编译产物时是否继续变异等

## 直接运行ts代码

`ts-node` 是一个非官方的 npm 模块，可以直接运行 TypeScript 代码。

# 三种特殊类型

## any 类型

从集合论的角度看，any类型可以看成是所有其他类型的全集，包含了一切可能的类型。TypeScript 将这种类型称为“顶层类型”（top type），意为涵盖了所有下层。

- 类型推断问题
  - 对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是any。
  - TypeScript 提供了一个编译选项noImplicitAny，打开该选项，只要推断出any类型就会报错。
  - 使用let和var命令声明变量，但不赋值也不指定类型，是不会报错的。
    - 建议使用let和var声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患。
  - JavaScript 语言规定const声明变量时，必须同时进行初始化（赋值）。
- 污染问题
  - 污染其他具有正确类型的变量，把错误留到运行时

## unknow 类型

- 为了解决any类型“污染”其他变量的问题，TypeScript 3.0 引入了unknown类型。
- unknown类型的变量，不能直接赋值给其他类型的变量（除了any类型和unknown类型）。
- 不能直接调用unknown类型变量的方法和属性。
- unknown可以看作是更安全的any。一般来说，凡是需要设为any类型的地方，通常都应该优先考虑设为unknown类型。

## never 类型

- never类型的使用场景，主要是在一些类型运算之中，保证类型运算的完整性
```ts
  function fn(x:string|number) {
  if (typeof x === 'string') {
    // ...
  } else if (typeof x === 'number') {
    // ...
  } else {
    x; // never 类型
  }
}
```


- 不可能返回值的函数，返回值的类型就可以写成never

# 类型系统

TypeScript 继承了 JavaScript 的类型，在这个基础上，定义了一套自己的类型系统。

## 基本类型
JavaScript 语言（注意，不是 TypeScript）将值分成8种类型。TypeScript 继承了 JavaScript 的类型设计，以下8种类型可以看作 TypeScript 的基本类型。
- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

## 包装对象类型

由于包装对象的存在，导致每一个原始类型的值都有包装对象和字面量两种情况。为了区分这两种情况，TypeScript 对五种原始类型分别提供了大写和小写两种类型。

- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象。

```ts
const s1:String = 'hello'; // 正确
const s2:String = new String('hello'); // 正确

const s3:string = 'hello'; // 正确
const s4:string = new String('hello'); // 报错
```
## object 与 Object 类型

- 小写的object类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含对象、数组和函数，不包括原始类型的值。

- 大写的Object类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是Object类型，这囊括了几乎所有的值。

## undefined与null类型

- undefined和null既是值，又是类型。
- 作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为undefined或null。
- TypeScript 提供了一个编译选项strictNullChecks。只要打开这个选项，undefined和null就不能赋值给其他类型的变量（除了any类型和unknown类型）。

## 值类型

只包含单个值的值类型，用处不大。实际开发中，往往将多个值结合，作为联合类型使用。

## 联合类型

联合类型A|B表示，任何一个类型只要属于A或B，就属于联合类型A|B。

“类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。

## 交叉类型

交叉类型（intersection types）指的多个类型组成的一个新类型，使用符号&表示。

交叉类型的主要用途是表示对象的合成。

## type命令

type命令用来定义一个类型的别名。

别名可以让类型的名字变得更有意义，也能增加代码的可读性，还可以使复杂类型用起来更方便，便于以后修改变量的类型。

## typeof运算符

JavaScript 语言中，typeof 运算符是一个一元运算符，返回一个字符串，代表操作数的类型。

TypeScript 将typeof运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 TypeScript 类型。

## 类型兼容

TypeScript 的类型存在兼容关系，某些类型可以兼容其他类型。

TypeScript 的一个规则是，凡是可以使用父类型的地方，都可以使用子类型，但是反过来不行。

# TypeScript 的数组类型

TypeScript 数组有一个根本特征：所有成员的类型必须相同，但是成员数量是不确定的，可以是无限数量的成员，也可以是零成员。

第一种写法是在数组成员的类型后面，加上一对方括号。

```ts
let arr:(number|string)[];
```
数组类型的第二种写法是使用 TypeScript 内置的 Array 接口。

```ts
let arr:Array<number> = [1, 2, 3];
```

TypeScript 允许使用方括号读取数组成员的类型。

```ts
type Names = string[];
type Name = Names[0]; // string

type Name = Names[number]; // string
```

## 数组类型推断

如果变量的初始值是空数组，那么 TypeScript 会推断数组类型是any[]。

随着新成员的加入，TypeScript 会自动修改推断的数组类型。

## 只读数组

TypeScript 允许声明只读数组，方法是在数组类型前面加上readonly关键字。

```ts
const arr:readonly number[] = [0, 1];

arr[1] = 2; // 报错
arr.push(3); // 报错
delete arr[0]; // 报错
```

readonly关键字不能与数组的泛型写法一起使用。

TypeScript 提供了两个专门的泛型，用来生成只读数组的类型。只读数组还有一种声明方法，就是使用“const 断言”。

```ts
const a1:ReadonlyArray<number> = [0, 1];

const a2:Readonly<number[]> = [0, 1];

const arr = [0, 1] as const;

arr[0] = [2]; // 报错 
```

## 多维数组

TypeScript 使用T[][]的形式，表示二维数组，T是最底层数组成员的类型。

# 元组

元组（tuple）是 TypeScript 特有的数据类型，它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。

由于成员的类型可以不一样，所以元组必须明确声明每个成员的类型。

```ts
const s:[string, string, boolean]
  = ['a', 'b', true];
```

元组类型的写法，与上一章的数组有一个重大差异。数组的成员类型写在方括号外面（number[]），元组的成员类型是写在方括号里面（[number]）。TypeScript 的区分方法就是，成员类型写在方括号里面的就是元组，写在外面的就是数组。

使用扩展运算符（...），可以表示不限成员数量的元组。

```ts
type t1 = [string, number, ...boolean[]];
type t2 = [string, ...boolean[], number];
type t3 = [...boolean[], string, number];

// 如果不确定元组成员的类型和数量，可以写成下面这样。
type Tuple = [...any[]];
```

## 只读元祖
```ts
// 写法一
type t = readonly [number, string]

// 写法二
type t = Readonly<[number, string]>
```

## 成员数量推断

如果没有可选成员和扩展运算符，TypeScript 会推断出元组的成员数量（即元组长度）。

## 扩展运算符与成员数量

扩展运算符（...）将数组（注意，不是元组）转换成一个逗号分隔的序列，这时 TypeScript 会认为这个序列的成员数量是不确定的，因为数组的成员数量是不确定的。

这导致如果函数调用时，使用扩展运算符传入函数参数，可能发生参数数量与数组长度不匹配的报错。

```ts
const arr = [1, 2];

function add(x:number, y:number){
  // ...
}

add(...arr) // 报错

// 就是把成员数量不确定的数组，写成成员数量确定的元组，再使用扩展运算符。
const arr:[number, number] = [1, 2];

function add(x:number, y:number){
  // ...
}

add(...arr) // 正确

// 另一种写法是使用as const断言。
const arr = [1, 2] as const;
```



