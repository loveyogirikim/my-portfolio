"""
사진을 images/카테고리/ 폴더에 넣고 이 스크립트를 실행하면
1) 사진을 웹에 적합한 크기로 줄여서 assets/photos/ 에 복사하고
2) gallery.json (사진 목록 파일)을 자동으로 만들어줍니다.

사용법 (터미널에서):
    python scripts/build_gallery.py

폴더 구조 예시:
    images/
      인물/   사진1.jpg, 사진2.png ...
      풍경/   사진3.jpg ...
      작업물/ 사진4.png ...

카테고리 폴더 이름은 자유롭게 바꿔도 됩니다 (새 폴더를 만들면 새 카테고리가 생겨요).
"""

import json
from pathlib import Path
from PIL import Image, ImageOps

# ---- 설정값 (필요하면 숫자만 바꿔도 됩니다) ----
ROOT = Path(__file__).resolve().parent.parent      # portfolio-site 폴더
IMAGES_DIR = ROOT / "images"                        # 원본 사진을 넣는 곳
OUTPUT_DIR = ROOT / "assets" / "photos"             # 웹용으로 줄인 사진이 저장되는 곳
GALLERY_JSON = ROOT / "gallery.json"                # 자동 생성되는 목록 파일

MAX_WIDTH = 1600     # 사진의 가로 최대 크기 (px). 이보다 크면 줄여요.
JPEG_QUALITY = 82     # 압축 품질 (1~100). 낮추면 용량이 작아지지만 화질도 떨어져요.
THUMB_WIDTH = 480     # 갤러리에서 보이는 작은 썸네일 크기
SUPPORTED_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def resize_and_save(src_path: Path, dst_path: Path, max_width: int):
    """src_path 사진을 max_width 이하로 줄여서 dst_path에 저장합니다."""
    with Image.open(src_path) as img:
        img = ImageOps.exif_transpose(img)  # 휴대폰 사진 회전 오류 방지
        img = img.convert("RGB")
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(dst_path, "JPEG", quality=JPEG_QUALITY, optimize=True)


def main():
    if not IMAGES_DIR.exists():
        print(f"[알림] {IMAGES_DIR} 폴더가 없어서 새로 만들었어요. 사진을 넣고 다시 실행해주세요.")
        IMAGES_DIR.mkdir(parents=True)
        return

    items = []
    category_folders = sorted([p for p in IMAGES_DIR.iterdir() if p.is_dir()])

    if not category_folders:
        print("[알림] images/ 안에 카테고리 폴더(예: 인물, 풍경, 작업물)가 없어요.")
        return

    for category_folder in category_folders:
        category_name = category_folder.name
        photo_files = sorted(
            p for p in category_folder.iterdir()
            if p.suffix.lower() in SUPPORTED_EXT
        )

        for index, photo_path in enumerate(photo_files, start=1):
            slug = f"{category_name}-{index:03d}"
            full_filename = f"{slug}-full.jpg"
            thumb_filename = f"{slug}-thumb.jpg"

            full_dst = OUTPUT_DIR / full_filename
            thumb_dst = OUTPUT_DIR / thumb_filename

            resize_and_save(photo_path, full_dst, MAX_WIDTH)
            resize_and_save(photo_path, thumb_dst, THUMB_WIDTH)

            with Image.open(full_dst) as final_img:
                width, height = final_img.size

            items.append({
                "id": slug,
                "title": photo_path.stem,
                "category": category_name,
                "full": f"assets/photos/{full_filename}",
                "thumb": f"assets/photos/{thumb_filename}",
                "width": width,
                "height": height,
            })

            print(f"  처리완료: {photo_path.name} -> {full_filename}")

    GALLERY_JSON.write_text(
        json.dumps(items, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"\n총 {len(items)}장의 사진을 처리했어요.")
    print(f"목록 파일을 만들었어요: {GALLERY_JSON}")


if __name__ == "__main__":
    main()
