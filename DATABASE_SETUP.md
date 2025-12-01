# Setup Database Vercel untuk Form Contact

## 📋 Langkah-Langkah Setup

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Setup Vercel Postgres Database**

#### Opsi A: Menggunakan Vercel Postgres (Recommended)

1. Login ke akun Vercel: https://vercel.com
2. Pilih project Anda
3. Go to **Settings** → **Storage**
4. Click **Create Database** → **Postgres**
5. Nama database: `contacts_db`
6. Vercel otomatis akan membuat environment variable `POSTGRES_URL`

#### Opsi B: Menggunakan .env.local (Development)

Jika testing local, buat file `.env.local`:

```
POSTGRES_URL=postgresql://user:password@localhost:5432/contacts_db
```

### 3. **Initialize Database**

Buka browser dan akses URL ini sekali:

```
https://yoursite.vercel.app/api/init-db
```

Atau jika development local:

```
http://localhost:5173/api/init-db
```

Jika berhasil akan muncul:

```json
{
  "success": true,
  "message": "Database table initialized successfully"
}
```

---

## 📝 File yang Dibuat

### `/api/contact.ts`

- **POST** `/api/contact` - Menerima data form dan simpan ke database
- **GET** `/api/contact` - Ambil semua data contact yang sudah disimpan

### `/api/init-db.ts`

- Membuat table `contacts` otomatis saat di-access
- Hanya perlu dijalankan sekali

### `src/components/Contact.tsx`

- Form sudah terintegrasi dengan API
- Mengirim data ke `/api/contact` saat submit
- Loading state dan error handling

---

## 🗄️ Struktur Database

Table: `contacts`

```sql
- id (INTEGER, PRIMARY KEY)
- name (VARCHAR 255)
- email (VARCHAR 255)
- message (TEXT)
- created_at (TIMESTAMP)
```

---

## 📤 Cara Kerja

### Flow Submit Form:

1. User isi form (name, email, message)
2. Click "Send Message"
3. Data dikirim ke `/api/contact` (POST)
4. API simpan ke Postgres database
5. Tampil success/error message
6. Form dikosongkan jika sukses

### Mengecek Data yang Disimpan:

```
GET https://yoursite.vercel.app/api/contact
```

Response akan berisi array semua data contact.

---

## 🔧 Testing Local (Optional)

### Setup PostgreSQL Local:

1. Install PostgreSQL: https://www.postgresql.org/download/
2. Buat database baru:

```sql
CREATE DATABASE contacts_db;
```

3. Update `.env.local`:

```
POSTGRES_URL=postgresql://postgres:password@localhost:5432/contacts_db
```

4. Run development server:

```bash
npm run dev
```

5. Test form di `http://localhost:5173`

---

## 🚀 Deploy ke Vercel

1. Push code ke GitHub
2. Vercel otomatis detect dan deploy
3. Environment variable `POSTGRES_URL` sudah tersedia dari Vercel Postgres
4. Form langsung bisa digunakan!

---

## 📊 Mengexport Data ke TXT (Optional)

Jika ingin download semua contact sebagai file TXT, bisa buat API endpoint tambahan:

```typescript
// api/export.ts
export default async function handler(req, res) {
  const result = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;

  let txtContent = "=== CONTACT SUBMISSIONS ===\n\n";
  result.rows.forEach((row) => {
    txtContent += `Name: ${row.name}\n`;
    txtContent += `Email: ${row.email}\n`;
    txtContent += `Message: ${row.message}\n`;
    txtContent += `Date: ${row.created_at}\n`;
    txtContent += "---\n\n";
  });

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.txt");
  res.send(txtContent);
}
```

---

## ✅ Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Setup Vercel Postgres database
- [ ] Set environment variable `POSTGRES_URL`
- [ ] Initialize database via `/api/init-db`
- [ ] Test form submission
- [ ] Deploy ke Vercel
- [ ] Verify data tersimpan

---

**Pertanyaan?** Hubungi Vercel support atau dokumentasi: https://vercel.com/docs/storage/postgres
