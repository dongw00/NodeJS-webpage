var boardNum = 0;
/* Category Ajax prototype */
function Category(element) {
  this.element = element;
  this.ctgUrl = `/board/category?boardNum=`;
  this.categoryEvt();
}

Category.prototype = {
  categoryEvt: function() {
    this.element.addEventListener('click', evt => {
      if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
        this.categoryAnchor(evt.target);
      }
    });
  },
  categoryAnchor: function(target) {
    document.querySelector('.anchor.active').classList.remove('active');

    if (target.tagName === 'A') {
      boardNum = target.parentElement.dataset.category;
      target.classList.add('active');
    } else {
      boardNum = target.parentElement.parentElement.dataset.category;
      target.parentElement.classList.add('active');
    }
    if (document.querySelector('tbody') != null)
      document.querySelector('tbody').remove();
    this.fetchData();
  },
  fetchData: function() {
    if (this.ctgUrl == null) this.ctgUrl = `/board/category?boardNum=`;
    const ctgUrl = `${this.ctgUrl}${boardNum}`;

    fetch(ctgUrl)
      .then(res => res.json())
      .then(data => this.addData(data))
      .catch(err => console.log('Fetch Error!', err));
  },
  addData: function(json) {
    const tbody = document.createElement('tbody');
    document.querySelector('table').appendChild(tbody);
    json.forEach(el => {
      const trInfo = document.createElement('tr');
      const trEl = document.createElement('tr');
      trInfo.className = 'info d-flex';
      trEl.className = 'd-flex';
      if (el.important == 1) {
        trInfo.innerHTML = this.templer(el);
        tbody.prepend(trInfo);
      } else {
        trEl.innerHTML = this.templer(el);
        tbody.appendChild(trEl);
      }
    });
  },
  templer: function(el) {
    const date = moment(el.date).format('YYYY년 MM월 DD일 HH:mm');
    const data = `
      <td class="col-1">${el.important == 0 ? el._id : '공지'}</td>
      <td class="col-5">
        <a href="/board/Detail_view?id=${el._id}">
          ${el.title}</a>
      </td>
      <td class="col-2">
        ${el.writer}
      </td>
      <td class="col-3">
        ${date}
      </td>
      <td class="col-1">
        ${el.count}
      </td>
    `;
    return data;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  /* Switching category */
  console.log('DOMContentLoaded');
  const ctg = document.getElementById('category_row');
  new Category(ctg);
  Category.prototype.fetchData();
});
