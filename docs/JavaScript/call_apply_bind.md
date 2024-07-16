# call、apply、bind 函数

共性：call、apply、bind 都具备有改变 this 指向的能力。他们都是函数的原型方法。

## Function.prototype.call()

### 定义

call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。

### 语法

function.call(thisArg, arg1, arg2, ...)

### 使用 call 方法调用函数并且指定上下文的 'this'

```js
var person = {
  name: "小明",
};

function greet() {
  console.log("hi, I am", this.name);
}

greet.call(person); // hi, I am 小明
```

### 代码实现

```js
// 没有传入 this，默认为 window
Function.prototype.myCall = function (context = window, ...args) {
  // 保证唯一值，避免命名冲突
  const fn = Symbol();

  // 把当前的方法添加到该对象属性上去，这样使用this的时候就能访问当前对象的属性
  context[fn] = this;

  const result = context[fn](...args);

  delete context[fn];

  return result;
};
```

测试用例

```js
var person = {
  name: "小明",
};

function greet(car) {
  console.log("你好，我是", this.name, "我有", car);
}

greet.myCall(person, "宝马"); // 你好，我是小明我有宝马
```

## Function.prototype.apply()

### 定义

apply() 方法调用一个具有给定 this 值的函数，以及以一个数组（或类数组对象）的形式提供的参数。

> 注意：call()方法的作用和 apply() 方法类似，区别就是 call()方法接受的是参数列表，而 apply()方法接受的是一个参数数组。

### 语法

func.apply(thisArg, [argsArray])

### 代码实现

类似的，有 apply 的类似的对应实现:

```js
Function.prototype.myApply = function (context = window, args) {
  // 保证唯一值，避免命名冲突
  const fn = Symbol();

  // 把当前的方法添加到该对象属性上去，这样使用this的时候就能访问当前对象的属性
  context[fn] = this;

  let result;
  if (!Array.isArray(args)) {
    result = context[fn]();
  } else {
    result = context[fn](...args);
  }

  delete context[fn];

  return result;
};
```

测试用例

```js
var person = {
  name: "小明",
};

function greet(car, car2) {
  console.log("你好，我是", this.name, "我有", car, car2);
}

greet.myApply(person, ["宝马", "奥迪"]); // 你好，我是小明我有宝马奥迪
```

## Function.prototype.bind()

### 定义

Function 实例的 bind() 方法创建一个新函数，当调用该新函数时，它会调用原始函数并将其 this 关键字设置为给定的值，同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。

### 语法

fn.bind(thisArg)
fn.bind(thisArg, arg1)
fn.bind(thisArg, arg1, arg2)
fn.bind(thisArg, arg1, arg2, /_ …, _/ argN)

### 使用示例

```js
var person = {
  name: "小明",
};
function foo(age) {
  console.log(this.name, age);
}
// 返回一个函数
let bindBar = foo.bind(person);

bindBar(18); // 小明 18
```

### 代码实现

bind 不仅能给函数调用，也能给构造函数调用。
如果是构造函数 Fn 调用 bind 方法，则返回 new Fn。如果不是构造函数则使用 apply 来处理 context 调用函数.

```js
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("");
  }

  const self = this;

  return function F(...args2) {
    if (this instanceof F) {
      return new self(...args, ...args2);
    }
    return self.apply(context, args.concat(args2));
  };
};
```

使用 bind 生成的函数作为构造函数时，bind 时的指定 this 会失效，但传入的参数依然生效

```js
// 测试构造函数时使用
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log("my name is " + this.name);
};
let obj = {};
let MyPerson = Person.myBind(obj);

let xiaoming = new MyPerson("小明", 18);
xiaoming.sayName(); // my name is 小明
```

正常函数调用

```js
let person = {
  name: "小明",
};
function foo(age) {
  console.log(this.name, age);
}
// 返回一个函数
let bindBar = foo.myBind(person);

bindBar(18); // 小明 18
```

## 参考

[js 实现 call 和 apply 方法，超详细思路分析](https://www.cnblogs.com/echolun/p/12144344.html)

[call、apply、bind 三大将](https://fe.azhubaby.com/JavaScript/call%E3%80%81apply%E3%80%81bind%E4%B8%89%E5%A4%A7%E5%B0%86.html)
