# JavaScript 的数据类型

## 基本数据类型

### 7 个原始数据类型：

- number
- bigint
- string
- boolean
- undefind
- null
- symbol

### Number 和 BigInt

Number 数字类型采用 64 位浮点格式表示，我们可以利用 Number 对象的属性 Number.MAX_VALUE , Number.MIN_VALUE来查看

```js
Number.MAX_VALUE  // 9007199254740991(2^53-1)
Number.MIN_VALUE  // -9007199254740991 (-(2^53-1))
```
确切地说，JS 中的Number类型只能安全地表示-9007199254740991 (-(2^53-1)) 和9007199254740991(2^53-1)之间的整数，任何超出此范围的整数值都可能失去精度。

- 为什么只有 53 位？

sign(S): 符号位占 1 位。0 表示正数，1表示负数

exponent(E): 指数位占 11 位。

fraction（F）：有效数字，IEEE754规定，在计算机内部保存有效数字时，默认第一位总是1，所以舍去，只保留后面的部分。比如保存1.01，只存01，等读取的时候再把第一位1加上去。所以52位有效数字实际可以存储53位。

- 使用 BitInt

为了解决 Number 的数值范围的限制，引入 BitInt 类型来表示大整数。 要创建BigInt，只需在整数的末尾追加n即可。
```js
9007199254740995n // 可以安全表示，9007199254740995n
9007199254740995 // 无法安全表示，值会变成 9007199254740996
```

BigInt 不能用严格相等运算与常规数字进行比较，因为它们类型不同

```js
11n === 11 // false
```

如果希望使用BigInt和Number执行算术计算，首先需要确定应该在哪个类型中执行该操作。为此，只需通过调用Number()或BigInt()来转换操作数：
```js
BigInt(10) + 10n;    // → 20n
// or
10 + Number(10n);    // → 20
```
## 复杂数据类型

### Object

1 个复杂数据类型：

- Object 对象
- 万物皆可对象（包含普通对象、Array 对象, RegExp 对象，Function 对象，Map 对象、Math 对象、Set 对象、Date 对象等其他JS内置对象）


特例：

null 不是对象

> 解释: 虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象,然而 null 表示为全零，所以将它错误的判断为 object



### Map

Map的key相比较普通对象来说更为灵活，普通对象的key只能以基础数据类型作为key值，并且所有传入的key值都会被转化成string类型，而Map的key可以是各种数据类型格式。

### Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

### WeakMap

WeakMap 和 WeakSet 都只接受对象作为键名（null 除外），不接受其他类型的值作为键名，

其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。

WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。

WeakMap 就是为了解决对象引用忘记释放的问题，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。

### WeakMap 与 Map 在 API 上的区别

WeakMap 与 Map 在 API 上的区别主要是两个，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持clear方法。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。


## 数据类型判断

判断数据类型的四个方法：

1. typeof 
2. instanceof 
3. constructor
4. Object.prototype.toString


### typeof

typeof 一般用来判断基本数据类型

```js
typeof 1  // number
typeof false // boolean
typeof undefined // undefined
typeof null // object, null 不是对象，是历史遗留的问题
typeof 'abc' // string
typeof Symbol()  // symbol
typeof 42n // bigint

typeof {} // object
typeof [] // object
typeof function () {} // function
typeof NaN // number

```
### instanceof 
由于 typeof 无法解决对对象数据类型的判断，所以需要利用 instanceof。

instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上，只要处于原型链中，判断结果就为 true。

```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

let str1 = 'hello world'
str1 instanceof String // false, 注意值变量用 instanceof 是无法判断的

let str2 = new String('hello world')
str2 instanceof String // true

let number1 = Number(1)
number1 instanceof Number // false

let number2 = new Number(1)
number2 instanceof Number // true
```

### constructor 属性


constructor 指向的是原型对象的构造器的【引用】

1. null、undefined 没有 construstor方法，因此 constructor 不能判断 undefined 和 null。
2. 同时 constructor 属性是不安全的，因为 constructor 的指向可以被改变

```js
Number(1).constructor === Number // true
String(1).constructor === String // true
Boolean(true).constructor === Boolean // true

const array = new Array()
array.constructor === Array // true

const obj = {}
obj.constructor === Object // true

const date = new Date()
date.constructor === Date
```

原型继承，修复 constructor 指向
```js
class Animal {}

let animal = new Animal()

console.log(animal.constructor) // [class Animal]

class Tiger extends Animal {}

let tiger = new Tiger() 

console.log(tiger.constructor) // [class Tiger extends Animal]


function Fruit() {
    this.name = '水果'
}

Fruit.prototype.sayName = function() {
    console.log('我的名字是：'+this.name)
}

function Apple() {
    this.name = '苹果'
}

// Apple 的原型指向改变，导致 constructor 指向改变
Apple.prototype = new Fruit()

let fruit = new Fruit()
let apple = new Apple()

console.log(fruit.constructor) // [Function: Fruit]
console.log(apple.constructor) // [Function: Fruit]

// 修复 contructor 指向
Apple.prototype.constructor = Apple

console.log(apple.constructor) // [Function: Apple]

apple.sayName() // 我的名字是：苹果
```

### Object.prototype.toString

使用 toString() 检测对象类型, 可以通过 toString() 来获取每个对象的类型。为了每个对象都能通过 Object.prototype.toString() 来检测，需要以 Function.prototype.call() 或者 Function.prototype.apply() 的形式来调用，传递要检查的对象作为第一个参数，称为 thisArg。

```js
const toString = Object.prototype.toString;

toString.call(new Number) // [object Number]
toString.call(new String); // [object String]
toString.call(new Boolean) // [object Boolean]
//Since JavaScript 1.8.5
toString.call(BigInt(11n)) // [object BigInt]
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]
toString.call(Symbol()) // [object Symbol]

toString.call(new Date); // [object Date]
toString.call(Math); // [object Math]
toString.call(()=>{}) // [object Function]
toString.call(new Array) // [object Array]

toString.call(NaN) // [object Number]
```


## 参考文章

[JS最新基本数据类型:BigInt](https://segmentfault.com/a/1190000019912017?utm_source=tag-newest)

[JavaScript 里最大的安全的整数为什么是2的53次方减一？](https://www.zhihu.com/question/29010688)