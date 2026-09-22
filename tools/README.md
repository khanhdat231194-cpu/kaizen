# tools — script sinh tài sản cho site Kaizen

Mọi thứ ở đây từng nằm trong thư mục tạm của một phiên làm việc, và sẽ mất khi phiên
đó kết thúc. Đưa vào repo để có thể dựng lại tài sản — PNG logo, hình động Lottie, video
màn mở đầu — mà không phải làm lại từ đầu.

## Đọc cái này trước

**File HTML trong repo là nguồn chuẩn, không phải các script ở đây.** Các trang đã được
sinh ra rồi vá thêm nhiều lượt. Một số bản vá được chạy thẳng dạng lệnh và **không lưu
lại** (sửa chốt chặn hé thẻ theo `visibilityState`, điền thẻ `og:image`, bọc `<head>` cho
trang logo). Vì vậy chạy lại toàn bộ chuỗi script **không** tái tạo đúng site hiện tại.

Muốn sửa trang thì sửa thẳng file HTML. Dùng script ở đây để dựng lại **tài sản**.

## Cài đặt

```bash
cd tools
npm install
```

Video cần thêm `ffmpeg` và `ffprobe`. Trên Windows: `winget install Gyan.FFmpeg`.

## Các thư mục

| Thư mục | Sinh ra | Chạy |
| --- | --- | --- |
| `logo-assets/` | 5 file PNG trong `assets/` | `npm run logo` |
| `hero/` | `posters/hero.json` và `posters/hero-poster.png` | `npm run hero` |
| `video/` | `posters/intro.mp4` và `posters/intro-poster.webp` | `video/build.sh "<video gốc>"` |
| `posters/` | Bốn trang bích chương | xem cảnh báo bên dưới |
| `patches/` | Không sinh gì — đã áp dụng xong | chỉ để lưu vết |
| `artifacts/` | Mã nguồn các trang artifact trên claude.ai | mở trực tiếp |

## logo-assets

Render logo Đối Kính ra PNG bằng `@resvg/resvg-js`, **nạp font TTF trực tiếp** thay vì cài
vào Windows. Font Anton và Archivo dùng giấy phép SIL Open Font License, văn bản giấy phép
nằm cạnh file font.

Slogan ra weight 400 thay vì 600 vì Archivo ở đây là bản variable, resvg không nội suy
được trục weight. Muốn đúng 600 thì thay bằng bản static.

## hero

`gen-hero.js` tác giả file Lottie 13 lớp từ ngôn ngữ hình của thương hiệu, và đồng thời
sinh `hero-poster.svg` từ **cùng dữ liệu hình học**, chốt ở khung 45 — nên ảnh tĩnh khớp
với hình động. `render-poster.js` render SVG đó ra PNG.

Lottie không có blur: mọi thứ định làm "ánh sáng" bằng fill phẳng sẽ ra cạnh cứng. Vệt
sáng quét dùng `gf` gradient fill có alpha tắt dần hai đầu vì lý do đó.

## video

`build.sh` chạy năm bước từ video gốc Dreamina:

1. Tách frame
2. `clean.js` — xoá cánh tay thừa **ở từng frame** bằng gán nhãn vùng liên thông, giữ
   khối tối lớn nhất. Vùng xoá tô bằng trung vị nền theo từng hàng, không phải màu phẳng.
3. `dedupe.js` — bỏ frame lặp. Video khai 60fps nhưng chuyển động thật chỉ ~24fps.
4. Nội suy lên 60fps bằng `minterpolate` chế độ `mci`, ra `posters/intro.mp4`
5. `crossfade.js` — bản lặp một hướng, tuỳ chọn, không dùng trên site

**Video gốc không nằm trong repo** (15 MB, ở ngoài). Phải truyền đường dẫn vào.

`crossfade.js` tự tìm điểm khép vòng. Với video hiện tại: frame 202, lệch điểm nối từ
50,30 xuống 6,29. Đổi video khác thì con số khác — script sẽ in ra.

## posters — cảnh báo

`gen.js` sinh bốn trang từ `template.html`. `build-site.js` bọc chúng rồi **ghi đè toàn bộ
thư mục `posters/`**, kể cả trang tổng.

Chạy nó là **xoá** mọi thứ làm sau đó: hé thẻ, hero Lottie, con trỏ dấu ấn, màn mở đầu.
Nên nó từ chối chạy nếu không có `--force`. Ảnh gốc: bỏ vào `posters/src/<key>.jpg` thì
dùng, không thì giữ `art.jpg` đang có.

## patches

Bốn bản vá đã áp vào site, theo thứ tự: `patch-reveal` → `patch-hero` → `patch-cursor` →
`patch-intro`. Mỗi cái tự bỏ qua nếu đã áp rồi. Giữ lại để biết code trong trang từ đâu ra.

## artifacts

| File | Là |
| --- | --- |
| `logo-forge.html` | Xưởng logo 6 phương án với bánh xe màu |
| `doi-kinh-page.html` | Trang nhận diện Đối Kính |
| `video-sample.html` | Mẫu các cách phối nền video |

Bốn artifact bích chương được sinh từ `posters/template.html` qua `gen.js`.
