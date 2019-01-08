"use strict";

var boardNum = 0;
/* Category Ajax prototype */

function Category(element) {
  this.element = element;
  this.ctgUrl = "/board/category?boardNum=";
  this.categoryEvt();
}

Category.prototype = {
  categoryEvt: function categoryEvt() {
    var _this = this;

    this.element.addEventListener('click', function (evt) {
      if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
        _this.categoryAnchor(evt.target);
      }
    });
  },
  categoryAnchor: function categoryAnchor(target) {
    document.querySelector('.anchor.active').classList.remove('active');

    if (target.tagName === 'A') {
      boardNum = target.parentElement.dataset.category;
      target.classList.add('active');
    } else {
      boardNum = target.parentElement.parentElement.dataset.category;
      target.parentElement.classList.add('active');
    }

    if (document.querySelector('tbody') != null) document.querySelector('tbody').remove();
    this.fetchData();
  },
  fetchData: function fetchData() {
    var _this2 = this;

    if (this.ctgUrl == null) this.ctgUrl = "/board/category?boardNum=";
    var ctgUrl = "".concat(this.ctgUrl).concat(boardNum);
    fetch(ctgUrl).then(function (res) {
      return res.json();
    }).then(function (data) {
      return _this2.addData(data);
    }).catch(function (err) {
      return console.log('Fetch Error!', err);
    });
  },
  addData: function addData(json) {
    var _this3 = this;

    var tbody = document.createElement('tbody');
    document.querySelector('table').appendChild(tbody);
    json.forEach(function (el) {
      var trInfo = document.createElement('tr');
      var trEl = document.createElement('tr');
      trInfo.className = 'info';
      trEl.className = '';

      if (el.important == 1) {
        trInfo.innerHTML = _this3.templer(el);
        tbody.prepend(trInfo);
      } else {
        trEl.innerHTML = _this3.templer(el);
        tbody.appendChild(trEl);
      }
    });
  },
  templer: function templer(el) {
    var date = moment(el.date).format('YYYY년 MM월 DD일 HH:mm');
    var data = "\n      <td>".concat(el.important == 0 ? el._id : '공지', "</td>\n      <td>\n        <a href=\"/board/Detail_view?id=").concat(el._id, "\">\n          ").concat(el.title, "</a>\n      </td>\n      <td>\n        ").concat(el.writer, "\n      </td>\n      <td>\n        ").concat(date, "\n      </td>\n      <td>\n        ").concat(el.count, "\n      </td>\n    ");
    return data;
  }
};
document.addEventListener('DOMContentLoaded', function () {
  /* Switching category */
  console.log('DOMContentLoaded');
  var ctg = document.getElementById('category_row');
  new Category(ctg);
  Category.prototype.fetchData();
});