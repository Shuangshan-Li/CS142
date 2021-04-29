"use strict";

function cs142MakeMultiFilter(originalArray) {
  let currentArray = originalArray;
  function arrayFilterer(filterCriteria, callback) {
    if (typeof filterCriteria !== "function") {
      return currentArray;
    }

    currentArray = currentArray.filter(filterCriteria);

    if (typeof callback === "function") {
      //in strict mode, this is defaultly set to 'undefined'
      callback = callback.bind(originalArray);
      callback(currentArray);
    }
    return arrayFilterer;
  }
  return arrayFilterer;
}
