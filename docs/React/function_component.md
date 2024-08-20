# 函数组件

## 函数组件和类组件有什么不同

### 最大的区别

函数式组件捕获渲染时的值，类组件会一直获取最新的值。

只要一渲染，函数式组件就会捕获当前的值。而类组件即使渲染了，但是它的 this 会指向最新的实例。

### 如何解决类组件取值变化的问题

```js
class ClassDemo extends React.Component {
  state = {
    value: "",
  };

  showMessage = () => {
    alert("最新值为 " + this.state.value);
  };

  handleMessageChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleMessageChange} />
        <button onClick={this.handleClick}>点击</button>
      </div>
    );
  }
}
```

这样的结果是点击后获取到最新的值，而不是 3 秒前的值。为什么？因为 this 可变，3 秒之后执行 alert("最新值为 " + this.state.value)。 this.state.value 指向最新的值

如果类组件如果想保存原来的值该怎么做？

利用闭包的特性，捕获当时所用的 props 或者 state

```js
const { value } = this.state;

const showMessage = () => {
  alert("最新值为 " + value);
};
```

### 类组件和函数组件的区别

- 类组件有生命周期，函数组件没有生命周期。16.8 版本后的通过 useEffect hooks 模拟生命周期（感知组件创建、更新和销毁）

- 类组件需要继承 Class 函数组件不需要继承 Class。函数组件命名用大驼峰即可。

- 类组件有自己的状态，函数组件没有自己的状态。16.8 之后通过 useState hooks 获取了自己的状态。

- 类组件可以获取实例化后的 this。函数组件没有实例

## 类组件和函数组件的优缺点比较

- 从生命周期角度来看，类组件的生命周期比函数组件生命周期更多。

  - 类组件：挂载阶段：getDerviedStateFromProps

- 从功能上来讲，类组件拥有错误边界 componentDidCatch。但是函数组件没有，只能使用 ErrorBoundry 包裹，ErrorBoundry 也是基于类的组件。

- 从代码上来讲，函数组件比类组件更简洁易读，更干净清爽。类组件代码臃肿不易拆分。

- 从组件化的角度来说，函数组件也比类组件更好拆分和复用。
