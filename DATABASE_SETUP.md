# Setup Database Vercel untuk Form Contact dengan Supabase

## 📋 Langkah-Langkah Setup

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Setup Supabase Database**

#### Langkah A: Buat Project di Supabase

1. Login ke Supabase: https://supabase.com
2. Click **New Project**
3. Isi nama project (contoh: `portfolio-contacts`)
4. Pilih password untuk database
5. Pilih region terdekat
6. Click **Create New Project** dan tunggu hingga selesai

#### Langkah B: Dapatkan Credentials

1. Di dashboard Supabase, masuk ke **Settings** → **API**
2. Copy **Project URL** dan **anon key**
3. Buat file `.env.local` di root project dengan template dari `.env.local.example`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Langkah C: Setup RLS dan Table

1. Di Supabase Dashboard, masuk ke **SQL Editor**
2. Click **New Query** dan paste SQL berikut:

```sql
-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated users
CREATE POLICY "Allow public insert"
  ON contacts
  FOR INSERT
  WITH CHECK (TRUE);

-- Create policy to allow selects from authenticated users
CREATE POLICY "Allow public select"
  ON contacts
  FOR SELECT
  USING (TRUE);

-- Create function untuk init table (opsional)
CREATE OR REPLACE FUNCTION create_contacts_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;
```

3. Click **Run** untuk mengexecute SQL

#### Langkah D: Deploy ke Vercel (Production)

1. Login ke Vercel: https://vercel.com
2. Pilih project Anda
3. Go to **Settings** → **Environment Variables**
4. Tambahkan kedua variable:
   - `SUPABASE_URL`: (dari Supabase Project URL)
   - `SUPABASE_ANON_KEY`: (dari Supabase anon key)
5. Click **Save**

### 3. **Test Database (Development)**

Jika testing local, jalankan:

```bash
npm run dev
```

Kemudian buka di browser:

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

### 4. **Test Production**

Setelah deploy ke Vercel, akses:

```
https://yoursite.vercel.app/api/init-db
```

---

## 📝 File yang Dibuat/Diupdate

### `/api/init-db.ts`

- Menginisialisasi table `contacts` di Supabase
- Hanya perlu dijalankan sekali saat deployment

### `/api/contact.ts`

- **POST** `/api/contact` - Menerima data form dan simpan ke Supabase
- **GET** `/api/contact` - Ambil semua data contact yang sudah disimpan

### `src/components/Contact.tsx`

- Form sudah terintegrasi dengan API
- Mengirim data ke `/api/contact` saat submit
- Loading state dan error handling

### `.env.local.example`

- Template environment variables untuk development

---

## 🗄️ Struktur Database (Supabase)

Table: `contacts`

```sql
- id (BIGSERIAL, PRIMARY KEY)
- name (VARCHAR 255, NOT NULL)
- email (VARCHAR 255, NOT NULL)
- message (TEXT, NOT NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

---

## 📤 Cara Kerja

### Flow Submit Form:

1. User isi form (name, email, message)
2. Click "Send Message"
3. Data dikirim ke `/api/contact` (POST)
4. API simpan ke Supabase database
5. Tampil success/error message
6. Form dikosongkan jika sukses

### Mengecek Data yang Disimpan:

- Di Supabase Dashboard, masuk ke **Table Editor** → **contacts**
- Atau gunakan API GET `/api/contact` untuk retrieve data

---

## 🔐 Security Notes

- RLS (Row Level Security) sudah diaktifkan di Supabase
- Policies sudah dikonfigurasi untuk allow public insert dan select
- Untuk production, bisa restrict access dengan authentication
- Jangan share `SUPABASE_ANON_KEY` ke repository public

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"

- Pastikan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` sudah diset di environment variables
- Untuk local: setup `.env.local`
- Untuk Vercel: setup di Settings → Environment Variables

### Error: "relation 'contacts' does not exist"

- SQL table belum dibuat
- Jalankan init-db endpoint atau execute SQL query di Supabase console

### Error: "Invalid API Key"

- Pastikan `SUPABASE_ANON_KEY` benar
- Copy ulang dari Supabase Dashboard → Settings → API

---

## 📚 Useful Links

- Supabase Docs: https://supabase.com/docs
- Supabase JavaScript Client: https://supabase.com/docs/reference/javascript
- Vercel Deployment: https://vercel.com/docs

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
