# Komponen Tambahan v2

Dokumen ini menjelaskan komponen, utilitas, dan aturan aksesibilitas yang ditambahkan di `v2/`.
Contoh langsung ada di `v2/style-guide.html` (lengkap dengan tombol **Salin**).

## Kapan dipakai / tidak dipakai

| Komponen | Pakai untuk | Jangan dipakai untuk |
|---|---|---|
| `navbar--collapsible` | Navigasi situs yang harus muat di mobile | Navigasi bertingkat/mega-menu |
| `accordion` | FAQ, detail yang jarang dibaca | Konten utama yang harus selalu terlihat |
| `switch` | Pengaturan yang langsung berlaku (on/off) | Pilihan yang butuh tombol Simpan (pakai checkbox) |
| `dropdown` | Daftar aksi pendek (3-7 item) | Navigasi utama, atau isian form (pakai `select`) |
| `avatar` / `avatar-group` | Identitas pengguna/anggota tim | Ikon dekoratif |
| `empty-state` | Daftar/tabel yang belum berisi data | Pesan galat (pakai `alert--danger`) |
| `skeleton` | Placeholder saat memuat data | Loading singkat (< 300 ms) |
| `DasaUI.toast` | Konfirmasi singkat setelah aksi | Pesan penting yang wajib dibaca (pakai `alert`) |

## Navbar responsif

Tambahkan `.navbar--collapsible`, sebuah checkbox `.navbar__toggle-input`, dan label `.navbar__toggle`
(`aria-label="Menu"`). Di bawah 768px menu disembunyikan dan dibuka lewat hamburger, tanpa JavaScript.
Dengan `dasa-ui.js`, tombol Escape dan klik pada link menutup menu. `id` checkbox harus unik per halaman.

## Accordion

Gunakan `<div class="accordion">` berisi `<details>`. Atribut `name` yang sama pada tiap `<details>`
membuat hanya satu panel terbuka (didukung browser modern; browser lama tetap menampilkan semua bisa dibuka).

## Switch, Dropdown, Avatar

- `switch`: `<label class="switch"><input type="checkbox" role="switch"> Label</label>`.
- `dropdown`: `<details class="dropdown">`; tambah `.dropdown--end` agar menu rata kanan. Menu ditutup saat
  klik di luar atau Escape bila `dasa-ui.js` dimuat.
- `avatar`: ukuran `--sm`, bawaan (40px), `--lg`; boleh berisi `<img alt="">`.

## Toast

```js
DasaUI.toast("Data tersimpan", { type: "success", title: "Berhasil", duration: 5000 });
```

`type`: `info`, `success`, `warning`, `danger`. `duration: 0` = tidak tertutup otomatis.
`position`: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` (bawaan), atau `center`.
Ubah posisi bawaan sekali dengan `DasaUI.toast.position = "top-center"`. Toast dengan posisi berbeda ditumpuk
di wadah masing-masing. Di bawah 480px semua posisi dipusatkan secara horizontal agar tidak terpotong.
 Teks disisipkan
dengan `textContent`, jadi aman dari XSS. Wadah `.toast-region` dibuat otomatis (`role="status"`).

## Utilitas

`.stack`, `.cluster`, `.cluster--between`, `.cluster--end`, `.text-center`, `.text-muted`,
`.visually-hidden`, `.hide-mobile` (sembunyi < 768px), `.show-mobile` (sembunyi >= 768px).
Atur jarak dengan `.stack--sm|lg` atau variabel `--stack-gap` / `--cluster-gap`.

## Aksesibilitas

- Semua elemen interaktif memakai `:focus-visible` (cincin biru 3px).
- `prefers-reduced-motion` mematikan animasi dan transisi.
- Oranye `#FF5F00` hanya sekitar 3:1 di atas putih. Untuk **teks** oranye di latar terang pakai
  `var(--color-brand-secondary-text)` (`#C24100`, sekitar 5.2:1). `.eyebrow` dan `.badge--secondary` sudah memakainya.
  Tombol oranye dengan teks putih tebal memenuhi AA hanya untuk teks besar (>= 18px); gunakan `btn--lg` bila perlu.

## Penamaan (alias)

| Baru (disarankan) | Lama (tetap berfungsi) | Arti |
|---|---|---|
| `.btn--cta` | `.btn--primary` | Tombol oranye (aksi utama/CTA) |
| `.btn--brand` | `.btn--secondary` | Tombol biru |
| `.card--narrow` | `.card--form` | Kartu 40rem |
| `.card--wide` | `.card--form.card--wide` | Kartu 56rem |

## Pesan masalah umum

| Gejala | Penyebab | Solusi |
|---|---|---|
| Hamburger tidak muncul | Lebar >= 768px, atau kelas `navbar--collapsible` tidak ada | Perkecil jendela / tambahkan kelas |
| Menu hamburger tidak terbuka | `for` label tidak cocok dengan `id` checkbox | Samakan `id` dan `for` |
| `DasaUI is not defined` | `dasa-ui.js` belum dimuat | Tambahkan `<script src="dasa-ui.js" defer>` |
| Toast muncul di posisi tak terduga | `position` salah ketik (tidak ada di daftar) | Pakai salah satu dari 7 nilai di atas |
| Toast tidak hilang sendiri | `duration: 0` | Beri durasi > 0 |


## Style guide: daftar isi

Di 2/style-guide.html daftar isi tampil sebagai **sidebar kiri** pada layar >= 1024px (bagian aktif disorot saat menggulir)
dan sebagai bar horizontal yang menempel di atas pada mobile/tablet.
