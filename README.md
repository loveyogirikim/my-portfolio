# 내 사진으로 만드는 웹 포트폴리오

코딩을 몰라도 사진만 폴더에 넣으면 자동으로 갤러리가 만들어지는 개인 포트폴리오 사이트입니다.

```
portfolio-site/
├── index.html              ← 화면 구조 (이름/소개/연락처 수정은 여기)
├── css/style.css            ← 디자인(색, 폰트, 여백)
├── js/main.js                ← 갤러리/필터/라이트박스/다크모드 동작
├── images/                   ← ✏️ 여기에 원본 사진을 넣습니다 (카테고리별 폴더)
│   ├── 인물/
│   ├── 풍경/
│   └── 작업물/
├── assets/photos/             ← 빌드 스크립트가 만든 "웹용으로 줄인 사진" (자동 생성, 직접 건들 필요 없음)
├── gallery.json               ← 사진 목록 데이터 (자동 생성, 직접 건들 필요 없음)
└── scripts/build_gallery.py   ← 사진을 읽어서 위 두 가지를 만들어주는 파이썬 스크립트
```

---

## 1. 내 사진 넣는 법

### 1) 사진을 카테고리 폴더에 넣기

`images/` 폴더 안에 `인물`, `풍경`, `작업물` 폴더가 이미 있어요.
원하는 카테고리 폴더에 사진 파일(`.jpg`, `.jpeg`, `.png`, `.webp`)을 그대로 끌어다 놓으세요.

- 카테고리를 더 만들고 싶다면 `images/` 안에 새 폴더를 만들면 됩니다.
  예: `images/여행/` 폴더를 만들면 "여행"이라는 필터 버튼이 자동으로 생겨요.
- 지금 들어있는 `sample-` 로 시작하는 사진들은 화면 확인용 테스트 사진이에요. 본인 사진으로 채운 뒤 자유롭게 지워도 됩니다.

### 2) 빌드 스크립트 실행하기

터미널(명령 프롬프트)을 열고 `portfolio-site` 폴더로 이동한 뒤 아래 명령을 입력합니다.

```bash
python scripts/build_gallery.py
```

이 명령이 하는 일:
1. `images/` 폴더 안의 모든 카테고리 폴더를 훑어봅니다.
2. 사진이 너무 크면 웹에 보기 좋은 크기로 자동으로 줄입니다 (원본 사진은 그대로 보존돼요. 줄인 사진은 `assets/photos/`에 별도로 저장됩니다).
3. `gallery.json`이라는 사진 목록 파일을 새로 만듭니다.

사진을 추가하거나 뺄 때마다 이 명령을 다시 실행하면 갤러리가 최신 상태로 반영됩니다.

### 3) 화면으로 확인하기

`gallery.json`을 `fetch`로 불러오기 때문에, `index.html` 파일을 더블클릭해서 직접 열면 사진이 보이지 않을 수 있어요(브라우저 보안 정책). 아래처럼 간단한 로컬 서버를 켜서 확인하세요.

```bash
cd portfolio-site
python -m http.server 8000
```

그 다음 브라우저에서 `http://localhost:8000` 으로 접속하면 됩니다.

---

## 2. 내가 직접 바꿔야 할 부분

`index.html` 파일을 열어서 아래 표시가 있는 부분을 찾아 본인 정보로 바꿔주세요.

| 위치 | 찾는 표시 | 바꿀 내용 |
|---|---|---|
| 헤더 | `✏️ 여기를 바꾸세요 1` | 이름, 한 줄 소개 (`name`, `tagline` 텍스트) |
| About | `✏️ 여기를 바꾸세요 2` | 자기소개 문장 |
| Contact | `✏️ 여기를 바꾸세요 3` | 이메일 주소, Instagram/GitHub 링크 |

`css/style.css` 맨 위 `--accent` 값을 바꾸면 사이트 전체의 포인트 색상도 바꿀 수 있어요.

---

## 3. GitHub Pages로 무료 배포하는 법

GitHub Pages를 쓰면 만든 사이트를 인터넷에 무료로 올려서 누구나 링크로 볼 수 있게 만들 수 있어요.

### 1) GitHub 계정 & 저장소(repository) 만들기

1. [github.com](https://github.com) 에서 계정을 만듭니다 (이미 있다면 로그인).
2. 오른쪽 위 `+` 버튼 → `New repository` 클릭.
3. 저장소 이름을 정합니다. 예: `my-portfolio`
4. `Create repository` 클릭.

### 2) 내 컴퓨터의 폴더를 GitHub에 올리기

터미널에서 `portfolio-site` 폴더로 이동한 뒤 아래 명령을 순서대로 입력합니다. (`사용자명`, `저장소이름`은 본인 것으로 바꿔주세요)

```bash
git init
git add .
git commit -m "포트폴리오 사이트 첫 업로드"
git branch -M main
git remote add origin https://github.com/사용자명/저장소이름.git
git push -u origin main
```

### 3) GitHub Pages 켜기

1. 깃허브 저장소 페이지로 이동 → 상단의 `Settings` 클릭.
2. 왼쪽 메뉴에서 `Pages` 클릭.
3. `Branch` 항목에서 `main`을 선택하고 폴더는 `/ (root)`로 둔 뒤 `Save` 클릭.
4. 잠시 기다리면 화면에 `https://사용자명.github.io/저장소이름/` 형태의 주소가 나타납니다. 이 주소가 내 포트폴리오 사이트 링크예요!

### 4) 사진을 새로 추가했을 때

1. 로컬에서 `images/카테고리/`에 사진 추가 → `python scripts/build_gallery.py` 실행
2. 아래 명령으로 다시 업로드

```bash
git add .
git commit -m "사진 추가"
git push
```

몇 분 안에 실제 사이트에도 새 사진이 반영됩니다.

---

## 자주 묻는 질문

**Q. 사진을 넣었는데 갤러리에 안 보여요.**
A. `python scripts/build_gallery.py`를 다시 실행했는지 확인하세요. 또한 `index.html`을 직접 더블클릭해서 열면 안 되고, 로컬 서버(`python -m http.server`)로 열어야 해요.

**Q. 사진 용량이 너무 커요 / 사이트가 느려요.**
A. 빌드 스크립트가 자동으로 가로 1600px 이하로 줄여줍니다. 더 작게 하고 싶다면 `scripts/build_gallery.py` 안의 `MAX_WIDTH` 값을 줄여보세요.

**Q. 카테고리 순서를 바꾸고 싶어요.**
A. 현재는 `images/` 폴더 이름의 가나다순으로 정렬됩니다. 폴더 이름 앞에 숫자를 붙이면(`1_인물`, `2_풍경`처럼) 원하는 순서로 정렬할 수 있어요. (이 경우 `js/main.js`의 카테고리 표시 이름도 폴더명과 같이 보이니 참고하세요.)
