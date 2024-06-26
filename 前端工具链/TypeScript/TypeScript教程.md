# 简介

TypeScript（简称 TS）是微软公司开发的一种基于 JavaScript （简称 JS）语言的编程语言。

JavaScript 的类型系统非常弱，而且没有使用限制，运算符可以接受各种类型的值。在语法上，JavaScript 属于动态类型语言。

TypeScript 引入了一个更强大、更严格的类型系统，属于静态类型语言。

TypeScript 的作用，就是为 JavaScript 引入这种静态类型特征。

## 静态类型的优点

- 有利于代码的静态分析
  - 例如类型错误
- 有利于发现错误
  - 例如拼写错误
- 更好的IDE支持，做到语法提示和自动补全
- 代码文档
- 有助于代码重构

## 静态类型的缺点
- 丧失动态类型的灵活性
- 增加工作量
- 更高的学习成本
- 需要编译才能运行
- 已有的js代码兼容问题

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
- TypeScript 允许将tsc的编译参数，写在配置文件tsconfig.json

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
- 在集合论上，unknown也可以视为所有其他类型（除了any）的全集，所以它和any一样，也属于 TypeScript 的顶层类型。

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
- 除了undefined和null这两个值不能转为对象，其他任何值都可以赋值给Object类型。
- 空对象{}是Object类型的简写形式
- 无论是大写的Object类型，还是小写的object类型，都只包含 JavaScript 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中

## undefined与null类型

- undefined和null既是值，又是类型。
- 作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为undefined或null。
- TypeScript 提供了一个编译选项strictNullChecks。只要打开这个选项，undefined和null就不能赋值给其他类型的变量（除了any类型和unknown类型）。

## 值类型

只包含单个值的值类型，用处不大。实际开发中，往往将多个值结合，作为联合类型使用。

## 联合类型

- 联合类型A|B表示，任何一个类型只要属于A或B，就属于联合类型A|B。
- “类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。

## 交叉类型

- 交叉类型（intersection types）指的多个类型组成的一个新类型，使用符号&表示。
- 交叉类型的主要用途是表示对象的合成。
```js
type A = { foo: number };

type B = A & { bar: number };
```

## type命令

type命令用来定义一个类型的别名。

- 别名可以让类型的名字变得更有意义，也能增加代码的可读性，还可以使复杂类型用起来更方便，便于以后修改变量的类型。
- 别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名允许嵌套。

```js
type World = "world";
type Greeting = `hello ${World}`;
```

## typeof运算符

- JavaScript 语言中，typeof 运算符是一个一元运算符，返回一个字符串，代表操作数的类型。

- TypeScript 将typeof运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 TypeScript 类型。

```ts
let a = 1;
let b:typeof a;

if (typeof a === 'number') {
  b = a;
}
```
- TS里的typeof 的参数只能是标识符
  - 不能是需要运算的表达式。
  - typeof命令的参数不能是类型。

## 类型兼容

- TypeScript 的类型存在兼容关系，某些类型可以兼容其他类型。

- TypeScript 的一个规则是，凡是可以使用父类型的地方，都可以使用子类型，但是反过来不行。

# TypeScript 的数组类型

TypeScript 数组有一个根本特征：所有成员的类型必须相同，但是成员数量是不确定的，可以是无限数量的成员，也可以是零成员。

- 第一种写法是在数组成员的类型后面，加上一对方括号。

```ts
let arr:(number|string)[];
```
- 数组类型的第二种写法是使用 TypeScript 内置的 Array 接口。

```ts
let arr:Array<number> = [1, 2, 3];
```

- TypeScript 允许使用方括号读取数组成员的类型。

```ts
type Names = string[];
type Name = Names[0]; // string

type Name = Names[number]; // string
```

## 数组类型推断

- 如果变量的初始值是空数组，那么 TypeScript 会推断数组类型是any[]。

- 随着新成员的加入，TypeScript 会自动修改推断的数组类型。

## 只读数组

- TypeScript 允许声明只读数组，方法是在数组类型前面加上readonly关键字。

```ts
const arr:readonly number[] = [0, 1];

arr[1] = 2; // 报错
arr.push(3); // 报错
delete arr[0]; // 报错
```

- readonly关键字不能与数组的泛型写法一起使用。

- TypeScript 提供了两个专门的泛型，用来生成只读数组的类型。只读数组还有一种声明方法，就是使用“const 断言”。

```ts
const a1:ReadonlyArray<number> = [0, 1];

const a2:Readonly<number[]> = [0, 1];

const arr = [0, 1] as const;

arr[0] = [2]; // 报错 
```

## 多维数组

- TypeScript 使用T[][]的形式，表示二维数组，T是最底层数组成员的类型。

```js
var multi:number[][] = [[1,2,3], [23,24,25]];
```

# 元组

- 元组（tuple）是 TypeScript 特有的数据类型，它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。

- 由于成员的类型可以不一样，所以元组必须明确声明每个成员的类型。

```ts
const s:[string, string, boolean]
  = ['a', 'b', true];
```

- 元组类型的写法，与上一章的数组有一个重大差异。
  - 数组的成员类型写在方括号外面（number[]）
  - 元组的成员类型是写在方括号里面（[number]）

使用扩展运算符（...），可以表示不限成员数量的元组。

```ts
type t1 = [string, number, ...boolean[]];
type t2 = [string, ...boolean[], number];
type t3 = [...boolean[], string, number];

// 如果不确定元组成员的类型和数量，可以写成下面这样。
type Tuple = [...any[]];
```

- 元组的成员可以添加成员名，这个成员名是说明性的，可以任意取名，没有实际作用。

```ts
type Color = [
  red: number,
  green: number,
  blue: number
];

const c:Color = [255, 255, 255];
```

## 只读元祖
```ts
// 写法一
type t = readonly [number, string]

// 写法二
type t = Readonly<[number, string]>
```

## 成员数量推断

- 如果没有可选成员和扩展运算符，TypeScript 会推断出元组的成员数量（即元组长度）。

## 扩展运算符与成员数量

- 扩展运算符（...）将数组（注意，不是元组）转换成一个逗号分隔的序列，这时 TypeScript 会认为这个序列的成员数量是不确定的，因为数组的成员数量是不确定的。

- 这导致如果函数调用时，使用扩展运算符传入函数参数，可能发生参数数量与数组长度不匹配的报错。

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

# symbol类型

- symbol类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。

- 为了解决这个问题，TypeScript 设计了symbol的一个子类型unique symbol，它表示单个的、某个具体的 Symbol 值。

```ts
// 正确
const x:unique symbol = Symbol();

// 报错
let y:unique symbol = Symbol();
```

# 函数类型

## 简介

- 函数的类型声明，需要在声明函数时，给出参数的类型和返回值的类型。

```ts
function hello(
  txt:string
):void {
  console.log('hello ' + txt);
}
```

- 如果变量被赋值为函数

```ts
// 写法一，通过函数类型推断hello类型
const hello = function (txt:string) {
  console.log('hello ' + txt);
}

// 写法二，用箭头函数的形式指定hello的类型
// 类型里的参数名是必须的，并且需要括号，但是参数名可以不一致
const hello: (txt:string) => void = function (txt) {
  console.log('hello ' + txt);
};
```

- 如果函数类型的定义很冗长，或者多个函数使用同一种类型，可以用`type`为函数类型指定一个别名

- 函数的实际参数个数，可以少于类型指定的参数个数，但是不能多于，即 TypeScript 允许省略参数。
```ts
let myFunc: (a:number, b:number) => number;

myFunc = (a:number) => a; // 正确

myFunc = (a:number, b:number, c:number) => a + b + c; // 报错
```

- 函数类型还可以采用对象的写法
  - 常规的代码规范里并不推荐这种写法。
  - 非常合适用在一个场合：函数本身存在属性。

```ts
let add:{
  (x:number, y:number):number
};
 
add = function (x, y) {
  return x + y;
};
// 函数本身存在属性，适用于对象格式的写法
function f(x:number) {
  console.log(x);
}
f.version = '1.0';

let foo: {
  (x:number): void;
  version: string
} = f;
```

## Function类型

- TypeScript 提供 Function 类型表示函数，任何函数都属于这个类型。

```ts
function doSomething(f:Function) {
  return f(1, 2, 3);
}
```
- Function 类型的函数可以接受任意数量的参数，每个参数的类型都是any，返回值的类型也是any，代表没有任何约束
  - 不建议使用，给出函数详细的类型声明会更好一些

## 箭头函数

```ts
const repeat = (
  str:string,
  times:number
):string => str.repeat(times);
```

- 类型写在箭头函数的定义里面，与使用箭头函数表示函数类型，写法有所不同

```ts
function greet(
  fn:(a:string) => void
):void {
  fn('world');
}


// map()方法的参数是一个箭头函数(name):Person => ({name})，该箭头函数的参数name的类型省略了，因为可以从map()的类型定义推断出来，
// 箭头函数的返回值类型为Person。相应地，变量people的类型是Person[]。
type Person = { name: string };

const people = ['alice', 'bob', 'jan'].map(
  (name):Person => ({name})
);
```



## 可选参数

- 如果函数的某个参数可以省略，则在参数名后面加问号表示。
  - 函数的可选参数只能在参数列表的尾部，跟在必选参数的后面。

- 如果前置的参数有可能是undefined，需要显示的指定类型可能为undefined。

```ts
let myFunc:
  (a:number, b?:number) => number; 

myFunc = function (x, y) {
  if (y === undefined) {
    return x;
  }
  return x + y;
}
```
- 参数名带有问号，表示该参数的类型实际上是`原始类型|undefined`，它有可能为`undefined`
- 类型显式设为`undefined`的参数，就不能省略
  - 前部参数有可能为空，得使用这个方法
```ts
function f(x?:number) {
  return x;
}

f() // 正确
f(undefined) // 正确

function f(x:number|undefined) {
  return x;
}

f() // 报错
```

## 参数默认值

- TypeScript 函数的参数默认值写法，与 JavaScript 一致。
- 可选参数与默认值不能同时使用。

```ts
function add(
  x:number = 0,
  y:number
) {
  return x + y;
}

add(1) // 报错
add(undefined, 1) // 正确
```

## 参数解构

```ts
function f(
  [x, y]: [number, number]
) {
  // ...
}

function sum(
  { a, b, c }: {
     a: number;
     b: number;
     c: number
  }
) {
  console.log(a + b + c);
}
```
## rest参数
- rest 参数表示函数剩余的所有参数，它可以是数组（剩余参数类型相同），也可能是元组（剩余参数类型不同）。
```ts
// rest 参数为数组
function joinNumbers(...nums:number[]) {
  // ...
}

// rest 参数为元组
function f(...args:[boolean, number]) {
  // ...
}
```

有时候感觉rest参数没啥必要？

## readonly 只读参数

- 如果函数内部不能修改某个参数，可以在函数定义时，在参数类型前面加上readonly关键字，表示这是只读参数。
- readonly关键字目前只允许用在数组和元组类型的参数前面，如果用在其他类型的参数前面，就会报错。

```ts
function arraySum(
  arr:readonly number[]
) {
  // ...
  arr[0] = 0; // 报错
}
```

## void类型

- void 类型表示函数没有返回值。
  - 函数的运行结果如果是抛出错误，也允许将返回值写成void。
  
```ts
function f():void {
  return 123; // 报错
}
```
- void 类型允许返回undefined或null。
  - 打开了strictNullChecks编译选项，那么 void 类型只允许返回undefined
```ts
function f():void {
  return undefined; // 正确
}

function f():void {
  return null; // 正确
}
```

- 如果变量、对象方法、函数参数是一个返回值为 void 类型的函数，该变量、对象方法和函数参数可以接受返回任意值的函数，这时并不会报错。
  - 函数字面量如果声明了返回值是 void 类型，还是不能有返回值。

```ts
type voidFunc = () => void;

const f:voidFunc = () => {
  return 123;
};

// 现实意义在于有时候函数返回值被忽略
const src = [1, 2, 3];
const ret = [];

src.forEach(el => ret.push(el));

// 但是返回值用到了，那么就报错了
type voidFunc = () => void;
 
const f:voidFunc = () => {
  return 123;
};

f() * 2 // 报错
```


## never类型
- never是 TypeScript 的唯一一个底层类型，所有其他类型都包括了never
- never类型表示肯定不会出现的值。它用在函数的返回值，就表示某个函数肯定不会返回值，即函数不会正常执行结束。
  - 抛出异常
  - 死循环
- 一个函数如果某些条件下有正常返回值，另一些条件下抛出错误，这时它的返回值类型可以省略never。
```ts
// 抛出异常
function fail(msg:string):never {
  throw new Error(msg);
}
// 死循环
const sing = function():never {
  while (true) {
    console.log('sing');
  }
};

// 显示返回Error对象，返回值不能是never
function fail():Error {
    return new Error("Something failed");
}

// 某些条件下有正常返回值，另一些条件下抛出错误，可以省略
function sometimesThrow():number {
  if (Math.random() > 0.5) {
    return 100;
  }

  throw new Error('Something went wrong');
}

const result = sometimesThrow();
```

## 局部类型
- 函数内部允许声明其他类型，该类型只在函数内部有效，成为局部类型。

## 高阶函数
```ts
(someValue: number) => (multiplier: number) => someValue * multiplier;
```

## 函数重载
- 有些函数可以接受不同类型或不同个数的参数，并且根据参数的不同，会有不同的函数行为。这种根据参数类型不同，执行不同逻辑的行为，称为函数重载（function overload）。
- TypeScript 对于“函数重载”的类型声明方法是，逐一定义每一种情况的类型。

```ts
// 列举了各种情况
function reverse(str:string):string;
function reverse(arr:any[]):any[];
// 函数本身的类型声明必须和前面已有的重载声明兼容
// 这里不能有任何其它代码，否则报错
function reverse(
  stringOrArray:string|any[]
):string|any[] {
  if (typeof stringOrArray === 'string')
    return stringOrArray.split('').reverse().join('');
  else
    return stringOrArray.slice().reverse();
}
```
- TypeScript 是按照顺序进行检查的，一旦发现符合某个类型声明，就不再往下检查了，所以类型最宽的声明应该放在最后面，防止覆盖其他类型声明。
```ts
function f(x:any):number;
function f(x:string): 0|1;
function f(x:any):any {
  // ...
}

const a:0|1 = f('hi'); // 报错，匹配不到第二行
```
- 对象的方法也可以使用重载。
```ts
class StringBuilder {
  #data = '';

  add(num:number): this;
  add(bool:boolean): this;
  add(str:string): this;
  add(value:any): this {
    this.#data += String(value);
    return this;
  }

  toString() {
    return this.#data;
  }
}
```
- 函数重载也可以用来精确描述函数参数与返回值之间的对应关系。
```ts
function createElement(
  tag:'a'
):HTMLAnchorElement;
function createElement(
  tag:'canvas'
):HTMLCanvasElement;
function createElement(
  tag:'table'
):HTMLTableElement;
function createElement(
  tag:string
):HTMLElement {
  // ...
}
```
- 一般使用联合参数，除非参数和返回值之间有较强的对应关系，因为重载是比较复杂的

## 构造函数

- 构造函数的类型写法，就是在参数列表前面加上new命令。
```ts
class Animal {
  numLegs:number = 4;
}

type AnimalConstructor = new () => Animal;

function create(c:AnimalConstructor):Animal {
  return new c();
}
// 类的本质就是构造函数
const a = create(Animal);
```
- 某些函数既是构造函数，又可以当作普通函数使用
```ts
type F = {
  new (s:string): object;
  (n?:number): number;
}
```

# 对象类型

对象类型可以使用方括号读取属性的类型。

```ts
type User = {
  name: string,
  age: number
};
type Name = User['name']; // string
```
## 可选属性
- 读取可选属性之前，必须检查一下是否为undefined
```ts
const obj: {
  x: number;
  y?: number;
} = { x: 1 };

const user:{
  firstName: string;
  lastName?: string;
} = { firstName: 'Foo'};

if (user.lastName !== undefined) {
  console.log(`hello ${user.firstName} ${user.lastName}`)
}

// 写法一
let firstName = (user.firstName === undefined)
  ? 'Foo' : user.firstName;
let lastName = (user.lastName === undefined)
  ? 'Bar' : user.lastName;

// 写法二
// ?? 是非空运算符，null/undefined，对于0、false等返回还是true
let firstName = user.firstName ?? 'Foo';
let lastName = user.lastName ?? 'Bar';
```

## 只读属性
- 属性名前面加上readonly关键字，表示这个属性是只读属性，不能修改。
```ts
interface MyInterface {
  readonly prop: number;
}
```
- 如果希望属性值是只读的，除了声明时加上readonly关键字，还有一种方法，就是在赋值时，在对象后面加上只读断言as const。
```ts
const myUser = {
  name: "Sabrina",
} as const;

myUser.name = "Cynthia"; // 报错
```
- as const属于 TypeScript 的类型推断，如果变量明确地声明了类型，那么 TypeScript 会以声明的类型为准。
```ts
const myUser:{ name: string } = {
  name: "Sabrina",
} as const;

myUser.name = "Cynthia"; // 正确
```

## 属性名的索引类型

```ts
type MyObj = {
  [property: string]: string
};

const obj:MyObj = {
  foo: 'a',
  bar: 'b',
  baz: 'c',
};
```

## 解构赋值

解构赋值的类型写法，跟为对象声明类型是一样的。

```ts
const {id, name, price}:{
  id: string;
  name: string;
  price: number
} = product;
```

注意，目前没法为解构变量指定类型，因为对象解构里面的冒号，JavaScript 指定了其他用途。

```ts
let { x: foo, y: bar }
  : { x: string; y: number } = obj;

// 错误示例
function draw({
  shape: Shape,
  xPos: number = 100,
  yPos: number = 100
}) {
  let myShape = shape; // 报错
  let x = xPos; // 报错
}
```

## 结构类型原则
只要对象 B 满足 对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则（structural typing）。

```ts
type myObj = {
  x: number,
  y: number,
};

function getSum(obj:myObj) {
  let sum = 0;

  for (const n of Object.keys(obj)) {
    const v = obj[n]; // 报错
    sum += Math.abs(v);
  }

  return sum;
}
```

报错的原因是结构类型原则，任意对象只要有x和y属性，就认为对象兼容myObj类型，但是for of遍历时可能取出其他非number属性，所以报错。

## 严格字面量检查

```ts
// 触发严格字面量检查
const point:{
  x:number;
  y:number;
} = {
  x: 1,
  y: 1,
  z: 1 // 报错
};

// 不触发严格字面量检查
const myPoint = {
  x: 1,
  y: 1,
  z: 1
};

const point:{
  x:number;
  y:number;
} = myPoint; // 正确
```

## 最小可选属性原则
如果某个类型的所有属性都是可选的，那么该类型的对象必须至少存在一个可选属性，不能所有可选属性都不存在。这就叫做“最小可选属性规则”。

## 空对象

```ts
const obj = {};
obj.prop = 123; // 报错
```
上面示例中，变量obj的值是一个空对象，然后对obj.prop赋值就会报错。

这种写法其实在 JavaScript 很常见：先声明一个空对象，然后向空对象添加属性。但是，TypeScript 不允许动态添加属性，所以对象不能分步生成，必须生成时一次性声明所有属性。

```ts
const pt0 = {};
const pt1 = { x: 3 };
const pt2 = { y: 4 };

const pt = {
  ...pt0, ...pt1, ...pt2
};
```

# interface

interface 是对象的模板，可以看作是一种类型约定，中文译为“接口”。使用了某个模板的对象，就拥有了指定的类型结构。

基本的用法和type相同。

## 函数重载
```ts
interface A {
  f(): number;
  f(x: boolean): boolean;
  f(x: string, y: string): string;
}

function MyFunc(): number;
function MyFunc(x: boolean): boolean;
function MyFunc(x: string, y: string): string;
function MyFunc(
  x?:boolean|string, y?:string
):number|boolean|string {
  if (x === undefined && y === undefined) return 1;
  if (typeof x === 'boolean' && y === undefined) return true;
  if (typeof x === 'string' && typeof y === 'string') return 'hello';
  throw new Error('wrong parameters');  
}

const a:A = {
  f: MyFunc
}
```

## interface继承
interface 可以继承其他类型，主要有下面几种情况。

```ts
interface Style {
  color: string;
}

interface Shape {
  name: string;
}

// 多重继承时，如果多个父接口存在同名属性，那么这些同名属性不能有类型冲突，否则会报错。
interface Circle extends Style, Shape {
  radius: number;
}
```
## interface继承type

```ts
type Country = {
  name: string;
  capital: string;
}

interface CountryWithPop extends Country {
  population: number;
}
```

## interface继承class

```ts
class A {
  x:string = '';

  y():boolean {
    return true;
  }
}

interface B extends A {
  z: number
}
```

上面示例中，B继承了A，因此B就具有属性x、y()和z。

实现B接口的对象就需要实现这些属性。

## 接口合并
多个同名接口会合并成一个接口。

涉及函数重载的会有点麻烦，后面再说。


## interface与type的异同
- type能够表示非对象类型，而interface只能表示对象类型
- interface可以继承其他类型，type不支持继承
  - 继承的主要作用是添加属性，type定义的对象类型如果想要添加属性，只能使用&运算符，重新定义一个类型。
- 同名interface会自动合并，同名type则会报错。也就是说，TypeScript 不允许使用type多次定义同一个类型。
-  interface不能包含属性映射（mapping），type可以
```ts
interface Point {
  x: number;
  y: number;
}

// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};

// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};
```
- this关键字只能用于interface。

```ts
class Calculator implements Foo {
  result = 0;
  add(num:number) {
    this.result += num;
    return this;
  }
}
```
- type 可以扩展原始数据类型，interface 不行。
  
- 为什么要设计两个这么像的东西

# class

## 属性的类型

```ts
// 打开 strictPropertyInitialization
class Point {
  x: number; // 报错
  y: number; // 报错
}

// 使用非空断言
class Point {
  x!: number;
  y!: number;
}
```

## 只读属性

```ts
class A {
  readonly id = 'foo';
}

const a = new A();
a.id = 'bar'; // 报错
```

在除了构造函数之外的地方修改只读属性都会报错

## 方法的类型

类的方法和普通函数一样

## ……

# 泛型

## 泛型的写法

- 函数
- 接口
- 类
  - 泛型类描述的是类的实例，不包括静态属性和静态方法，因为这两者定义在类的本身。因此，它们不能引用类型参数。

## 泛型注意点

- 少用泛型，能不用就不用
- 类型参数越少越好
- 类型参数需要出现两次
- 泛型可以嵌套

# TypeScript 的 Enum 类型

Enum 结构的特别之处在于，它既是一种类型，也是一个值。绝大多数 TypeScript 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中。

TypeScript 的定位是 JavaScript 语言的类型增强，所以官方建议谨慎使用 Enum 结构，因为它不仅仅是类型，还会为编译后的代码加入一个对象。

# 类型断言


