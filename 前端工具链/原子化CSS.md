# 什么是原子化CSS

一般情况下我们写 CSS，都是在一个类里写一系列 property，例如：

```html
<div class="button button-danger">编辑</div>
<style>
.button {
    width: 100px;
    height: 50px;
    ……
}

.button-danger {
    background-color: red;
    ……
}
</style>
```

而原子化CSS是一种用于CSS的架构方式的理念
- 每一个CSS 类都有一个唯一的 CSS 规则
- 用途单一的class以视觉效果命名
    
例如：

```html
<div class="w-100 h-50 bc-red">编辑</div>
<style>
.w-100 {
    width: 100px;
}
.h-50 {
    height: 50px;
}

.bc-red {
    background-color: red;
}
……
</style>
```

# 原子化CSS有什么用
- 修改样式时可以直接修改html，或者可以随处移动html
- 不用起名字了
- 使得CSS体积相对可控，不会随着页面样式越来越多，导致CSS越写越大

# 原子化CSS有什么缺点
- 不能完全取代传统的class
    - 类似于querySelector(className)以后可能都只能用getElementById(id)了
    - 伪元素、keyframe动画等复杂效果无法实现
    - 不方便覆盖样式
    - class具有语义化的作用
- html会变长
- 有一定的记忆负担
- html与css耦合在一起（这是行内样式不被推荐的原因之一）

# 为什么不是inline style

- 权重高到几乎无法覆盖
- 可复用性差

# 原子化CSS的工作原理

各种原子化CSS方案的核心，就是如何得到原子类。

## 先生成再使用
例如通过预处理器生成：
```css
// style.scss

@for $i from 1 through 10 {
  .m-#{$i} {
    margin: $i / 4 rem;
  }
}
```
上述结果将会编译为：

```css
.m-1 { margin: 0.25 rem; }
.m-2 { margin: 0.5 rem; }
/* ... */
.m-10 { margin: 2.5 rem; }
```

虽然现在可以使用从`m-1`到`m-10`的边距类了，但是：
- 只使用了一条边距类会引入所有文件
- 如果想使用margin-top等不同方向的边距，这个尺寸还会扩大
- 如果再加上hover等伪类，尺寸可能要爆炸了

为了解决这个问题，Tailwind 使用 PurgeCSS 删除编译产出中用不到的规则，但是因为对编译产出之后的文件做处理，所以不能作用在开发阶段。

## 按需生成

为了解决先生成再使用方案的问题，Windi CSS 和 Tailwind JIT 都采用了预先扫描源代码的方式，大致原理是预先配置：

```js
// tailwind.config.js
module.exports = {
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
      '10': '10px' // <-- here
    }
  }
}
```
然后代码里就可以使用：`border-1` …… `border-10`

```js
// tailwind.config.js
const _ = require('lodash')
const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    rotate: {
      '1/4': '90deg',
      '1/2': '180deg',
      '3/4': '270deg',
    }
  },
  plugins: [
    plugin(function({ addUtilities, theme, e }) {
      const rotateUtilities = _.map(theme('rotate'), (value, key) => {
        return {
          [`.${e(`rotate-${key}`)}`]: {
            transform: `rotate(${value})`
          }
        }
      })

      addUtilities(rotateUtilities)
    })
  ]
}
```

上述代码将会产生：

```css
.rotate-1\/4 {
  transform: rotate(90deg);
}
.rotate-1\/2 {
  transform: rotate(180deg);
}
.rotate-3\/4 {
  transform: rotate(270deg);
}
```
但是可以看到，用来生成CSS的代码比完整的CSS还长，那还不如直接写CSS呢！


# 一些现成的库

- tailwind
    - 成熟
- windicss
    - 属性化模式
    - 现在不维护了
- unocss
    - 灵活、轻量
    - 不怎么成熟
    - 和windicss有点关系



# 参考文档
- [重新构想原子化CSS](https://zhuanlan.zhihu.com/p/425814828)
- [聊聊原子类（Atomic CSS）](https://mongkii.com/blog/2021-07-26-talk-about-atomic-css)
- [TailwindCSS v3 发布，JIT成为默认引擎](https://baijiahao.baidu.com/s?id=1718962324523218284&wfr=spider&for=pc)
