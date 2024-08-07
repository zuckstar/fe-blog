# React Router

## 概念

Web 应用原本是后端路由，即由服务器根据浏览器 URL 渲染指定的页面。后来随着技术发展，前端演化出单页应用(SPA)，路由控制也慢慢从后端转移到前端。

- 后端路由：URL 变化触发服务端渲染页面，服务端渲染页面利于 SEO

- 前端路由：单页应用 URL 变化触发前端渲染，使用客户端算力解决页面构建，缓解服务器压力

## 前端路由的几种模式

前端路由的基本原理无非要实现两个功能：

- 监听记录路由变化

- 匹配路由变化并渲染内容

### hash 模式

hash 模式，在 URL 中使用带有“#”符号的哈希值来管理路由。在 hash 模式下，当 URL 的哈希值发生变化的时候，浏览器不会想向服务器发起请求，而是通过监听 hashchange 事件来进行路由导航

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <a href="#/home">Home</a>
    <a href="#/user">User</a>
    <a href="#/about">About</a>
    <div id="view"></div>
  </body>
  <script>
    function onHashChange() {
      const view = document.getElementById("view");
      switch (location.hash) {
        case "#/home":
          view.innerHTML = "Home";
          break;
        case "#/user":
          view.innerHTML = "User";
          break;
        case "#/about":
          view.innerHTML = "About";
          break;
        default:
          view.innerHTML = "Home";
          break;
      }
    }
    window.addEventListener("hashchange", onHashChange);
  </script>
</html>
```

### history 模式

history 模式，使用 HTML5 的 History API 来管理路由

- 利用 `history.pushState` 和 `window.addEventListener('popstate')` 实现
- `history.pushState` 能实现不刷新页面，但往历史栈中新增一个记录
- `popstate` 事件则会在历史记录被更改时触发
- `pushState` 只会改变历史栈，修改它没有什么 API 可以监听，所以要与 `popState` 事件配合
- `history.replaceState` 能够替换当前历史栈的路由记录

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <a href="/home">Home</a>
    <a href="/user">User</a>
    <a href="/about">About</a>
    <div id="view"></div>
  </body>
  <script>
    const elements = document.querySelectorAll("a[href]");
    elements.forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const test = el.getAttribute("href");
        console.log("el", el, el.getAttribute("href"));
        history.pushState(null, null, el.getAttribute("href"));
        onPopState();
      })
    );

    function onPopState() {
      const view = document.getElementById("view");
      switch (location.pathname) {
        case "/home":
          view.innerHTML = "Home";
          break;
        case "/user":
          view.innerHTML = "User";
          break;
        case "/about":
          view.innerHTML = "About";
          break;
        default:
          view.innerHTML = "Home";
          break;
      }
    }
    window.addEventListener("popstate", onPopState);
  </script>
</html>
```

## React Router 用法回顾

## React Router 实现原理

## React Router 传参方式

## 参考资料
