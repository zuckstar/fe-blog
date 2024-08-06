# 事件

事件，就是文档或者浏览器窗口中发生的一些特定的交互瞬间。

## 事件流

事件流描述的是从页面中接收事件的顺序。

### 事件冒泡

IE 的事件流叫事件冒泡，即事件开始时由最具体的元素接收，然后逐级向上传播到较为不具体的节点（文档）。

### 事件捕获

网景团队提出的另一种事件流叫事件捕获，事件捕获的思想是从不太具体的节点流转到具体的节点。

### DOM 事件流

"DOM2 级事件" 规定事件流包括三个阶段：事件捕获阶段、处于目标阶段和事件冒泡阶段。

## 事件处理程序

### HTML 事件处理程序

```html
<input type="button" value="Click me" onclick="alert('clicked')" />
```

### DOM0 级事件处理程序

```js
var btn = document.getElementById('myBtn')
btn.onclick = function() {
  alert(this.id)
}

// 移除事件
btn.onclick = null
```

### DOM2 级事件处理程序

```js
var btn = document.getElementById('myBtn')
btn.addEventListener(
  'click',
  function() {
    alert(this.id)
  },
  false
)

// 移除事件，使用匿名函数无法移除，需改成如下代码
var btn = document.getElementById('myBtn')
var handler = function() {
  alert(this.id)
}

btn.addEventListener('click', handler, false)
// ...
btn.removeEventListener('click', handler, false)
```

最后一个参数 false 表示该事件会在冒泡阶段触发

### IE 的事件处理程序

attachEvent 和 detachEvent，IE 标准微软自己都打算弃用了，这里就不展开说了。

## 事件对象

在触发 DOM 上的某个事件时，会产生一个事件对象 event，这个对象中包含着所有与事件有关的信息。包括导致事件的元素、事件的类型以及其他特定事件相关的信息。例如，鼠标操作导致的事件对象中，会包含鼠标位置的信息，而键盘操作导致的事件中，会包含与按下的键有关的信息。所有浏览器都支持 event 对象，但支持方式不同。

只有在事件处理程序执行期间，event 对象才会存在，一旦事件处理程序执行完成，event 对象就会被销毁。

### 事件对象属性

- preventDefault() 方法：阻止特定事件的默认行为，例如链接导航。

```js
var link = document.getElementById('myLink')
link.onclick = function(event) {
  event.preventDefault()
}
```

注: 只有 event.cancelable 属性为 true 的事件，才可以使用 preventDefault() 来取消其默认行为。

- stopPropagation() 方法：用于立即停止事件在 DOM 层次中的传播，即取消其进一步的事件捕获或者冒泡。

- stopImmediatePropagation() 方法：取消事件的进一步捕获和冒泡，同时阻止任何事件处理程序被调用（DOM3 级事件中新增）

- target: 事件的目标对象。在事件处理程序内部，对象 this 始终等于 currentTarget 的值，而 target 则只包含事件的实际目标。如果直接将事件处理程序指定给了目标元素，则 this、currentTarget 和 target 包含相同的值：

```js
var btn = document.getElementById('myBtn')
btn.onclick = function(event) {
  alert(event.currentTarget === this) // true
  alert(event.target === this) // true
}
```

如果事件处理程序存在于按钮的父节点中，那么这些值是不同的(前提是点击了 mybtn 这个元素）：

```js
document.body.onclick = function(event) {
  alert(event.currentTarget === document.body) // true
  alert(this === document.body) // true
  alert(event.target === document.getElementById('myBtn')) // true s
}
```

## 事件类型

- UI 事件
- 焦点事件
- 鼠标与滚轮事件
- 键盘与文本事件
- 复合事件
- 变动事件
- HTML5 事件
- 设备事件
- 触摸和手势事件

## 内存和性能

### 事件委托

对"事件处理程序过多"问题的解决方案就是利用事件委托，事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。

### 题目

> 假设一个 ul 下有一万个 li，li 的 innerHTML 是从 0 到 9999，当点击某个 li 时输出该 li 代表的值，如何实现

首先，我们当然不可能为每一个 li 标签手动添加一个 click 事件（容易累死）；其次，我们可能会想到使用 for 循环遍历每个元素，然后为其添加 click 事件，但这样会频繁操作 DOM，降低性能，卡到爆炸。

而事件委托意义就在于此：减少 DOM 操作，从而减少浏览器的重绘与重排次数，提升性能。

事件委托的原理是，将 li 上监听的 click 事件委托到 ul 上。这里运用到了 事件冒泡 的机制，即 onclick 事件以 li -> ul -> body -> html -> document 的冒泡顺序逐步传递。

所以，我们可以选择在其中的 ul 上监听 click 事件，从而实现事件委托。

```js
window.onload = function() {
  // 快速创建 100000 个 li 标签
  var ul = document.getElementById('ul')
  var arr = []
  for (let i = 0; i < 100000; i++) {
    arr.push(i)
  }
  ul.innerHTML = '<li>' + arr.join('</li><li>') + '</li>'

  ul.onclick = function(event) {
    alert(event.target.innerText)
  }
}
```
