// 営業提案デモ用の簡易パスワードです。本番納品時はこのロック処理とHTMLのpassword-gate、noindexを削除してください。
// 正式なセキュリティではなく、URL共有先をゆるく限定するための簡易保護です。
const DEMO_PASSWORD = "namiki";
const PASSWORD_SESSION_KEY = "namikiDemoUnlocked";

const shops = [
  {
    name: "ラーメン並木 新南陽本店",
    address: "山口県周南市清水2-6-12",
    hours: "平日 11:00-14:00 / 17:00-21:00、土日祝 11:00-15:00 / 17:00-21:00",
    closed: "年中無休、臨時休業あり",
    phone: "0834-34-0888",
    instagram: "https://www.instagram.com/explore/search/keyword/?q=ラーメン並木新南陽本店",
    photoGuide: "店舗外観写真。のれんや看板が見える、初めての人でも場所が分かる写真"
  },
  {
    name: "ラーメン並木 防府店",
    address: "山口県防府市新田581-3",
    hours: "平日 11:00-14:00、土日祝 11:00-15:00",
    closed: "年中無休、臨時休業あり",
    phone: "0835-28-9855",
    instagram: "https://www.instagram.com/explore/search/keyword/?q=ラーメン並木防府店",
    photoGuide: "店舗外観写真。駐車場や入口の雰囲気が分かる写真"
  },
  {
    name: "拉麺 徳ちゃん",
    address: "山口県周南市鼓海1-324-18",
    hours: "9:00-15:00",
    closed: "木曜定休",
    phone: "0834-34-1528",
    instagram: "https://www.instagram.com/explore/search/keyword/?q=拉麺徳ちゃん",
    photoGuide: "のれん、看板写真。市場近くのお店らしさが伝わる写真"
  }
];

const menuItems = [
  {
    category: "ramen",
    name: "ラーメン",
    description: "迷ったらまずこれ。ふだんのお昼にも選びやすい定番の一杯。",
    price: "要確認",
    photoGuide: "ラーメン正面写真"
  },
  {
    category: "ramen",
    name: "チャーシューメン",
    description: "しっかり食べたい日にうれしい、満足感のある一杯。",
    price: "要確認",
    photoGuide: "チャーシューメン写真"
  },
  {
    category: "set",
    name: "セットメニュー",
    description: "仕事帰りや家族での食事にも選びやすい、満腹向けメニュー。",
    price: "要確認",
    photoGuide: "セットメニュー写真"
  },
  {
    category: "side",
    name: "餃子",
    description: "ラーメンと一緒に頼みたい、気軽な定番サイド。",
    price: "要確認",
    photoGuide: "餃子写真"
  },
  {
    category: "side",
    name: "唐揚げ",
    description: "お持ち帰りにも合わせやすい、食べ応えのある一品。",
    price: "要確認",
    photoGuide: "唐揚げ写真"
  },
  {
    category: "rice",
    name: "ご飯もの",
    description: "ラーメンと一緒に、もう少し食べたい時にぴったり。",
    price: "要確認",
    photoGuide: "ご飯もの写真、または家族連れでも入りやすい店内写真"
  }
];

const newsItems = [
  {
    date: "2026.05.17",
    title: "営業時間のお知らせ",
    body: "最新の営業時間や臨時休業は、各店舗SNSでもご確認いただけます。"
  },
  {
    date: "2026.05.17",
    title: "限定メニューのお知らせ",
    body: "季節限定や店舗限定メニューを掲載できるエリアです。写真付き更新にも対応しやすい構成です。"
  },
  {
    date: "2026.05.17",
    title: "採用情報のお知らせ",
    body: "ホール・キッチンスタッフを募集中。詳しくはページ下部の採用情報をご覧ください。"
  }
];

const shopList = document.querySelector("#shop-list");
const menuList = document.querySelector("#menu-list");
const newsList = document.querySelector("#news-list");
const tabButtons = document.querySelectorAll(".tab-button");
const backToTop = document.querySelector(".back-to-top");
const socialSection = document.querySelector("#social-preview");
const socialTrack = document.querySelector("#social-track");
const socialCards = [...document.querySelectorAll("[data-social-card]")];
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const passwordGate = document.querySelector("#password-gate");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password-input");
const passwordError = document.querySelector("#password-error");

let currentSocialIndex = 0;
let socialTimer = null;
let instaTimer = null;
let currentInstaIndex = 0;

function unlockDemo() {
  sessionStorage.setItem(PASSWORD_SESSION_KEY, "true");
  passwordGate?.classList.add("is-unlocked");
}

if (sessionStorage.getItem(PASSWORD_SESSION_KEY) === "true") {
  passwordGate?.classList.add("is-unlocked");
} else {
  passwordInput?.focus();
}

passwordForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value === DEMO_PASSWORD) {
    passwordError.textContent = "";
    unlockDemo();
    return;
  }

  passwordError.textContent = "パスワードが違います。";
  passwordInput.select();
});

function mapUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function telUrl(phone) {
  return `tel:${phone.replaceAll("-", "")}`;
}

function renderShops() {
  shopList.innerHTML = shops.map((shop) => `
    <article class="shop-card">
      <div class="shop-visual">
        <div class="photo-note">ここに入れると良い素材：${shop.photoGuide}</div>
      </div>
      <div class="shop-body">
        <h3 class="shop-name">${shop.name}</h3>
        <div class="shop-meta">
          <div><strong>住所</strong>${shop.address}</div>
          <div class="shop-hours"><strong>営業時間</strong>${shop.hours}</div>
          <div><strong>定休日</strong>${shop.closed}</div>
          <div><strong>電話番号</strong><span class="nowrap-copy">${shop.phone}</span></div>
        </div>
        <div class="card-actions">
          <a class="map" href="${mapUrl(shop.address)}" target="_blank" rel="noopener">地図を見る</a>
          <a class="tel" href="${telUrl(shop.phone)}">電話する</a>
          <a class="sns" href="${shop.instagram}" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderMenu(category = "all") {
  const filteredItems = category === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === category);

  menuList.innerHTML = filteredItems.map((item) => `
    <article class="menu-card" data-category="${item.category}">
      <div class="menu-image">
        <div class="photo-note">ここに入れると良い素材：${item.photoGuide}</div>
      </div>
      <div class="menu-body">
        <h3 class="menu-name">${item.name}</h3>
        <p>${item.description}</p>
        <span class="price">${item.price}</span>
      </div>
    </article>
  `).join("");
}

function renderNews() {
  newsList.innerHTML = newsItems.map((item) => `
    <article class="news-card">
      <time datetime="${item.date.replaceAll(".", "-")}">${item.date}</time>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `).join("");
}

function setSocialCard(index, shouldScroll = true) {
  if (!socialCards.length) return;
  currentSocialIndex = (index + socialCards.length) % socialCards.length;
  socialCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === currentSocialIndex);
  });

  if (shouldScroll && window.innerWidth < 980) {
    const activeCard = socialCards[currentSocialIndex];
    const targetLeft = activeCard.offsetLeft - (socialTrack.clientWidth - activeCard.clientWidth) / 2;

    socialTrack.scrollTo({
      left: targetLeft,
      behavior: motionQuery.matches ? "auto" : "smooth"
    });
  }
}

function startSocialCarousel() {
  if (motionQuery.matches || socialTimer || window.innerWidth >= 980) return;
  socialTimer = window.setInterval(() => {
    setSocialCard(currentSocialIndex + 1);
  }, 4200);
}

function stopSocialCarousel() {
  window.clearInterval(socialTimer);
  socialTimer = null;
}

function startInstagramPreview() {
  const slides = [...document.querySelectorAll(".insta-slide")];
  if (motionQuery.matches || instaTimer || !slides.length) return;
  instaTimer = window.setInterval(() => {
    slides[currentInstaIndex].classList.remove("is-current");
    currentInstaIndex = (currentInstaIndex + 1) % slides.length;
    slides[currentInstaIndex].classList.add("is-current");
  }, 2200);
}

function stopInstagramPreview() {
  window.clearInterval(instaTimer);
  instaTimer = null;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.category);
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: motionQuery.matches ? "auto" : "smooth" });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

prevButton?.addEventListener("click", () => {
  stopSocialCarousel();
  setSocialCard(currentSocialIndex - 1);
  startSocialCarousel();
});

nextButton?.addEventListener("click", () => {
  stopSocialCarousel();
  setSocialCard(currentSocialIndex + 1);
  startSocialCarousel();
});

socialTrack?.addEventListener("scroll", () => {
  if (window.innerWidth >= 980) return;
  const trackCenter = socialTrack.scrollLeft + socialTrack.clientWidth / 2;
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  socialCards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    const distance = Math.abs(trackCenter - cardCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  setSocialCard(nearestIndex, false);
});

if (socialSection) {
  const socialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        socialSection.classList.add("is-visible");
        startInstagramPreview();
        startSocialCarousel();
      } else {
        stopSocialCarousel();
        stopInstagramPreview();
      }
    });
  }, { threshold: 0.25 });

  socialObserver.observe(socialSection);
}

renderShops();
renderMenu();
renderNews();
setSocialCard(0, false);
