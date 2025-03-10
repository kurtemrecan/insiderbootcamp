$(document).ready(function () {
  let currentPage = 1;
  const productsPerPage = 6;
  let allProducts = [];
  let searchTimeout;
  let originalProducts = [];

  updateFavoritesCount();
  updateCartCount();

  // sayfa yüklendiğinde ürünleri yüklemek için
  loadProducts();

  $('#loadMore').click(function () {
    currentPage++;
    displayProducts();
  });

  // arama input & debounce
  $('.search-input').on('input', function () {
    const searchTerm = $(this).val().toLowerCase();

    if (searchTerm === '') {
      // arama alanı boşsa orijinal ürünleri gösterir
      allProducts = [...originalProducts];
      currentPage = 1;
      displayProducts();
      return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterProducts(searchTerm);
    }, 300);
  });

  $('.search-button').on('click', function (e) {
    e.preventDefault();
    const searchTerm = $('.search-input').val().toLowerCase();
    filterProducts(searchTerm);
  });

  function loadProducts() {
    $.getJSON('https://fakestoreapi.com/products', function (products) {
      allProducts = products;
      originalProducts = [...products]; // orijinal ürünleri saklar
      displayProducts();
    });
  }

  // ürünleri filtreler
  function filterProducts(searchTerm) {
    const filteredProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
    $('#productList').empty();
    currentPage = 1;
    allProducts = filteredProducts;
    displayProducts();
  }

  // ürünleri göster
  function displayProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = allProducts.slice(startIndex, endIndex);

    productsToShow.forEach((product) => {
      const isFavorite = isProductFavorite(product.id);
      $('#productList').append(`
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <div class="card-content">
            <h3>${product.title}</h3>
            <p class="price">${product.price} TL</p>
            <div class="card-buttons">
              <button class="btn-add" onclick="event.stopPropagation(); addToCart(${
                product.id
              })">
                <i class="fas fa-shopping-cart"></i> Sepete Ekle
              </button>
              <button class="btn-favorite ${
                isFavorite ? 'active' : ''
              }" onclick="event.stopPropagation(); addToFavorites(${
        product.id
      })">
                <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>
              </button>
            </div>
          </div>
        </div>
      `);
    });

    if (endIndex >= allProducts.length) {
      $('#loadMore').hide();
    } else {
      $('#loadMore').show();
    }
  }
});

// favori işlemleri
function addToFavorites(productId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.indexOf(productId);

  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesCount();
  updateFavoriteButton(productId);
  showFavoritesModal();
}

function isProductFavorite(productId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(productId);
}

function updateFavoritesCount() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  $('.favorite-count').text(favorites.length);
}

function updateFavoriteButton(productId) {
  const button = $(`.product-card[data-id="${productId}"] .btn-favorite`);
  const isFavorite = isProductFavorite(productId);

  button.toggleClass('active');
  button.find('i').toggleClass('fa-heart far fa-heart fas');
}

// sepet işlemleri
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.includes(productId)) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter((id) => id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartModal();
}

function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
  $.fancybox.close();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  $('.cart-count').text(cart.length);
}
