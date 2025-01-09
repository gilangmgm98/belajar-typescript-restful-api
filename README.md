
# 🚀 **Setup Project: Belajar TypeScript RESTful API**

Ikuti langkah-langkah berikut untuk memulai proyek ini.

---

## **1. Buat File `.env`**
Tambahkan konfigurasi berikut ke dalam file `.env` Anda:

```env
DATABASE_URL="mysql://root:root@localhost:3306/belajar_typescript_restful_api"
```
> **Tip**: Pastikan database sudah diatur sesuai dengan yang digunakan.

---

## **2. Instalasi dan Setup Proyek**
Jalankan perintah berikut di terminal untuk mengatur proyek:

```bash
# Pasang semua dependensi proyek
npm install

# Migrasikan skema database ke database Anda
npx prisma migrate dev

# Hasilkan Prisma Client
npx prisma generate

# Bangun proyek
npm run build

# Jalankan aplikasi
npm run start
```
<!-- > **Catatan**: Gunakan `npm run dev` jika Anda ingin menjalankan proyek dalam mode pengembangan. -->

---

## **Checklist Setelah Setup**

- ✅ Database sudah terhubung.

- ✅ Prisma Client berhasil dihasilkan.

- ✅ Aplikasi berjalan di `localhost` dengan port default.


---

## **Enjoy Building!** 🚀
Jika ada kendala, pastikan untuk membaca dokumentasi atau menghubungi tim pengembang.
