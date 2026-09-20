# Kaizen — Đối Kính (trang nhận diện logo)

Site tĩnh hoàn chỉnh: 2 file, không cần server, không cần cài gì, không cần bước build.

```
index.html   trang nhận diện
mark.svg     file logo vector (cũng là link tải trên trang)
```

Mở thử trước khi đăng: bấm đúp vào `index.html`.

## Cách 1 — GitHub Pages (miễn phí, không giới hạn thời gian)

1. Vào <https://github.com/new>, đặt tên repo (ví dụ `kaizen-logo`), chọn **Public**, bấm *Create repository*.
2. Ở trang repo vừa tạo, bấm **uploading an existing file**, rồi kéo cả `index.html` và `mark.svg` vào. Bấm *Commit changes*.
3. Vào **Settings → Pages**. Ở *Source* chọn **Deploy from a branch**, branch **main**, folder **/ (root)**, bấm *Save*.
4. Chờ khoảng 1 phút rồi tải lại trang Settings → Pages, URL công khai sẽ hiện ở đầu trang:

   ```
   https://<tên-github-của-bạn>.github.io/kaizen-logo/
   ```

   File logo truy cập trực tiếp được ở `.../kaizen-logo/mark.svg`.

Không cần dùng dòng lệnh ở bất cứ bước nào. Ai có link đều xem được, không cần đăng nhập.

## Cách 2 — Cloudflare Pages hoặc Netlify

Cả hai đều có gói miễn phí và cho kéo-thả thẳng cả thư mục:

- Cloudflare Pages: *Create a project → Direct Upload*, kéo thư mục này vào.
- Netlify: *Add new site → Deploy manually*, kéo thư mục này vào.

Ưu điểm so với GitHub Pages: gắn được tên miền riêng dễ hơn và có HTTPS sẵn cho domain của bạn.

## Muốn gắn tên miền riêng

Cả ba dịch vụ trên đều hỗ trợ custom domain miễn phí ở gói free — bạn chỉ trả tiền tên miền (khoảng 10–15 USD/năm). Trỏ bản ghi CNAME của tên miền về địa chỉ mà dịch vụ cung cấp, rồi khai domain đó trong phần Settings của dự án.

## Còn thiếu một thứ

Thẻ `og:image` trong `index.html` đang để trống (có comment hướng dẫn ở dòng đầu file). Khi nào có URL cố định, hãy xuất một ảnh **PNG** khổ 1200×630 của logo, đặt tên `preview.png`, để cạnh `index.html` rồi bỏ comment thẻ đó ra và điền URL tuyệt đối. Các mạng xã hội hầu hết không đọc được SVG cho ảnh preview, nên bắt buộc phải là PNG hoặc JPG nếu bạn muốn link có thẻ hình khi chia sẻ.

## Lưu ý về font

Chữ trong `mark.svg` vẫn là text sống, phụ thuộc font **Anton** và **Archivo** (miễn phí trên Google Fonts). Trang web tự tải font nên hiển thị đúng. Nhưng nếu gửi file cho nhà in hoặc mở trên máy chưa có font, phải convert text sang path trước.
