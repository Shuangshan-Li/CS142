"use strict";
function TableTemplate() {}
TableTemplate.fillIn = function (id, dic, columnName) {
  let tbody = document.getElementById(id).tBodies[0];
  tbody.style = "visibility: visible";
  let header = tbody.children[0];
  let headerTemplate = new Cs142TemplateProcessor(header.innerHTML);
  header.innerHTML = headerTemplate.fillIn(dic);

  let colToFill = -1;
  for (let i = 0; i < header.children.length; i++) {
    if (columnName === header.children[i].innerHTML) {
      colToFill = i;
    }
  }

  for (let row = 1; row < tbody.children.length; row++) {
    for (let col = 0; col < tbody.children[row].children.length; col++) {
      if (columnName === undefined || col === colToFill) {
        let curTemplate = new Cs142TemplateProcessor(
          tbody.children[row].children[col].innerHTML
        );
        tbody.children[row].children[col].innerHTML = curTemplate.fillIn(dic);
      }
    }
  }
};
