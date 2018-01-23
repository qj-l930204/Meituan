/**
 * 解析url参数，如：?id=123345&a=b
 * 输出对象：Object：{id：123456， a：b}
 */
export function urlParse () {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id：123456'， '&a：b']
  if (arr) {
    arr.forEach((item) => {
      // 删除上述结果的第一个字符，并以“=”分割，得到结果：{id,12345,a,b}
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
}
