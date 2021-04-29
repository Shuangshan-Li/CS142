"use strict";
function Cs142TemplateProcessor(template) {
  this.template = template;
}
Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
  let result = this.template;
  //find all the {{[^{*]}} pattern
  let properties = result.match(/{{[^{]*}}/g);
  for (let i = 0; i < properties.length; i++) {
    //get the content inside {{}}
    let name = properties[i].slice(2, -2);
    if (name in dictionary) {
      result = result.replace(properties[i], dictionary[name]);
    } else {
      result = result.replace(properties[i], " ");
    }
  }

  return result;
};
