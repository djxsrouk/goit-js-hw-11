import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios";
import Notiflix from 'notiflix';

async function searchImages(query, page = 1) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '42681042-634726b01ed7a51263412d6da',
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: page,
          per_page: 200,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
  
  function showTotalImages(totalHits) {
    if (totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    } else {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
  
  function showEndOfResults() {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  
  function displayImages(images) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
  
    images.forEach(image => {
      const photoCard = document.createElement('div');
      photoCard.classList.add('photo-card');
      photoCard.innerHTML = `<a href="${image.largeImageURL}" data-lightbox="image">
      <img src="${image.webformatURL}" alt="${image.tag}" loading="lazy"> 
      </a>
      <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>`;
      gallery.appendChild(photoCard);
    });
  
    const lightbox = new SimpleLightbox('.gallery a', {});
    lightbox.refresh();
  }
  
  async function handleSearch(e) {
    e.preventDefault();
    const searchQuery = e.target.searchQuery.value.trim();
    if (searchQuery === "") {
      Notiflix.Notify.failure("Please enter a search query.");
      return;
    }
  
    try {
      Notiflix.Loading.standard("Searching for images...");
      const searchData = await searchImages(searchQuery);
      if (searchData.hits.length === 0) {
        showEndOfResults();
      } else {
        displayImages(searchData.hits);
        showTotalImages(searchData.totalHits);
      }
    } catch (error) {
      Notiflix.Notify.failure(error.message);
    } finally {
      Notiflix.Loading.remove();
    }
  }
  
  async function handleLoadMore(event) {
    event.preventDefault();
    const searchQuery = document.getElementById("searchQuery").value.trim();
    const currentPage = parseInt(event.target.dataset.page);
    const nextPage = currentPage + 1;
  
    try {
      Notiflix.Loading.standard("Searching for images...");
      const searchData = await searchImages(searchQuery, nextPage);
      if (searchData.hits.length === 0) {
        showEndOfResults();
      } else {
        displayImages(searchData.hits);
        event.target.dataset.page = nextPage;
      }
    } catch (error) {
      Notiflix.Notify.failure(error.message);
    } finally {
      Notiflix.Loading.remove();
    }
  }
  
  function initializeApp() {
    const searchForm = document.getElementById("search-form");
    const loadMore = document.querySelector(".load-more");
  
    searchForm.addEventListener("submit", handleSearch);
    loadMore.addEventListener("click", handleLoadMore);
    loadMore.style.display = "none";
  }
  
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
  
  function smoothScrollToGallery() {
      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }
  
  
  initializeApp();
  smoothScrollToGallery();