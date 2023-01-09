import axios from 'axios';
import Notiflix from 'notiflix';

class ServiceAPI {
  constructor() {
    this.searchData = '';
    this.pageValue = 1;
  }

  async getPiaxabay() {
    const KEY_API = 'key=22160943-514fc90dc5a1a6996be2229bd';
    const URL = 'https://pixabay.com/api/';

    const { data } = await axios.get(
      `${URL}?${KEY_API}&q=${this.searchData}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pageValue}&per_page=40`
    );
    return data;
  }
}
const serviceAPI = new ServiceAPI();

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSubmitForm);
refs.loadMore.addEventListener('click', onClickloadMore);
refs.loadMore.classList.add('is-load-more');

function responseProcessing() {
  serviceAPI
    .getPiaxabay()
    .then(data => {
      const images = data.hits;
      const numberImages = data.totalHits;
      const numberEl = images.length;

      let mathVlue = numberImages - serviceAPI.pageValue * numberEl;
      console.log(mathVlue);

      if (mathVlue <= 0) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }

      serviceAPI.pageValue += 1;

      renderCared(images);
    })
    .catch(err => {
      console.log(err);
    });
}

const cardTemplate = image =>
  `<div class="photo-card">
  <img src="${image.webformatURL}" 
    alt="${image.tags}" 
    loading="lazy"
    width="320px"
    height="320px"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="info-value">${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="info-value">${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="info-value">${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="info-value">${image.downloads}</span>
    </p>
  </div>
</div>`;

function onSubmitForm(e) {
  e.preventDefault();

  const formEl = e.currentTarget.elements;
  const searchData = formEl.searchQuery.value.trim();

  if (searchData === '') {
    return;
  }

  serviceAPI.searchData = searchData;
  responseProcessing();
}

function renderCared(images) {
  if (images.length === 0) {
    refs.gallery.innerHTML = '';
    serviceAPI.pageValue = 1;

    refs.loadMore.classList.add('is-load-more');

    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  refs.loadMore.classList.remove('is-load-more');

  const imagesEl = images.map(image => {
    return cardTemplate(image);
  });

  refs.gallery.insertAdjacentHTML('beforeend', imagesEl.join(''));
}

function onClickloadMore(e) {
  e.preventDefault();
  responseProcessing();
}
