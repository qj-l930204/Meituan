export function saveToLoaction (id, key, val) {
  let seller = window.localStorage.__seller__; // 定义存储空间名
  if (!seller) {   // 如果空间不存在，定义空间，成员有：seller和id对象
    seller = {};
    seller[id] = {};
  } else {    // 如果存在，将其内容转化为json格式，便于存取
    seller = JSON.parse(seller);
    if (!seller[id]) {  // 如果已经存在__seller__空间，即seller对象已经存在，那么再次判断id对象是否存在，不存在，就创建； 存在，就存内容
      seller[id] = {};
    }
  }
  seller[id][key] = val;  // id商家标识；key存取的关键字，val存的值
  window.localStorage.__seller__ = JSON.stringify(seller);  // 最后转化为字符串
};

export function loadFromLoaction (id, key, def) {
  let seller = window.localStorage.__seller__; // 查看是否存储空间名
  if (!seller) {
    return def;  // 不存在，即没存储过，返回默认值
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {    // 商家有，但没有内容，返回默认值
    return def;
  }
  let ret = seller[key]; // 如果商家内容都存在，通过key获取val值
  return ret || def;
};
