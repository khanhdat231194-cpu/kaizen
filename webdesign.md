# Kaizen — nhật ký thiết kế web

Ghi lại toàn bộ việc đã làm, từ một ảnh bánh xe màu tới một site công khai có
hình động. Viết để đọc lại sau nhiều tháng: mỗi quyết định đều kèm **lý do**, và
phần cuối tách rõ **cái gì đã đo được** với **cái gì chỉ kiểm bằng đọc code** —
để không ai nhầm giả định thành sự thật đã kiểm chứng.

Ngày: 2026-09-20 · Repo: `khanhdat231194-cpu/kaizen` · 5 commit · 19 file

---

## Mạch việc

Bắt đầu từ bốn ảnh nền manga thể loại gym-motivation và một ảnh bánh xe màu, yêu
cầu đầu tiên là "một logo thương hiệu với độ sáng, độ bão hòa tự thay đổi được".
Mạch đi tiếp như sau:

1. Công cụ sinh logo với bánh xe màu và ba thanh trượt HSL → 6 phương án
2. Chốt phương án 05 "Đối Kính" với màu `#AA4946`
3. Trang nhận diện riêng cho phương án đó, kèm bảng thông số
4. Đưa lên GitHub Pages để có URL công khai
5. Bốn trang bích chương từ bốn ảnh, mỗi trang có bảng điều khiển chuyển động
6. Hiệu ứng hé thẻ theo bậc khi cuộn
7. Hero tràn lề dùng hình động Lottie

---

## URL đang sống

Công khai, không cần đăng nhập — `https://khanhdat231194-cpu.github.io/kaizen`

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang nhận diện logo Đối Kính |
| `/posters/` | Trang tổng: hero Lottie + 4 thẻ |
| `/posters/focus/` | Bích chương Focus |
| `/posters/artverse/` | Bích chương Artverse |
| `/posters/whynotme/` | Bích chương Why Not Me |
| `/posters/mevsme/` | Bích chương Me Vs Me |
| `/mark.svg` | Logo vector |
| `/assets/*.png` | 5 ảnh raster của logo |
| `/posters/hero.json` | Hình động Lottie |

Riêng tư trên claude.ai (phải bấm Share mới chia sẻ được):

| Artifact | Link |
| --- | --- |
| Xưởng Logo Kaizen | `claude.ai/artifact/9sbzXZEk9UsE3PD2dcrgeV` |
| Kaizen Đối Kính (v2) | `claude.ai/artifact/PUd3BrPUXCpEdk9w2fTzWL` |
| Bích chương Focus | `claude.ai/artifact/TzFtLLUTuYhwTdkEHq2k3A` |
| Bích chương Artverse | `claude.ai/artifact/H3VvtkE4rxJbTkGRxinRBS` |
| Bích chương Why Not Me | `claude.ai/artifact/PrXVSjMVaJ21RpuoYBb4UX` |
| Bích chương Me Vs Me | `claude.ai/artifact/FEog47MbhMRpfdF2AR1i4Q` |

---

## 1. Xưởng Logo — công cụ sinh nhận diện

Sáu phương án logo dựng từ **một** mã màu duy nhất, điều khiển bằng bánh xe màu
và ba thanh trượt HSL.

**Nguyên tắc nền tảng:** mọi sắc phụ trong logo đều là màu gốc **giảm mờ**, không
phải màu thứ hai. Kéo thanh trượt thế nào hệ thống cũng không lệch tông, và hạ độ
bão hòa về 0 là ra ngay bản đơn sắc.

Bánh xe vẽ bằng `<canvas>`, `putImageData` từng pixel: góc quay ra sắc độ, bán
kính ra độ bão hòa, tâm trắng — đúng cấu trúc ảnh bánh xe gốc. Vẽ lại theo độ
sáng hiện tại, chặn bằng `requestAnimationFrame` để kéo trượt không giật.

**Sáu phương án và nguồn cảm hứng:**

| | Phương án | Lấy từ |
| --- | --- | --- |
| 01 | Con dấu chính — chữ viết tắt khoét âm trong đĩa đặc, tia tốc độ | tinh thần manga ink |
| 02 | Neon Bar — nét đơn phát sáng, hình người hít xà | ảnh hít xà neon |
| 03 | Vòm cung — chữ uốn theo cung trên khối cơ lưng | ảnh FOCUS |
| 04 | Reps — tên lặp 3 lần như 3 set, set giữa ăn màu | ảnh WHY NOT ME? |
| 05 | Đối kính — tên lật ngược qua trục giữa, chip VS | ảnh ME VS ME |
| 06 | Ấn mực — triện hình thoi, tia tốc độ khoét âm | triện manga |

**Chi tiết của nghề, không phải trang trí:** công cụ tính tỷ lệ tương phản WCAG
giữa màu đang chọn và nền đang xem, gắn cờ vàng khi tụt dưới `3:1` — ngưỡng cho
hình khối phi văn bản. Hạ độ sáng quá tay là logo chìm vào nền mực, và chỗ này
bắt được ngay thay vì phát hiện lúc đã in.

---

## 2. Phương án 05 "Đối Kính" và trang nhận diện

Tên thương hiệu lật ngược qua trục giữa: nửa trái là mình hôm nay, nửa phải là
mình trong gương, chip VS hình thoi chốt điểm va.

Trang nhận diện gồm mark khổ lớn trên nền mực, **ba phép thử** mà một designer
luôn phải chạy trước khi chốt logo (nền giấy trắng, bản đơn sắc một mực, bản thu
về đúng 96px), bảng thông số, và sơ đồ khoảng thở.

**Thông số chốt:**

| | |
| --- | --- |
| Màu thương hiệu | `#AA4946` · `hsl(2 42% 47%)` |
| Tương phản trên nền mực | `3.6:1` — đạt mốc 3:1 |
| Bóng phản chiếu | `#AA4946` @ 62% → `#6C302F` hiệu dụng · `2.1:1` |
| Chip VS | 34×34, xoay 45°, tâm (200, 131) |
| Chữ chính | Anton 400 · 50px · tracking 0 |
| Slogan | Archivo 600 · 11px · tracking 5 |
| Khổ tối thiểu | 96px rộng, dưới mức này bỏ slogan |
| Khoảng thở | 1 × chip VS = 34px ở khổ 400px |

Sơ đồ khoảng thở ghi một điều dễ bỏ sót: **trục dọc vươn cao hơn hàng chữ, nên
chính nó — không phải chữ cái — là mép trên của mark.**

---

## 3. Bộ ảnh raster của logo

Năm file PNG trong `assets/`, render bằng `@resvg/resvg-js` với **file TTF nạp
trực tiếp** thay vì cài font vào Windows — không sửa registry, không đụng system
settings, mà chữ Anton vẫn render đúng.

| File | Khổ | Dùng cho |
| --- | --- | --- |
| `preview.png` | 1200×630 | thẻ `og:image` |
| `logo-for-dark.png` | 1200×750, nền trong | logo trên nền tối |
| `logo-for-light.png` | 1200×750, nền trong | logo trên nền sáng |
| `icon-512.png` | 512×512, nền mực | avatar |
| `icon-512-transparent.png` | 512×512, nền trong | avatar nền tùy ý |

Icon vuông là bố cục riêng — `K` và `K` phản chiếu quanh chip VS — vì wordmark
nằm ngang không bao giờ đọc được trong khung vuông.

---

## 4. Bốn trang bích chương

Bốn trang độc lập, mỗi trang một URL, sinh từ **một template duy nhất** để hành
vi và chất lượng thống nhất; sửa một lần là áp cho cả bốn.

**Chuyển động và ánh sáng**, tất cả chạy trong **một** vòng `requestAnimationFrame`
chứ không phải nhiều animation CSS đánh nhau:

- **Nghiêng theo con trỏ** — ảnh nghiêng trong không gian 3D, có quán tính (hệ số
  làm mượt `0.075`) nên dừng mềm chứ không giật
- **Tự lắc nhẹ** — ba trục lệch pha nhau (`0.9` / `0.62` / `0.41` Hz) cộng một
  nhịp trôi dọc, nên không bao giờ về đúng vị trí cũ và mắt không thấy chu kỳ lặp
- **Đèn rê** — vùng sáng radial bám con trỏ, hoà trộn `screen`; bỏ chuột ra thì
  đèn tự trôi vòng chậm
- **Vệt sáng quét** — dải sáng chéo 104°, hoà trộn `overlay`
- **Hào quang viền** — quầng màu nhấn hắt sau khung, như bích chương được rọi đèn
  từ phía sau
- **Hạt nhiễu** (`feTurbulence` nhúng data-URI) và **tối viền**

**Bảng cài đặt:** 4 công tắc, 8 thanh trượt, 3 preset (Tĩnh / Nhẹ / Mạnh), nút
Đặt lại. Hàng nào đang vô hiệu thì **mờ đi** thay vì im lặng không tác dụng.
Thiết lập lưu `localStorage` theo từng trang. Có nút Ẩn giao diện để còn trơ bích
chương, Esc để hiện lại.

Màu nhấn lấy từ chính mỗi ảnh: Focus trắng lạnh `#DCE3E8`, Artverse đỏ mặt nạ
`#C8342B`, Why Not Me trắng `#EDEDED`, Me Vs Me xám thép `#A9B2B8`.

---

## 5. Hé thẻ theo bậc khi cuộn

Hai hàng thẻ — 4 thẻ ở trang tổng, 3 thẻ "Ba phép thử" ở trang logo — mờ dần và
trượt lên lần lượt khi hàng vào tầm nhìn.

| | |
| --- | --- |
| Bậc giữa các thẻ | `120ms` |
| Thời lượng mỗi thẻ | `520ms` |
| Đường cong | `cubic-bezier(.16, 1, .3, 1)` |
| Hàng 3 thẻ kết thúc ở | `0.76s` |
| Hàng 4 thẻ kết thúc ở | `0.88s` |

**Chỉ chạy một lần**, hai chốt độc lập: cờ `dataset.revealed` chặn lặp, và
`observer.unobserve()` gọi ngay trong lần khớp đầu.

**Ba lớp bảo đảm nội dung không bao giờ mắc kẹt vô hình** — quan trọng hơn cả
hiệu ứng:

1. Trạng thái ẩn **chỉ tồn tại sau khi JS gắn class `reveal-on`** lên `<html>`.
   Không JS, JS chết, hay không có `IntersectionObserver` thì thẻ hiện bình thường.
2. Bật giảm chuyển động thì JS **không gắn observer, cũng không gắn `reveal-on`** —
   thẻ hiện ngay từ khung hình đầu. Thêm một `@media (prefers-reduced-motion)`
   dự phòng cho trường hợp đổi thiết lập sau khi tải.
3. Chốt chặn cuối: nếu observer không hề gọi callback lần nào thì hiện hết.

Sau khi animation xong, hàng nhận class `is-done` để **nhả `animation` ra**, trả
`transform` về cho hiệu ứng hover. Không làm bước này thì `animation-fill-mode:
both` giữ giá trị cuối và hover chết.

---

## 6. Hero tràn lề với hình động Lottie

Link tài sản được cung cấp ban đầu (`/kaizen/posters/`) là **một trang HTML**,
không phải scene Spline, `.glb`, `.riv` hay Lottie JSON — không runtime nào nạp
được. Nên `hero.json` là **file tự tác giả** theo schema Lottie 5.12.2, dựng từ
ngôn ngữ hình đã có của thương hiệu.

| | |
| --- | --- |
| Kích thước | 1600×900 · 13 lớp · 10.8 KB |
| Thời lượng | 90 khung @ 30fps = 3 giây, vòng lặp liền mạch |
| Runtime | `lottie-web` 5.12.2 từ cdnjs, renderer SVG |

**Vòng lặp liền mạch** nhờ mỗi tia tốc độ là một lớp riêng lệch pha bằng `ip`/`op`,
nên không có điểm nhảy khi quay lại khung 0.

**Vì sao `lottie-web` chứ không `lottie-react`:** site là HTML tĩnh, không có
React. Kéo React vào chỉ để bọc một component là thêm ~140KB cho đúng một thứ.
`lottie-web` chính là runtime nằm bên trong `lottie-react`.

**Bố cục:** hero tràn lề cao `clamp(420px, 64vh, 660px)`, tiêu đề chồng lên trên.
Hai lớp chuyển màu tối phía sau chữ — một lớp ngang (đậm bên trái nơi có chữ,
nhạt dần sang phải nơi có hình) và một lớp dọc từ dưới lên. Cụm hình trong Lottie
cũng dịch sang phải (`MX = 980`) để không nằm dưới tiêu đề.

**Hiệu suất:**

- Dưới `768px` hoặc bật giảm chuyển động: **không tải thư viện lẫn JSON**, giữ
  `hero-poster.png`
- Tải muộn qua `requestIdleCallback` sau sự kiện `load`, không tranh lần vẽ đầu
- Trình tải là một vạch 38px, tắt ngay khi `DOMLoaded`
- Tạm dừng khi hero ra khỏi tầm nhìn hoặc tab bị ẩn
- **Mọi nhánh thất bại đều để áp phích tĩnh ở lại**, không bỏ spinner treo

Áp phích tĩnh render từ **cùng dữ liệu hình học**, chốt ở khung 45, nên bản tĩnh
và bản động không lệch nhau.

Nguồn dữ liệu tách thành biến `DATA` trong `posters/index.html` — có file `.riv`
hay scene Spline thật thì đổi một dòng.

---

## Lỗi đã tìm ra và sửa

Phần đáng giá nhất của nhật ký này. Tất cả đều là lỗi **chỉ lộ ra khi kiểm tra
thật**, không phải khi đọc code.

**1. SVG xuất ra không có nền.** Chữ phụ tô `#F4F5F7` ở opacity 0.22 trên nền mực
thì đúng, nhưng dán vào Figma trên canvas trắng là gần như vô hình. Nặng hơn:
phương án 01 và 06 tô chữ khoét âm và tia tốc độ bằng **chính màu nền**, thiếu nền
là mất luôn hình. Sửa: nạp thẻ `<rect>` nền vào mã xuất ra.

**2. Chip VS cấn 2px vào chân chữ.** Bản gốc đặt chữ ở `x=178`, chip chiếm tới
`x=176`. Chồng lấn đúng 2px luôn trông như lỗi chứ không như chủ ý. Sửa: đẩy chữ
về `x=168`, chip có khoảng thở 8px mỗi bên.

**3. Màu nhấn đỏ không đủ tương phản cho chữ nhỏ.** Trang Artverse dùng `#C8342B`
đặt lên nền panel tối chỉ được `3.4:1` — dưới ngưỡng 4.5:1 cho chữ nhỏ. Sửa: tách
một token màu riêng `--accent-ui` (`#E8756C`) cho chữ giao diện, giữ màu gốc cho
hiệu ứng sáng.

**4. Chốt chặn hé thẻ nổ sai lúc.** Document ẩn thì trình duyệt đóng băng `rAF`,
CSS animation, và không giao callback `IntersectionObserver`. Chốt chặn 2 giây cũ
không phân biệt được "observer hỏng" với "trang đang ở tab nền", nên nó hiện phẳng
hàng thẻ sau lưng người dùng và animation mất hẳn khi họ bấm sang tab. Sửa: chốt
chặn chỉ chạy khi `visibilityState` là `visible`, nếu đang ẩn thì hoãn tới sự kiện
`visibilitychange` rồi hẹn lại.

**5. Lottie không có blur nên mọi thứ "ánh sáng" ra cạnh cứng.** Quầng hào quang
định làm đèn nền ra thành một vệt bầu dục nâu to đùng; vệt sáng quét ra thành tấm
chéo phẳng. Cả hai đọc ra như *vật thể*, không phải như sáng. Sửa: bỏ quầng bầu
dục, chuyển vệt quét sang `gf` gradient fill với alpha `0 → 0.16 → 0`.

**6. Thiếu `charset=utf-8` là tiếng Việt vỡ.** Artifact tự thêm `<head>` hộ, file
tĩnh thì không ai thêm hộ. Mọi trang xuất sang GitHub Pages đều phải bọc lại
`<head>` đầy đủ.

**7. Bẫy suýt mắc khi đồng bộ artifact.** File artifact đã có sẵn
`@media (prefers-reduced-motion){*{animation:none !important}}`. Nếu chỉ chèn quy
tắc `opacity:0` mà không kèm khối media riêng, thẻ sẽ **ẩn vĩnh viễn** với người
bật giảm chuyển động: animation bị `!important` chặn mà `opacity` không ai đưa về
1. Đã bịt bằng khối media có độ ưu tiên cao hơn `*`.

---

## Đã đo được so với chỉ đọc code

**Đo trực tiếp trên Chrome thật:**

- Độ trễ bậc thang `0` / `0.12` / `0.24s`, thời lượng `0.52s` mỗi thẻ, đường cong
  easing — đọc từ computed style
- Quy tắc CSS parse đúng và selector khớp — đọc từ CSSOM
- Ba đối tượng animation được tạo đủ cho ba thẻ
- Tất cả URL trả `200`, `hero.json` trả `application/json` (sai MIME là
  `lottie-web` bỏ), `hero-poster.png` trả `image/png`
- JSON tải từ server rồi parse lại: `v=5.12.2`, `1600×900`, `fr=30`, 13 lớp
- Tiếng Việt render đúng dấu trên mọi trang

**Chỉ kiểm bằng đọc code, chưa chạy thử:**

- Việc hé thẻ kích hoạt đúng lúc cuộn tới
- Việc hé thẻ chỉ chạy một lần
- Hình động Lottie chạy mượt
- Nhánh giảm chuyển động

**Lý do cụ thể:** khung xem trong app Claude là một document ở trạng thái `hidden`.
Đã đo được `rafTicksIn1s: 0`, và ba animation `playState: "running"` nhưng
`currentTime` đứng ở `0`. Ở đó Chrome đóng băng `rAF`, đồng hồ animation, và
`IntersectionObserver` — cả observer đơn giản nhất (`threshold: 0`, không
`rootMargin`, không dính code nào của trang) cũng không được gọi lần nào.

**Cách tự xác nhận trong 10 giây** — mở trang, bấm F12, dán vào Console rồi cuộn
ra cuộn vào nhiều lần; con số phải dừng lại và không tăng nữa:

```js
const row=document.querySelector('.reveal-row');let n=0;row.addEventListener('animationstart',()=>n++);setInterval(()=>console.log('animationstart:',n,'| revealed:',row.dataset.revealed),1000)
```

---

## Ngăn xếp kỹ thuật

| | |
| --- | --- |
| Trang | HTML tĩnh, không framework, không bước build |
| Chữ | Anton (display), Archivo (thân), JetBrains Mono (số liệu) — Google Fonts |
| Hình động | `lottie-web` 5.12.2 từ cdnjs; phần còn lại là CSS và `rAF` thuần |
| Render raster | `@resvg/resvg-js` với TTF nạp trực tiếp |
| Hosting | GitHub Pages, `https_enforced: true` |

---

## Việc còn mở

**1. Slogan trong bộ PNG ra weight 400 thay vì 600.** Do tải Archivo bản variable
mà resvg không nội suy được trục weight. Nhìn vẫn ổn, chỉ mảnh hơn thiết kế. Sửa
bằng cách lấy bản static của Archivo.

**2. Bóng phản chiếu trong logo ở `2.1:1`.** Đây là lựa chọn thiết kế chưa chốt,
không phải lỗi: bản chất nó là *cái bóng* nên chìm hơn là đúng, nhưng ở mức 2.1
thì hơi quá chìm với màu đỏ gạch trầm này. Hai cách: nâng độ sáng màu gốc lên
khoảng 60% và bão hòa lên ~70%, hoặc giữ nguyên màu và cho bóng chạy opacity 1.0.

**3. Script sinh tài sản nằm ngoài repo.** Các script tạo `hero.json`,
`hero-poster.svg`, bộ PNG, và bốn trang bích chương đang ở thư mục tạm của session
chứ không trong repo. **Session kết thúc là mất.** Nếu muốn tái tạo hoặc chỉnh tài
sản sau này thì cần chuyển chúng vào `tools/` trong repo — hiện chỉ có kết quả
đã render, không có công cụ render.

**4. Bản quyền bốn ảnh bích chương.** Ảnh Artverse là nhân vật của Marvel; ba ảnh
còn lại là tranh của tác giả khác. Chúng đang nằm trên URL công khai. Dùng riêng
thì không sao, nhưng nếu dùng cho mục đích thương mại thì cần tự kiểm tra quyền.

---

## Lịch sử commit

| Mã | Nội dung |
| --- | --- |
| `9d8840e` | trang nhận diện logo Đối Kính |
| `bd519ee` | bốn trang bích chương sống và bộ ảnh logo |
| `0d79dd0` | hé thẻ theo bậc khi hàng cuộn vào tầm nhìn |
| `30d75f8` | chốt chặn hé thẻ phải đợi trang được xem |
| `1e2dbf4` | hero tràn lề dùng hình động Lottie ở trang tổng |
