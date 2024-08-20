# Node.js

## 要点

- 非阻塞
- 事件循环
- 异常处理
- 模块系统
- 异步编程与流
- npm
- 模块系统
- buffer
- stream
- 事件模式

## 非阻塞

事件循环：负责监听异步模块和派发任务

异步模块(多线程)： 耗时 I/O->异步操作->回调函数->事件循环->按照顺序推动到调用栈

![alt text](image.png)

## [事件循环](../Browser/eventloop.md)

## 异常处理

捕获并处理每一个错误。否则进程挂了。

同步代码：

```js
try {
  // 执行
} catch {}
```

异步代码：

- promise, .catch() 方法捕获这个错误

- async/await, try catch

```js
// 处理未捕获异常
process.on("uncaughtException", () => {});
// 处理未捕获的 promise 异常
process.on("unhandledRejection", () => {});
```

使用 nodemon，pm2 来管理 node 进程

## 模块系统

### commonJS （流行）

1. 每个文件都是一个独立模块，每个模块都有一个 module 对象用来记录模块信息

2. 通过 `module.exports` 或者 `exports` 可以导出模块

3. 通过 `require()` 可以导入项目

### ES module （未来）

在 package.json 中，配置 type="module"

### 模块

核心模块：核心模块随 node 一起安装，不需要额外的安装，可以直接引用

第三方模块：需要 npm 安装的模块，安装位置是 node_modules

自定义模块：我们自己定义的模块，引用是需要写路径

### 区别

- commonJS 运行时加载，执行的时候才加载，require 可以放在代码的任意位置

- ES module 预编译时加载，可以更早地发现错误。
  - import xx from
  - import 函数，异步函数，返回的是 promise 对象
  - 有向图

[课程](https://www.bilibili.com/video/BV1vB4y197xU/?spm_id_from=333.788&vd_source=e3b06273d67da30202e9861b00e040a5)

## buffer

buffer 对象用来操作二进制数据，长文本、大文件、图片、音频

字符串在 JavaScript 里是不可变的，操作字符内存占用大，而对于 buffer 对象可以直接像数组一样修改数据

```js
// 创建 buffer
const buffer = Buffer.alloc(size, fill, (encoding = "utf-8"));

// 转换成字符串
console.log(buffer.toString());

// 类数组
console.log(buffer.length);
buffer[0] = 72;
buffer.slice();
```

## stream

## 事件模式

EventEmitter 观察者模式

- on：用于注册监听器
- once：注册一次性监听器
- emit：触发事件，同步地调用监听器
- removeListener：移除某个事件的监听器

监听器实际上就是一个数组，触发事件按注册的顺序执行

支持链式调用

```js
const E = new EventEmitter();

E.on("foo", function a() {
  console.log(11);
}).on();
```
