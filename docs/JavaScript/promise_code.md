# Promise 相关代码题

## 实现一个并发请求控制函数

```js
/*
实现前端一个并发请求控制函数
1. 输入URL数组 和 限制请求数
2. 按照 限制请求数 控制前端同时可以并发请求数量
3. 请求操作直接用 window.fetch
4. 最后根据 URL数组的顺序返回请求结果数组
*/

/**
 * 思路：
 * 1. count 和 index 分别记录已经完成的数量和当前执行的下标
 * 2. 比较当前任务数量和并发上限值，取较小者记为 n
 * 3. 首先启动 n 个任务，每个任务完成后递归执行下一个任务
 *
 * */

function mockRequest(url) {
  return new Promise(function (resolve) {
    const timeout = Math.floor(Math.random() * 1000);
    setTimeout(() => {
      resolve(url);
    }, timeout);
  });
}
function requestLimit(urlList, limitCount) {
  return new Promise(function (resolve, reject) {
    if (urlList.length === 0) {
      resolve([]);
      return;
    }

    const results = [];

    let index = 0; // 请求的下标
    let count = 0; // 当前完成的数量

    const request = async () => {
      // 全部执行完毕，无需再继续执行
      if (index === urlList.length) {
        return;
      }

      const i = index;

      const url = urlList[index];

      index++;

      try {
        console.log("开始执行任务", i);

        const resp = await mockRequest(url);
        results[i] = resp;
      } catch (err) {
        results[i] = err;
      } finally {
        count++;
        console.log("完成", i);
        if (count === urlList.length) {
          resolve(results);
        }

        // 递归调用启动任务
        request();
      }
    };

    const times = Math.min(urlList.length, limitCount);

    // 启动 n 个任务
    for (let i = 0; i < times; i++) {
      request();
    }
  });
}

async function main() {
  // 测试效果
  const urlList = [
    "https://unpkg.com/vue@3.2.31/package.json?v=0",
    "https://unpkg.com/vue@3.2.31/package.json?v=1",
    "https://unpkg.com/vue@3.2.31/package.json?v=2",
    "https://unpkg.com/vue@3.2.31/package.json?v=3",
    "https://unpkg.com/vue@3.2.31/package.json?v=4",
    "https://unpkg.com/vue@3.2.31/package.json?v=5",
    "https://unpkg.com/vue@3.2.31/package.json?v=6",
    "https://unpkg.com/vue@3.2.31/package.json?v=7",
    "https://unpkg.com/vue@3.2.31/package.json?v=8",
  ];
  const limitCount = 3;
  const result = await requestLimit(urlList, limitCount);
  console.log(result);
}

main();
```

## 写一个 promise 请求， 请求三次, 三次都失败的话就让 promise 失败

思路：递归+闭包

```js
function requestWithRetry(maxRetries, func) {
  return new Promise((resolve, reject) => {
    let attemps = 0;

    function retryFunc() {
      func()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          attemps++;
          if (attemps > maxRetries) {
            reject(err);
          } else {
            retryFunc();
          }
        });
    }

    retryFunc();
  });
}
```

## 实现一个 Promise.all

```js
Promise.prototype.all = function (arrs) {
  return new Promise((resolve, reject) => {
    const ans = [];

    const total = arrs.length;

    let count = 0;

    const innerResolved = (data, index) => {
      ans[index] = data;
      count++;

      if (count === total) {
        resolve(res);
      }
    };

    for (let i = 0; i < length; i++) {
      Promise.resolve(arrs[i])
        .then((data) => {
          innerResolved(data, i);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};
```

## 实现一个简易 promise

```js
function Promise(fn) {
  // resolve 回调函数队列
  this.cbs = [];

  // resolve 方法
  const resolve = (value) => {
    // 模拟异步
    setTimeout(() => {
      // 缓存当前 promise 结果
      this.data = value;
      // 依次执行回调
      this.cbs.forEach((cb) => cb(value));
    });
  };

  // 执行用户传入的函数并把 resolve 交给用户处理
  fn(resolve);
}

Promise.prototype.then = function (onResolved) {
  return new Promise((resolve) => {
    // then 方法就是在注册回调事件
    this.cbs.push((resolve) => {
      // 执行并取得结果
      let res = onResolved(this.data);

      // 如果结果也是 promise，把 resolve 权限交给用户自定义 promise
      if (res instanceof Promise) {
        res.then(resolve);
      } else {
        // 直接 resolve
        resolve(res);
      }
    });
  });
};
```
