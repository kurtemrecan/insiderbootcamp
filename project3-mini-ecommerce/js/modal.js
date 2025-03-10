$(document).ready(function () {
  $.fancybox.defaults.touch = false;
  $.fancybox.defaults.autoFocus = false;
  $.fancybox.defaults.closeExisting = true;
  $.fancybox.defaults.animationEffect = 'fade';
  $.fancybox.defaults.transitionEffect = 'fade';
  $.fancybox.defaults.startTop = 0;
  $.fancybox.defaults.centerOnScroll = true;

  $(document).on('click', '.product-card', function () {
    const productId = $(this).data('id');
    showProductModal(productId);
  });

  $('.btn-cart').on('click', function () {
    showCartModal();
  });

  $('.btn-favorite').on('click', function (event) {
    event.preventDefault();
    showFavoritesModal();
  });
});

//product modal
function showProductModal(productId) {
  $.getJSON(
    `https://fakestoreapi.com/products/${productId}`,
    function (product) {
      $.fancybox.open({
        src: `
        <div class="product-modal">
          <div class="product-modal-image">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="product-modal-content">
            <h4>${product.title}</h4>
            <p class="price">${product.price} TL</p>
            <p class="description">${product.description}</p>
            <div class="modal-buttons">
              <button onclick="event.stopPropagation(); addToCart(${product.id})" class="btn-add">
                <i class="fas fa-shopping-cart"></i> Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      `,
        type: 'html',
        opts: {
          touch: false,
          smallBtn: false,
          buttons: ['close'],
        },
      });
    }
  );
}

//favorites modal
function showFavoritesModal() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.length === 0) {
    $('.favorites-items').html(
      '<div class="empty-favorites">Favori ürününüz bulunmuyor</div>'
    );
  } else {
    let favoritesContent = '';
    let completedRequests = 0; // istekleri takip etmek için

    favorites.forEach((productId) => {
      $.getJSON(`https://fakestoreapi.com/products/${productId}`)
        .done(function (product) {
          favoritesContent += `
            <div class="favorite-item" data-id="${productId}">
              <img src="${product.image}" alt="${product.title}">
              <div class="favorite-item-details">
                <h4>${product.title}</h4>
                <p class="price">${product.price} TL</p>
              </div>
              <button onclick="event.stopPropagation(); removeFromFavorites(event, ${productId})" class="remove-favorite">
                <i class="fas fa-times"></i>
              </button>
            </div>
          `;
        })
        .fail(function () {
          favoritesContent += `
            <div class="favorite-item error" data-id="${productId}">
              <p>Ürün yüklenemedi.</p>
            </div>
          `;
        })
        .always(function () {
          completedRequests++;
          if (completedRequests === favorites.length) {
            updateFavoritesDisplay(favoritesContent); // istek bitince gncelleniyor
          }
        });
    });
  }
}

function updateFavoritesDisplay(content) {
  $.fancybox.open({
    src: `<div class="favorites-modal">
            <h3>Favorilerim</h3>
            <div class="favorites-items">
              ${content}
            </div>
          </div>`,
    type: 'html',
    opts: {
      touch: false,
      smallBtn: false,
      buttons: ['close'],
    },
  });
}

// sepet modalı

function showCartModal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartContent = '';
  let total = 0;

  if (cart.length === 0) {
    cartContent = '<div class="empty-cart">Sepetiniz boş</div>';
  } else {
    cart.forEach((item) => {
      $.getJSON(
        `https://fakestoreapi.com/products/${item}`,
        function (product) {
          cartContent += `
          <div class="cart-item" data-id="${item}">
            <img src="${product.image}" alt="${product.title}">
            <div class="cart-item-details">
              <h4>${product.title}</h4>
              <p class="price">${product.price} TL</p>
            </div>
            <button onclick="event.stopPropagation(); removeFromCart(${item})" class="remove-item">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
          total += product.price;
          updateCartDisplay(cartContent, total);
        }
      );
    });
  }
}

function updateCartDisplay(content, total) {
  $.fancybox.open({
    src: `
      <div class="cart-modal">
        <h3>Sepetim</h3>
        <div class="cart-items">
          ${content}
        </div>
        <div class="cart-total">
          <p>Toplam: ${total.toFixed(2)} TL</p>
          <button onclick="event.stopPropagation(); clearCart()" class="btn-clear">Sepeti Temizle</button>
        </div>
      </div>
    `,
    type: 'html',
    opts: {
      touch: false,
      smallBtn: false,
      buttons: ['close'],
    },
  });
}
