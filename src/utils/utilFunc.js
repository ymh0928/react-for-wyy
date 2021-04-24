export const transformTime = (time) => {
  if (time) {
    const temp = time | 0;
    const minute = (temp / 60) | 0;
    const second = (temp % 60).toString().padStart(2, "0");
    return `${minute}:${second}`;
  } else {
    return "00:00";
  }
};

export const shuffle = (arr) => {
  const result = arr.slice();
  for (let i = 0; i < result.length; i++) {
    const j = getRandomInt([0, i]);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const getRandomInt = (range) => {
  return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
};

export const timestampToTime = (timestamp) => {
  const date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + "-";
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  const D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  // const h =
  //   (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  // const m =
  //   (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
  //   ":";
  // const s =
  //   date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  // const strDate = Y + M + D + h + m + s;
  const strDateYMD = Y + M + D;
  return strDateYMD;
};

export const compareFun = (arr1, arr2, func) => {
  if (!func) {
    func = defaultCompare;
  }

  if (
    !Array.isArray(arr1) ||
    !Array.isArray(arr2) ||
    arr1.length !== arr2.length
  ) {
    return false;
  }
  const queue = [{ arr1, arr2 }];
  while (queue.length) {
    let shift = queue.shift();
    let first = shift.arr1.shift();
    let second = shift.arr2.shift();
    if (func(first, second)) {
      if (shift.arr1.length > 0 && shift.arr2.length > 0) {
        queue.push({
          arr1: [...shift.arr1],
          arr2: [...shift.arr2],
        });
      }
    } else {
      return false;
    }
  }
  return true;
  function defaultCompare(a, b) {
    return a === b;
  }
};
