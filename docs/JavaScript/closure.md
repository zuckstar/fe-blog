# 闭包

## 定义

### MDN

一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

### 一句话解释

闭包就是一个绑定了执行环境的函数，它利用了词法作用域的特性，在函数嵌套的时候，内层函数引用外层函数作用域下的变量，并且内层函数在全局环境下可访问，就形成了闭包。

### 实例

```js
let fn = () => {
  let name = "外层函数的变量";

  return () => {
    console.log(name);
  };
};

let closesureFn = fn();
closesureFn(); // 外层函数的变量
```

## 闭包形成的原理

想理解闭包，就要先了解三个知识点：词法作用域、词法环境、执行上下文与调用栈

- 词法作用域：指函数作用域，它由函数被声明时所处的位置决定。函数作用域有个特点，函数内的变量函数外不能访问，函数外的变量函数内能访问

- 词法环境：函数声明形参的合集，在代码编译阶段记录变量声明、函数声明

- 执行上下文：调用函数时所带的所有信息。包括词法环境、变量环境、this

当代码要访问一个变量时，首先会搜索自身的作用域（即内部词法环境）是否有此变量，再沿着 outer，去父作用域（外部环境），然后搜索更外部的环境，以此类推，直到全局词法环境，这被关系被称为作用域链，是在函数调用时就被确认的。

其内在逻辑是：内层函数赋值给全局变量，内层函数又引用外层函数变量，所以外层函数变量就不会被释放

简言之：闭包 = 函数 + 自由变量

## 闭包的优缺点和误区

优点：

- 保护私有变量

- 避免全局变量污染

- 让部分变量缓存在内存中

缺点：

- 变量一直在内存中，要主动释放

## 闭包的应用

1. 函数作为返回值

2. 函数作为参数传递

### 作为返回值

```js
function foo() {
  var a = 1;
  return function bar() {
    console.log(a);
  };
}
var baz = foo();
baz(); // 1
```

### 作为参数传递

```js
function foo() {
  var a = 1;
  function bar() {
    console.log(a);
  }
  baz(bar);
}

function baz(fn) {
  fn();
}
baz(foo); // 1
```

## 闭包面试题

### 循环输出问题

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
}
```

以上代码输出的结果是什么？ 全是 6

解决方案：

(1) 使用 ES6 中的 let

let 使 JS 发生革命性的变化，让 JS 有函数作用域变为了块级作用域，用 let 后作用域链不复存在。代码的作用域以块级为单位

上述代码会变成如下代码再进行执行：

```js
// i = 1
{
  setTimeout(function timer() {
    console.log(1);
  }, 0);
}
// i = 2
{
  setTimeout(function timer() {
    console.log(2);
  }, 0);
}
// i = 3
// ...
```

(2) 利用立即执行函数, 当每次 for 循环时，把此时的 i 变量传递到定时器中

```js
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, 0);
  })(i);
}
```

### 函数式编程：用闭包实现一个累加器

```js
function sum(...arr) {
  let _sum = 0;

  for (let i of arr) {
    _sum += i;
  }

  let y = function (..._arr) {
    for (let i of _arr) {
      _sum += i;
    }
    return y;
  };

  y.sumOf = function () {
    return _sum;
  };

  return y;
}

console.log(sum(1, 2, 3)(1).sumOf());
```

### 每隔一秒输出一个数字

```js
for (let i = 1; i <= 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
```

### React Hooks 捕获渲染时的值

## 参考

[闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[谈谈你对闭包的理解](http://47.98.159.95/my_blog/blogs/javascript/js-base/004.html#%E4%BB%80%E4%B9%88%E6%98%AF%E9%97%AD%E5%8C%85)
