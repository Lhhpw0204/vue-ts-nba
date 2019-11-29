export default {
  deepClone: function (tar) {
    let result = Array.isArray(tar) ? [] : {};
    for(let key in tar) {
      if(tar.hasOwnProperty(key)) {
        if(typeof tar[key] === 'object' && tar[key] !== null) {
          result[key] = this.deepClone(tar[key]);
        } else {
          result[key] = tar[key];
        }
      }
    }
    return result;
  },
  debounce: (fn, wait, immediate) => {
    let timer = null;
    return function () {
      let context = this;
      let args = arguments;
      if(timer) clearTimeout(timer);
      if(immediate) {
        let callNow = !timer;
        timer = setTimeout( () => {
          timer = null;
        }, wait);
        if(callNow) fn.apply(context, args);
      } else {
        timer = setTimeout( function() {
          fn.apply(context, args);
        }, wait)
      }
    }
  },
  selfSort: (property) => {
    return function (a, b) {
      const value1 = a[property].replace(/\s*/g, '').toUpperCase();
      const value2 = b[property].replace(/\s*/g, '').toUpperCase();
      return (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    };
  }
}