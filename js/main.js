// =========================================================
// 포트폴리오 갤러리 스크립트
// gallery.json을 읽어서 화면에 사진을 그려주고,
// 필터 / 라이트박스 / 다크모드 기능을 담당합니다.
// =========================================================

const galleryEl = document.getElementById("gallery");
const filterBar = document.getElementById("filter-bar");
const emptyMessage = document.getElementById("empty-message");

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lb-image");
const lbCaption = document.getElementById("lb-caption");
const lbClose = document.getElementById("lb-close");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");

let allPhotos = [];      // gallery.json 전체 내용
let visiblePhotos = [];  // 현재 필터에 맞게 화면에 보이는 사진들
let currentIndex = 0;    // 라이트박스에서 몇 번째 사진을 보고 있는지

// ---------------------------------------------------------
// 1. 데이터 불러오기
// ---------------------------------------------------------
async function loadGallery() {
  try {
    const res = await fetch("gallery.json", { cache: "no-store" });
    if (!res.ok) throw new Error("gallery.json을 불러오지 못했어요.");
    allPhotos = await res.json();
  } catch (err) {
    console.error(err);
    allPhotos = [];
  }

  buildFilterButtons();
  renderGallery("전체");
}

// ---------------------------------------------------------
// 2. 카테고리 필터 버튼을 사진 목록 기준으로 자동 생성
// ---------------------------------------------------------
function buildFilterButtons() {
  const categories = [...new Set(allPhotos.map((p) => p.category))];

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = cat;
    btn.textContent = cat;
    filterBar.appendChild(btn);
  });

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filterBar.querySelectorAll(".filter-btn").forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");

    renderGallery(btn.dataset.filter);
  });
}

// ---------------------------------------------------------
// 3. 갤러리 그리기
// ---------------------------------------------------------
function renderGallery(filter) {
  visiblePhotos =
    filter === "전체"
      ? allPhotos
      : allPhotos.filter((p) => p.category === filter);

  galleryEl.innerHTML = "";
  emptyMessage.hidden = visiblePhotos.length > 0;

  visiblePhotos.forEach((photo, index) => {
    const item = document.createElement("figure");
    item.className = "gallery-item";
    item.style.animationDelay = `${Math.min(index * 0.04, 0.6)}s`;

    const frame = document.createElement("div");
    frame.className = "frame";

    const img = document.createElement("img");
    img.src = photo.thumb;
    img.alt = photo.title;
    img.loading = "lazy";
    frame.appendChild(img);

    const caption = document.createElement("figcaption");
    caption.className = "caption";
    caption.innerHTML = `<span class="title">${photo.title}</span><span class="cat-tag">${photo.category}</span>`;

    item.appendChild(frame);
    item.appendChild(caption);
    item.addEventListener("click", () => openLightbox(index));

    galleryEl.appendChild(item);
  });
}

// ---------------------------------------------------------
// 4. 라이트박스 (사진 크게 보기 + 좌우 넘기기)
// ---------------------------------------------------------
function openLightbox(index) {
  currentIndex = index;
  showPhotoAt(currentIndex);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

function showPhotoAt(index) {
  const photo = visiblePhotos[index];
  if (!photo) return;
  lbImage.src = photo.full;
  lbImage.alt = photo.title;
  lbCaption.textContent = `${photo.title}  ·  ${photo.category}`;
}

function showNext() {
  currentIndex = (currentIndex + 1) % visiblePhotos.length;
  showPhotoAt(currentIndex);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
  showPhotoAt(currentIndex);
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

// 모바일에서 스와이프로 좌우 넘기기
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
lightbox.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) < 40) return;
  diff > 0 ? showPrev() : showNext();
});

// ---------------------------------------------------------
// 5. 다크모드 전환 (선택한 모드는 다음 방문 때도 기억돼요)
// ---------------------------------------------------------
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("portfolio-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("portfolio-theme", "dark");
  }
});

// ---------------------------------------------------------
// 시작!
// ---------------------------------------------------------
loadGallery();
