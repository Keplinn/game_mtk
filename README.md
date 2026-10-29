# 🏛️ Relic Hunter: The Ancient Temple of Mathema (2D Edition)
### Game Edukasi Matematika Interaktif 2D: Fungsi Linear, Komposisi Fungsi, & Fungsi Invers

Aplikasi game edukasi matematika interaktif bertema petualangan arkeologi kuil kuno dengan grafis **2 Dimensi (2D)**. Siswa mengendalikan karakter arkeolog di dalam kuil, mendekati batu prasasti untuk memecahkan sandi aljabar, membuka pintu batu raksasa, dan menembus 4 level kamar kuil untuk menemukan **Relik Suci**.

---

## 📁 Struktur File Modular
Kode telah dipisahkan secara rapi dan modular:
* 📁 **[`assets/`](file:///c:/Users/MKSiahaan/Documents/ProjekYangDibuat/Game%20MTK/assets/)**: Asset pixel-art autentik kuil kuno:
  * `character.png`: Lembar sprite animasi karakter arkeolog (idle napas, gerak jalan 4 arah, dan selebrasi membawa relik emas).
  * `props.png`: Peti harta karun, kunci kuno, lempengan jebakan duri, rune listrik, dan kristal perisai.
  * `tileset.png`: Lantai batu, dinding kuil, dan pintu kuno.
* 📄 **[`index.html`](file:///c:/Users/MKSiahaan/Documents/ProjekYangDibuat/Game%20MTK/index.html)**: Struktur antarmuka HTML5, viewport Kanvas 2D, HUD indikator darah (❤️), dan dialog modal.
* 🎨 **[`style.css`](file:///c:/Users/MKSiahaan/Documents/ProjekYangDibuat/Game%20MTK/style.css)**: Desain visual kuil kuno, efek api obor, partikel, getaran layar jebakan (*screen shake*), dan kontrol sentuh mobile.
* ⚙️ **[`game.js`](file:///c:/Users/MKSiahaan/Documents/ProjekYangDibuat/Game%20MTK/game.js)**: Mesin 2D Canvas (animasi karakter pixel-art, fisika benturan, sistem jebakan dinamis dan penalti waktu, pencahayaan radial obor, animasi pintu geser, bank soal enkripsi/invers matematika, serta audio synthesizer Web Audio API).
* 📖 **[`README.md`](file:///c:/Users/MKSiahaan/Documents/ProjekYangDibuat/Game%20MTK/README.md)**: Dokumentasi panduan kontrol dan alur permainan.

---

## 🎮 Kontrol Permainan 2D

| Aksi | Keyboard (Komputer / Laptop) | Mobile / Tablet (Layar Sentuh) |
|---|---|---|
| **Bergerak (Atas, Bawah, Kiri, Kanan)** | `W`, `A`, `S`, `D` atau `Tombol Panah` | Virtual **D-PAD** di layar |
| **Buka Sandi Prasasti / Interaksi** | `E` atau `Spasi` (saat berada di dekat prasasti) | Tombol bulat **"BUKA SANDI"** |

---

## 🚪 Alur Petualangan 4 Pintu Kuil (2D Progression)

1. **Pintu 1 (Gerbang Luar Kuil - Mudah)**
   * Karakter mulai di pelataran kuil. Dekati batu prasasti kuno bertuliskan 1 kata sandi.
   * Rumus: $f(x) = x + b \implies$ Invers: $f^{-1}(y) = y - b$.
   * Jawaban benar $\implies$ Pintu batu gerbang luar terbelah membuka $\implies$ Jalankan karakter menembus lorong pintu untuk masuk ke **Level 2**!

2. **Pintu 2 (Lorong Katakomba - Sedang)**
   * Ruangan bawah tanah lorong katakomba misterius.
   * Rumus: $f(x) = ax + b \implies$ Invers: $f^{-1}(y) = \frac{y - b}{a}$ (2–3 kata).
   * Pecahkan sandi untuk membuka pintu batu kedua menuju **Level 3**!

3. **Pintu 3 (Ruang Altar Kuno - Sulit)**
   * Ruangan altar pengorbanan kuno dengan pilar batu besar.
   * Rumus: Komposisi $(g \circ f)(x) = c(ax + b) + d = (ca)x + (cb + d)$ (4–6 kata).
   * Invers: $(g \circ f)^{-1}(y) = \frac{y - (cb + d)}{ca}$.
   * Pintu altar terbuka $\implies$ Masuk ke ruang Boss Level!

4. **Pintu Utama (Ruang Relik Suci - Boss Level)**
   * Ruang pilar emas megah. Di ujung ruangan berdiri **Pintu Utama Kuil**.
   * Rumus: Komposisi kompleks $\ge 7$ kata.
   * Setelah pintu utama terbuka, karakter dapat melangkah masuk ke bilik suci dan menyentuh **Relik Suci (Golden Sun Relic)** untuk memenangkan ekspedisi!

---

## ⚡ Sistem Jebakan Kuil Interaktif & Darah Pemain (Real-Time Traps)
Permainan kini semakin menantang dan memacu adrenalin dengan jebakan fisik yang aktif secara *real-time* di lantai dan dinding kuil:
* **Darah Peneliti (3 Hati ❤️❤️❤️):** Pemain memiliki 3 nyawa/kesehatan yang terlihat di bar atas (*HUD*).
* **Jebakan Duri Lantai (*Spike Traps*):** Lempengan besi di lantai dengan 3 fase (Aman $\rightarrow$ Peringatan Bergetar $\rightarrow$ Duri Besi Tajam Menusuk).
* **Jebakan Sumpit/Panah Dinding (*Wall Dart Shooters*):** Nozel dinding menembakkan anak panah energi yang meluncur kencang melintasi lorong.
* **Lempeng Energi Rune Listrik (*Arcane Shock Plates*):** Rune kuno di lantai yang mengumpulkan muatan listrik dan melepaskan cincin sengatan berkala.
* **Bola Penjaga Melayang (*Guardian Patrol Orbs*):** Di Boss Level, bola energi pelindung kuil berpatroli bolak-balik menjaga prasasti emas.
* **Efek & Penalti Saat Terkena Jebakan:**
  * Getaran layar (*screen shake*), kilatan merah, dan hentakan terpental (*knockback*).
  * Kehilangan **1 ❤️** dan penalti waktu **+10 detik** pada stopwatch ekspedisi.
  * Masa kebal sesaat (*invulnerability iframes*) dengan animasi kedip transparan.
  * Jika ketiga hati habis, karakter terlempar pingsan kembali ke gerbang masuk kamar kuil tersebut.
* **Kristal Pemulihan Kuil (*Recovery Crystal & Shield*):** Kristal bersinar biru di sudut kuil yang dapat dipungut untuk memulihkan 1 ❤️ serta memberikan perisai perlindungan (*Shield Aura*) dan akselerasi lari selama 4 detik!

---

## 🔥 Mekanisme 2 Obor & Jebakan Lantai Runtuh
* Setiap pintu dibekali **2 Obor** (2 kali kesempatan).
* **Salah 1x:** Obor pertama padam disertai asap dan peringatan hitungan invers.
* **Salah 2x:** **Jebakan Kuil Aktif!** Lantai kuil runtuh dengan animasi getaran layar dan suara gemuruh batu. Karakter terlempar kembali ke **Pintu 1**.
* **Anti-Hafalan:** Soal dan konstanta fungsi diacak ulang secara otomatis sehingga siswa tidak dapat sekadar menghafal jawaban sebelumnya.

---

## 🧰 Fitur Pendukung
* **Dukungan Huruf Kapital & Huruf Kecil (Garis Bilangan Bulat):** Mendukung penuh kuantifikasi huruf standar Kuil ($0 = \text{Spasi}$, $1 \text{ s/d } 26 = \text{A-Z}$ [Kapital], $-1 \text{ s/d } -26 = \text{a-z}$ [Kecil]). Siswa dapat mengetikkan jawaban dalam huruf besar, huruf kecil, maupun kombinasi persis tanpa khawatir penalti *Caps Lock*.
* **Batu Rosetta Interaktif:** Konversi standar kuil dengan pencarian cepat, penguji huruf kapital/kecil interaktif, dan klik ubin untuk mengisi penguji huruf secara otomatis.
* **Papan Coretan Digital & Sandbox Invers:** Kanvas coretan bebas dan kalkulator uji rumus invers aljabar dengan label deteksi huruf kapital atau kecil.
* **Kompas Kuno (Hint):** 1x kesempatan membuka terjemahan kata pertama (di Pintu 3 atau Pintu Utama) sesuai format huruf aslinya.
* **Kustomisasi Rumus Bebas & Preset Cepat:** Guru atau siswa dapat mengetik rumus aljabar bebas secara langsung (contoh: `f(x) = 3x - 4`, `2x + 7`, `x - 5`, `(g ∘ f)(x) = 6x + 5`, atau format perkalian fungsi `3(2x + 1) + 2`). Sistem dilengkapi:
  * **Parser Aljabar Cerdas:** Otomatis mengekstrak koefisien $a, b, c, d$ dari teks rumus aljabar yang diketik.
  * **Sinkronisasi Dua Arah:** Pengguna dapat mengetik teks rumus aljabar bebas atau memasukkan angka koefisien secara manual (termasuk bilangan negatif dan pecahan/desimal).
  * **Chip Rumus Preset:** Tombol cepat 1-klik untuk memilih variasi rumus menarik (misal: $x + 5$, $2x - 3$, $3x + 1$, $6x + 5$, dll.).
  * **Pratinjau Live & Validasi Otomatis:** Perhitungan live fungsi invers $f^{-1}(y)$, penjelasan matematis per langkah, validasi $a \neq 0$, dan deretan sandi angka (*ciphertext*) yang langsung terbarui saat mengetik.
  * **Mode Solo Kustom:** Tombol **"Main Langsung Dengan Rumus Ini"** untuk langsung menjelajahi kuil 2D sendirian dengan rumus buatan sendiri tanpa perlu mode duel.
* **Mode Duel Kelas:** Tim penantang dapat merancang 4 pintu sandi kustom menggunakan rumus bebas dan kombinasi huruf kapital maupun kecil, mengunci layar, dan menantang tim pemecah sandi bertanding adu kecepatan waktu (*stopwatch*).
* **100% Offline & Ringan:** Langsung dibuka dengan klik ganda [`index.html`](file:///c:/Users/MKSiahaan/Documents/ProjekYangDibuat/Game%20MTK/index.html) di browser Chrome, Edge, Firefox, atau Safari.
