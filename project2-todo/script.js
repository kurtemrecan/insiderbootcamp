const form = document.getElementById('gorevForm');
const gorevListesi = document.getElementById('gorevListesi');
const hataMesaji = document.getElementById('hata-mesaji');
const tamamlananlariGoster = document.getElementById('tamamlananlariGoster');
const onceligeGoreSirala = document.getElementById('onceligeGoreSirala');

// görevleri tutacağımız dizi
let gorevler = [];
let sadeceTamamlananlar = false;
const oncelikDeger = {
  Düşük: 1,
  Orta: 2,
  Yüksek: 3,
};
/*******************/
//form gönderme işlemi
form.addEventListener('submit', function (e) {
  e.preventDefault();
  try {
    const baslik = document.getElementById('baslik').value;
    const aciklama = document.getElementById('aciklama').value;
    const oncelik = document.querySelector('input[name="oncelik"]:checked');

    if (!baslik) throw new Error('Başlık alanı zorunludur!');
    if (!oncelik) throw new Error('Öncelik seçmelisiniz!');

    hataMesaji.textContent = '';

    const yeniGorev = {
      id: Date.now(),
      baslik: baslik,
      aciklama: aciklama,
      oncelik: oncelik.value,
      tamamlandi: false,
    };
    gorevler.push(yeniGorev);
    form.reset();
    gorevleriGoster();
  } catch (error) {
    hataMesaji.textContent = error.message;
  }
});

/**************/
// görevleri ekrana yazdırmak için
function gorevleriGoster() {
  let gosterilecekGorevler = sadeceTamamlananlar
    ? gorevler.filter((gorev) => gorev.tamamlandi)
    : gorevler;

  gorevListesi.textContent = '';

  if (gosterilecekGorevler.length === 0) {
    const bosMesaj = document.createElement('p');
    bosMesaj.textContent = 'Henüz eklenmiş bir görev yok.';
    bosMesaj.classList.add('bos-liste-mesaji'); //css
    gorevListesi.appendChild(bosMesaj);
    return;
  }

  // her görevi ekrana eklek için
  gosterilecekGorevler.forEach(function (gorev) {
    const li = document.createElement('li');
    li.className = 'gorev-item' + (gorev.tamamlandi ? ' tamamlandi' : '');

    // Görev içeriği için div
    const icerikDiv = document.createElement('div');

    // başlık
    const baslik = document.createElement('h3');
    baslik.textContent = gorev.baslik;
    icerikDiv.appendChild(baslik);

    // açıklama
    const aciklama = document.createElement('p');
    aciklama.textContent = gorev.aciklama;
    icerikDiv.appendChild(aciklama);

    // öncelik butonları
    const oncelik = document.createElement('span');
    oncelik.textContent = 'Öncelik: ' + gorev.oncelik;
    icerikDiv.appendChild(oncelik);

    // butonlar için div
    const butonlarDiv = document.createElement('div');

    // tamamla butonu
    const tamamlaBtn = document.createElement('button');
    tamamlaBtn.textContent = gorev.tamamlandi ? 'Geri Al' : 'Tamamla';
    tamamlaBtn.onclick = (event) => {
      event.stopPropagation(); //eventin üst elementlere yayılmasını engelledik
      gorevTamamla(gorev.id);
    };
    butonlarDiv.appendChild(tamamlaBtn);

    // sil butonu
    const silBtn = document.createElement('button');
    silBtn.textContent = 'Sil';
    silBtn.onclick = (event) => {
      event.stopPropagation(); //eventin üst elementlere yayılmasını engelledik
      gorevSil(gorev.id);
    };
    butonlarDiv.appendChild(silBtn);

    li.appendChild(icerikDiv);
    li.appendChild(butonlarDiv);

    gorevListesi.appendChild(li);
  });
}

// görev tamamlama fonk
function gorevTamamla(id) {
  const gorev = gorevler.find((g) => g.id === id);
  if (gorev) {
    gorev.tamamlandi = !gorev.tamamlandi;
    gorevleriGoster();
  }
}

// görev silme fonk
function gorevSil(id) {
  gorevler = gorevler.filter((gorev) => gorev.id !== id);
  gorevleriGoster();
}

// tamamlananlara göre sıralalma
tamamlananlariGoster.addEventListener('click', function () {
  sadeceTamamlananlar = !sadeceTamamlananlar;
  this.textContent = sadeceTamamlananlar
    ? 'Tüm Görevleri Göster'
    : 'Sadece Tamamlananları Göster';
  gorevleriGoster();
});
/******************* */
// önceliğe göre sıralama
let onemliOlanlarOnce = true;

onceligeGoreSirala.addEventListener('click', function () {
  console.log('Clicked');

  if (onemliOlanlarOnce) {
    gorevler.sort((a, b) => oncelikDeger[b.oncelik] - oncelikDeger[a.oncelik]);
    onceligeGoreSirala.textContent = 'Önemsizleri önce sırala';
  } else {
    gorevler.sort((a, b) => oncelikDeger[a.oncelik] - oncelikDeger[b.oncelik]);
    onceligeGoreSirala.textContent = 'Önemlileri önce sırala';
  }

  onemliOlanlarOnce = !onemliOlanlarOnce;

  gorevleriGoster();
});

document.addEventListener('DOMContentLoaded', gorevleriGoster);
