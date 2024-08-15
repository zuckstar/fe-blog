# React 事件

React 在内部对事件做了统一处理，即合成事件。

## 为什么要有合成事件

1. 在处理机制方面提高性能

JS 原生事件是直接绑定在 DOM 元素上的。每个元素都可以独立地响应事件，并且事件的传播（包括冒泡和捕获）也是按照 DOM 树的结构来进行的。而 React 合成事件则是通过事件委托的方式来实现的。

也就是说 React 并不会为每个元素都绑定一个事件处理器，而是将所有的事件以数组的方式存储然后都委托给了一个统一的处理器。React 通过顶层监听的形式，通过事件委托的方式来统一管理所有的事件，可以在事件上区分事件优先级，优化事件体验。

当事件发生时，这个处理器会判断事件应该由哪个组件来处理，并调用相应的处理函数。这种方式不仅减少了内存消耗，还提高了性能。

2. 在事件对象方面确保代码兼容性，抹平浏览器之间的差异

在传统的事件里，不同的浏览器需要兼容不同的写法，在合成事件中 react 提供统一的事件对象，抹平了浏览器的兼容性差异

3. 在事件传播方面：

4. 在执行顺序方面：

## 概念

事件委托和事件监听相关的概念：[事件流](../JavaScript/event.md)

三个阶段：

- 事件捕获

- 目标阶段

- 事件冒泡

### React 的事件委派机制

React 事件代理机制。

它并不会把事件处理函数直接绑定到真实的节点上，而是把所有事件绑定到 结构的最外层，使用一个统一的 事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象；当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。这样做简化了事件处理和回收机制，效率也有很大提升。

## 合成事件

研究如下几个问题：

- 原生事件和合成事件的执行顺序？

- 合成事件在什么阶段下会被执行？

- 阻止原生事件的冒泡，会影响到合成事件的执行吗？

- 阻止合成事件的冒泡，会影响到原生事件的执行吗？

通过代码案例来分析，（react 版本 18.3.1）

```js
function App() {
  const buttonRef = useRef(null);
  const parentRef = useRef(null);

  const event = (e) => {
    console.log("原始冒泡");
  };

  const eventCapture = () => {
    console.log("原始捕获");
  };

  const fatherEvent = () => {
    console.log("父亲冒泡");
  };

  const fatherEventCapture = () => {
    console.log("父亲捕获");
  };

  useEffect(() => {
    buttonRef.current.addEventListener("click", event);
    buttonRef.current.addEventListener("click", eventCapture, true);
    parentRef.current.addEventListener("click", fatherEvent);
    parentRef.current.addEventListener("click", fatherEventCapture, true);
    return () => {
      buttonRef.current.removeEventListener("click", event);
      buttonRef.current.removeEventListener("click", eventCapture);
      parentRef.current.removeEventListener("click", fatherEvent);
      parentRef.current.removeEventListener("click", fatherEventCapture);
    };
  }, []);

  const onClick = (event) => {
    console.log("react冒泡");
  };

  const onClickCapture = () => {
    console.log("react捕获");
  };

  const onFatherClick = () => {
    console.log("react父亲冒泡");
  };

  const onFatherCapture = () => {
    console.log("react父亲捕获");
  };

  return (
    <div
      onClick={onFatherClick}
      onClickCapture={onFatherCapture}
      ref={parentRef}
    >
      <button onClick={onClick} onClickCapture={onClickCapture} ref={buttonRef}>
        开始
      </button>
    </div>
  );
}
```

在不增加任何停止冒泡的情况下，输出顺序为：

```
react父亲捕获
react 捕获
父亲捕获
原始捕获
原始冒泡
父亲冒泡
react 冒泡
react父亲冒泡
```

仍然看到是一个由事件源外向内的先捕获再冒泡的过程，只不过 react 合成事件的冒泡和捕获都在原生事件的外层，这也非常好解释，因为 react 的事件代理机制是绑定在最外层的根组件身上。

接下来阻止原生事件的冒泡行为

```js
const event = (e) => {
  e.stopPropagation();
  console.log("原始冒泡");
};
```

看下打印的结果，非常合理，原始冒泡被阻止后，后续的冒泡行为都被阻止，包括 react 合成事件。

```
react父亲捕获
react 捕获
父亲捕获
原始捕获
原始冒泡
```

接下来阻止原生事件的冒泡行为，打印如下：

```
react父亲捕获
react 捕获
父亲捕获
原始捕获
原始冒泡
父亲冒泡
react 冒泡
```

阻止了 react 合成事件的冒泡。

再进一步论证，给 body 元素绑定 click 事件监听，在 react 合成事件中阻止冒泡，body 元素的冒泡事件也不会发生！说明 react 合成事件阻止冒泡对原生监听也生效，他们之间互相影响！

```js
document.body.addEventListener(
  "click",
  () => {
    console.log("body captrue click");
  },
  true
);
document.body.addEventListener("click", () => {
  console.log("body click");
});
```

## 子组件是一个 Portal，发生点击事件能冒泡的父组件吗？

Protal 在 DOM 结构上将子组件渲染到其他位置，但是在 React 的组件树中，它仍然是父组件的子组件。这使得事件可以从子组件沿着组件树冒泡到父组件。

## 总结

- 16 版先执行原生事件，当冒泡到 document 时，统一执行合成事件

- 18 版本在原生事件执行前先执行合成事件捕获阶段，原生事件执行完毕执行冒泡阶段的合成事件，通过根节点来管理所有的事件

- react 的合成事件绑定在根元素身上，如果根元素内部的原生事件阻止了冒泡，react 的合成事件也不会执行。原生事件先执行完成之后，才去管合成事件。

- 在 react 合成事件和原生事件阻止冒泡，在更外层的元素都会受到影响，即冒泡事件行为不会执行

## 参考文章

[浅谈 React 合成事件之执行顺序](https://juejin.cn/post/7121262292737458213)

[react 18 事件研究之原生事件和 react 合成事件触发顺序](https://juejin.cn/post/7336287879332413491)
