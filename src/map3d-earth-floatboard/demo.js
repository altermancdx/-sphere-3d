// 浮框层
const Chart = require('./index.js');

const config = {
  "height": 25,
  "scale": 50,
  "opacity": 1
};
const data = [{"lng":135,"lat":34,"content":{"width":900,"height":350,"title":"标题1","titleFontSize":45,"titleColor":"#fbf320","content":"正文正文正文正文","contentColor":"#000","contentFontSize":40,"paddingLeft":90,"paddingRight":60,"paddingTop":110,"fontFamily":"Microsoft Yahei, serif","bgImgUrl":"https://img.alicdn.com/tps/TB1bymmOFXXXXaxXpXXXXXXXXXX-2201-753.png"}},{"lng":55.3,"lat":25.27,"content":{"width":900,"height":350,"title":"标题2","titleFontSize":45,"titleColor":"#fbf320","content":"正文正文正文正文","contentColor":"#000","contentFontSize":40,"paddingLeft":90,"paddingRight":60,"paddingTop":110,"fontFamily":"Microsoft Yahei, serif","bgImgUrl":"https://img.alicdn.com/tps/TB1bymmOFXXXXaxXpXXXXXXXXXX-2201-753.png"}},{"lng":119,"lat":30,"content":{"width":900,"height":350,"title":"标题3","titleFontSize":45,"titleColor":"#fbf320","content":"正文正文正文正文","contentColor":"#000","contentFontSize":40,"paddingLeft":90,"paddingRight":60,"paddingTop":110,"fontFamily":"Microsoft Yahei, serif","bgImgUrl":"https://img.alicdn.com/tps/TB1bymmOFXXXXaxXpXXXXXXXXXX-2201-753.png"}}];

const chart = new Chart({}, config);

module.exports = (map) => {
  map.add(chart);
  chart.setData(data);
};
