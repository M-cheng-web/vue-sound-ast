import parseAttrsString from './parseAttrsString.js';

// parse函数，主函数
export default function(templateString) {
  // 指针
  var index = 0;
  // 剩余部分
  var rest = '';
  // 开始标记
  var startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/; //  <h3 class="aa bb cc" data-n="7" id="mybox">
  // 结束标记
  var endRegExp = /^\<\/([a-z]+[1-6]?)\>/; // </h3>
  // 抓取结束标记前的文字
  var wordRegExp = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
  // 准备两个栈
  var stack1 = [];
  var stack2 = [{ 'children': [] }];

  while (index < templateString.length - 1) {
    rest = templateString.substring(index);
    if (startRegExp.test(rest)) { // 识别遍历到的这个字符，是不是一个开始标签
      let tag = rest.match(startRegExp)[1]; // h1
      let attrsString = rest.match(startRegExp)[2]; // class="aa bb cc" data-n="7"
      stack1.push(tag); // 将开始标记推入栈1中
      stack2.push({ 'tag': tag, 'children': [], 'attrs': parseAttrsString(attrsString) }); // 将空数组推入栈2中
      const attrsStringLength = attrsString != null ? attrsString.length : 0; // 得到attrs字符串的长度
      // 指针移动标签的长度加2再加attrString的长度，为什么要加2呢？因为<>也占两位
      index += tag.length + 2 + attrsStringLength;
    } else if (endRegExp.test(rest)) { // 识别遍历到的这个字符，是不是一个结束标签
      let tag = rest.match(endRegExp)[1]; // h1
      let pop_tag = stack1.pop();
      if (tag == pop_tag) { // 此时，tag一定是和栈1顶部的是相同的
        let pop_arr = stack2.pop();
        if (stack2.length > 0) {
          stack2[stack2.length - 1].children.push(pop_arr);
        }
      } else {
        throw new Error(pop_tag + '标签没有封闭！！');
      }
      index += tag.length + 3; // 指针移动标签的长度加3，为什么要加3呢？因为</>也占3位
    } else if (wordRegExp.test(rest)) { // 识别遍历到的这个字符，是不是文字，并别不能是全空
      let word = rest.match(wordRegExp)[1]; // A,B,C
      if (!/^\s+$/.test(word)) { // 看word是不是全是空
        // 不是全是空
        // 改变此时stack2栈顶元素中
        stack2[stack2.length - 1].children.push({ 'text': word, 'type': 3 });
      }
      index += word.length; // 指针移动标签的长度加上文字的长度
    } else {
      index++;
    }
  }

  // 此时stack2就是我们之前默认放置的一项了，此时要返回这一项的children即可
  return stack2[0].children[0];
};