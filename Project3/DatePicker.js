"use strict";
function DatePicker(divId, callback) {
  this.divId = divId;
  this.callback = callback;
}
DatePicker.prototype.render = function (date) {
  let elem = document.getElementById(this.divId);
  //Replae div's content with calendar's template
  elem.innerHTML = `
        <span id="pre-${this.divId}" class="button"> \< Prev  </span>
        <span id="header-${this.divId}" class="header"></span>
        <span id="next-${this.divId}" class="button">Next \> </span>
        <table id="calendar-${this.divId}" >
            <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
            </tr>
        </table>
    
    `;

  //Get all the nodes in calendar
  let prev = document.getElementById(`pre-${this.divId}`);
  let next = document.getElementById(`next-${this.divId}`);
  let header = document.getElementById(`header-${this.divId}`);
  let calender = document.getElementById(`calendar-${this.divId}`);

  const getCalendar = () => {
    let startDate = new Date(date.getTime());
    startDate.setDate(1);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //curDate is the ptr that we use to populate every cell in calendar table
    let curDate = new Date(startDate.getTime());
    //curDate start from the days of last month that appear in this month's calendar
    curDate.setDate(startDate.getDate() - startDate.getDay());
    let totalWeeks = Math.ceil((startDate.getDay() + endDate.getDate()) / 7);

    header.innerHTML =
      new Intl.DateTimeFormat("en-US", { month: "long" }).format(startDate) +
      " - " +
      startDate.getFullYear();
    for (let i = 0; i < totalWeeks; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let td = document.createElement("td");
        td.innerHTML = `${curDate.getDate()}`;
        let isCurMonth = curDate.getMonth() === date.getMonth();
        td.className = isCurMonth ? "normal" : "dimmed";
        let obj = {
          day: curDate.getDate(),
          month: new Intl.DateTimeFormat("en-US", {
            month: "long",
          }).format(curDate),
          year: curDate.getFullYear(),
        };
        td.addEventListener(
          "click", isCurMonth ? () => {
                this.callback(this.divId, obj);
              }
            : () => {}
        );
        tr.appendChild(td);
        curDate.setDate(curDate.getDate() + 1);
      }
      calender.appendChild(tr);
    }
  };

  const changeMonth = (step) => {
    date.setMonth(date.getMonth() + step);
    calender.innerHTML = `            
    <tr>
      <th>Sun</th>
      <th>Mon</th>
      <th>Tue</th>
      <th>Wed</th>
      <th>Thu</th>
      <th>Fri</th>
      <th>Sat</th>
    </tr>
    `;
    getCalendar();
  };

  prev.addEventListener("click", () => {
    changeMonth(-1);
    header.innerHTML =
      new Intl.DateTimeFormat("en-US", { month: "long" }).format(date) +
      " - " +
      date.getFullYear();
  });
  next.addEventListener("click", () => {
    changeMonth(1);
    header.innerHTML =
      new Intl.DateTimeFormat("en-US", { month: "long" }).format(date) +
      " - " +
      date.getFullYear();
  });

  getCalendar();
};
