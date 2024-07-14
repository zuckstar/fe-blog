# new 运算符

## new 运算符

### 定义

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

### 语法

new constructor[([arguments])]

- constructor: 一个指定对象实例的类型的类或函数。

- arguments: 一个用于被 constructor 调用的参数列表。

### 具体描述

new 关键字会进行如下的操作：

1. 创建一个新的空对象
2. 将这个新对象的原型(**proto**)链接到构造函数的原型(prototype)
3. 将 this 的值设置为新创建的对象
4. 执行构造函数代码, 并将其返回的值赋给新创建的对象
5. 如果构造函数没有返回值或返回一个原始值,则返回新创建的对象

### 举个例子说明

当代码 new Foo(...) 执行时，会发生以下事情：

1. 一个继承自 Foo.prototype 的新对象被创建。

2. 使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。

3. 由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤 1 创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

## new 代码实现

```js
function newFactory(ctor, ...args) {
  if (typeof ctor !== "function") {
    throw "ctor must be a function";
  }

  // 1. 创建一个新的空对象
  // 2. 将新对象的 __proto__ 属性指向构造函数的 prototype 属性
  // 代码等同于 let obj = {}; obj.__proto__ = ctor.prototype;
  let obj = Object.create(ctor.prototype);

  // 3.将 this 的值设置为新创建的对象
  // 4.执行构造函数代码, 并将其返回的值赋给新创建的对象
  let result = ctor.apply(obj, args);

  let isObject = typeof result === "objec" && result !== null;

  // 5. 如果构造函数没有返回值或返回一个原始值,则返回新创建的对象
  return isObject ? result : obj;
}
```

测试用例

```js
function User(firstname, lastname) {
  this.firstname = firstname;
  this.lastname = lastname;
}
const user1 = newFactory(User, "johnny", "joestar");

user1.firstname;
user1.lastname;
```

## 为什么使用 Object.create() 来创建对象

Object.create()方法可以创建一个新对象，并通过传入已有的对象来做作为新创建的对象的**proto**，以此实现继承的效果。

```js
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  },
};

const me = Object.create(person);

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"

me.__proto__; // print person
```

### 手动实现 Object.create API

简单来说，就是创建空（构造）函数，通过关联它的原型，来实现继承

```js
Object.prototype.create = function (proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};
```

### Object.create(null)

使用 Object.create(null) ，能得到一个没有任何继承痕迹的对象

```js
let obj = Object.create(null);
```

## 参考资料

[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)
[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
[001 如何模拟实现一个 new 的效果？](http://47.98.159.95/my_blog/blogs/javascript/js-api/001.html)
