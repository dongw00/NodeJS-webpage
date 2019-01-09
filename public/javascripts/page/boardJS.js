var boardNum = 0;
var bool = true;
/* Category Ajax prototype */
function Category(element) {
  this.element = element;
  this.ctgUrl = `/board/category?boardNum=`;
  this.categoryEvt();
}

Category.prototype = {
  categoryEvt: function() {
    this.element.addEventListener('click', evt => {
      if (evt.target.tagName === 'A') {
        boardNum = evt.target.parentNode.dataset.category;
        this.fetchData();
      } else if (evt.target.tagName === 'SPAN') {
        boardNum = evt.target.parentNode.parentNode.dataset.category;
        this.fetchData();
      }
    });
  },
  fetchData: function() {
    const parsedUrl = new URL(window.location.href);
    if (parsedUrl.searchParams.get('boardNum') != null && bool) {
      boardNum = parsedUrl.searchParams.get('boardNum');
      bool = false;
    }

    if (this.ctgUrl == null) this.ctgUrl = `/board/category?boardNum=`;
    const ctgUrl = `${this.ctgUrl}${boardNum}`;

    this.categoryAnchor(boardNum);

    fetch(ctgUrl)
      .then(res => res.json())
      .then(data => this.addData(data))
      .catch(err => console.log('Fetch Error!', err));
  },
  categoryAnchor: function(num) {
    if (document.querySelector('.anchor.active') != null)
      document.querySelector('.anchor.active').classList.remove('active');
    document
      .querySelector(`li[data-category='${num}'`)
      .firstElementChild.classList.add('active');
    if (document.querySelector('tbody') != null)
      document.querySelector('tbody').remove();
  },
  addData: function(json) {
    const tbody = document.createElement('tbody');
    document.querySelector('table').appendChild(tbody);
    json.forEach(el => {
      const trInfo = document.createElement('tr');
      const trEl = document.createElement('tr');
      trInfo.className = 'info';
      trEl.className = '';
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
      <td>${el.important == 0 ? el._id : '공지'}</td>
      <td>
        <a href="/board/Detail_view?id=${el._id}">
          ${el.title}</a>
      </td>
      <td>
        ${el.writer}
      </td>
      <td>
        ${date}
      </td>
      <td>
        ${el.count}
      </td>
    `;
    return data;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  /* Switching category */
  const ctg = document.getElementById('category_row');
  new Category(ctg);
  Category.prototype.fetchData();
});
