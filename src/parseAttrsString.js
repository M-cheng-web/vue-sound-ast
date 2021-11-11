// 把attrsString变为数组返回
export default function(attrsString) {
  if (attrsString == undefined) return [];
  var isYinhao = false; // 当前是否在引号内
  var point = 0; // 断点
  var result = []; // 结果数组

  // 遍历attrsString，而不是你想的用split()这种暴力方法
  for (let i = 0; i < attrsString.length; i++) {
    let char = attrsString[i];
    if (char == '"') { // 遇到引号,标记一下
      isYinhao = !isYinhao;
    } else if (char == ' ' && !isYinhao) { // 遇见了空格，并且不在引号中
      if (!/^\s*$/.test(attrsString.substring(point, i))) {
        result.push(attrsString.substring(point, i).trim());
        point = i;
      }
    }
  }

  // 循环结束之后，最后还剩一个属性k="v" (如果 id="mybox"后还有空格就能正常拿到剩余的那个属性,不清楚的话看看上面的步骤)
  result.push(attrsString.substring(point).trim());

  // 下面的代码功能是，将["k=v","k=v","k=v"]变为[{name:k, value:v}, {name:k, value:v}, {name:k,value:v}];
  result = result.map(item => {
    // 根据等号拆分
    const o = item.match(/^(.+)="(.+)"$/);
    return {
      name: o[1],
      value: o[2]
    };
  });

  return result;
}