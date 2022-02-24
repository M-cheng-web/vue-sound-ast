# vue-sound-ast

## 什么是AST抽象语法树
将模板语法转化为JS对象,通过抽象语法树过渡让编译工作变得简单<br>

在vue中所有的html代码会视为字符串,需要将这些类似html代码的字符串转换为ast<br>
得到一个js对象后再进行渲染函数(h函数),再由patch函数上树,显示到页面
``` html
<div class="box">
  <h3 class="title">我是一个标题</h3>
  <ul>
    <li v-for="item in arr" :key="index">
      {{item}}
    </li>
  </ul>
</div>
```
会转化为
``` js
const ast = {
  tag: "div",
  attrs: [{ name: "class", value: "box" }],
  type: 1, 
  children: [
    {
      tag: "h3",
      attrs: [{ name: "class", value: "title" }], 
      type: 1,
      children: [{ text: "我是一个标题", type: 3 }]
    },
    {
      tag: "ul",
      attrs: [],
      type: 1, 
      children: [
        {
          tag: "li",
          for: "arr",
          key: "index",
          alias: "item", 
          type: 1, 
          children: []
        }
      ]
    }
  ]
}
```
## 抽象语法树和虚拟节点的关系
模板语法 => 抽象语法树ast => 渲染函数(h函数) => 虚拟节点 => 界面

## 算法储备
在/basics文件夹下<br>
核心算法是类似于 `将2[1[a]3[b]2[3[c]4[d]]]变为abbbcccddddcccddddabbbcccddddcccdddd`的算法<br>
核心步骤(在模板解析时用的也是这套算法):<br>
遍历每一个字符<br>
+ 如果这个字符是数字,那么就把数字压栈,把空字符串压栈
+ 如果这个字符是字母,那么此时就把字符串栈顶这项改为这个字母
+ 如果这个字符是],那么就将数字弹栈,就把字符串栈的栈顶的元素重复刚刚的这个次数,弹栈,拼接到新栈顶上

## 正则储备
解析语法的过程用到了蛮多正则,要多了解下正则哦~