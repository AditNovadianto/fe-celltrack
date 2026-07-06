# Software Code Documentation (SCD) - Frontend CellTrack

| Item                   | Description                                       |
| ---------------------- | ------------------------------------------------- |
| Repository             | https://github.com/AditNovadianto/fe-celltrack    |
| Application Layer      | Frontend / Client Application                     |
| Main Stack             | React, TypeScript, Vite, Tailwind CSS             |
| Documentation Template | CBC Documentation Templates - README for Software |
| Related Backend        | https://github.com/AditNovadianto/be-celltrack    |

## 1. Project Title

**CellTrack Frontend (`fe-celltrack`)** adalah aplikasi antarmuka pengguna berbasis React + TypeScript yang digunakan sebagai client application untuk sistem CellTrack. Frontend ini menyediakan halaman autentikasi, dashboard berbasis role, modul pengelolaan pelanggan, produk, supplier, teknisi, transaksi, service request, dan notifikasi.

## 2. Overview

CellTrack Frontend berfungsi sebagai lapisan presentasi untuk menghubungkan pengguna dengan backend CellTrack. Aplikasi ini dirancang untuk beberapa tipe pengguna, yaitu admin, employee, customer, supplier, dan technician. Setiap role memiliki komponen dashboard dan fitur operasional yang berbeda. Berdasarkan struktur file yang diberikan, aplikasi menggunakan pendekatan modular dengan pemisahan komponen berdasarkan role, shared UI components, static assets, halaman utama, serta utility functions.

## 3. Key Features

- Autentikasi pengguna melalui halaman sign in, sign up, dan forgot password.
- Protected route untuk membatasi akses halaman berdasarkan status autentikasi.
- Dashboard role-based untuk Admin, Employee, Customer, Supplier, dan Technician.
- Modul Admin untuk pelanggan, karyawan, produk, supplier, teknisi, transaksi, dan service request.
- Modul Employee untuk pelanggan, produk, transaksi, dan service request.
- Modul Supplier untuk dashboard dan pengelolaan produk supplier.
- Modul Technician untuk dashboard, tugas teknisi, dan service request.
- Komponen notifikasi untuk supplier, technician, dan user umum.
- Shared UI components seperti button, table, calendar, dropdown menu, popover, dan breadcrumb.

## 4. Technology Stack

| Area         | Technology         | Purpose                                          |
| ------------ | ------------------ | ------------------------------------------------ |
| Framework    | React 19           | Membangun UI berbasis komponen                   |
| Language     | TypeScript         | Type safety dan maintainability                  |
| Build Tool   | Vite 6             | Development server dan production build          |
| Routing      | React Router DOM 7 | Navigasi client-side                             |
| Styling      | Tailwind CSS 4     | Utility-first styling                            |
| UI Primitive | Radix UI           | Dropdown, popover, slot, dan komponen interaktif |
| Icons        | lucide-react       | Icon set untuk UI                                |
| Date Utility | date-fns           | Pengolahan tanggal                               |
| PDF Utility  | jsPDF              | Pembuatan dokumen PDF di sisi client             |
| Linting      | ESLint             | Pemeriksaan kualitas kode                        |

## 5. Repository Structure

```text
fe-celltrack/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── employee/
│   │   ├── supplier/
│   │   ├── technician/
│   │   ├── ui/
│   │   └── ProtectedRoute.tsx
│   ├── images/
│   ├── lib/
│   ├── pages/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 6. Codebase Documentation

| Path                                | Description                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/main.tsx`                      | Entry point React yang melakukan mounting aplikasi ke DOM.                                     |
| `src/App.tsx`                       | Root component aplikasi.                                                                       |
| `src/pages/`                        | Halaman utama seperti Dashboard, SignIn, SignInCustomer, SignUp, ForgotPassword, dan NotFound. |
| `src/components/admin/`             | Komponen dashboard dan manajemen data untuk admin.                                             |
| `src/components/employee/`          | Komponen dashboard dan modul operasional employee.                                             |
| `src/components/customer/`          | Komponen dashboard customer.                                                                   |
| `src/components/supplier/`          | Komponen dashboard supplier dan pengelolaan produk supplier.                                   |
| `src/components/technician/`        | Komponen dashboard, service request, dan task teknisi.                                         |
| `src/components/ui/`                | Reusable UI components.                                                                        |
| `src/components/ProtectedRoute.tsx` | Guard component untuk halaman yang membutuhkan autentikasi.                                    |
| `src/utils/auth.ts`                 | Utility autentikasi, misalnya pengelolaan token/session di sisi client.                        |
| `src/utils/decryptBill.js`          | Utility untuk proses dekripsi atau pembacaan bill/transaksi.                                   |
| `src/lib/utils.ts`                  | Utility umum, biasanya untuk penggabungan className atau helper UI.                            |
| `src/images/`                       | Asset gambar seperti logo CellTrack dan profile picture.                                       |

## 7. Application Architecture

```text
User Browser
   │
   ▼
React + TypeScript Frontend
   ├── Pages: SignIn, SignUp, Dashboard, ForgotPassword, NotFound
   ├── Role Components: Admin, Employee, Customer, Supplier, Technician
   ├── Shared UI: Button, Table, Calendar, Dropdown, Popover, Breadcrumb
   └── Utilities: Auth, Decrypt Bill, General UI Helpers
   │
   ▼
CellTrack Backend API
   │
   ▼
Database and External Services
```

## 8. Role-Based Module Documentation

| Role       | Main Components                                                                                                                                         | Functional Scope                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Admin      | `DashboardAdmin`, `CustomersAdmin`, `EmployeesAdmin`, `ProductsAdmin`, `SuppliersAdmin`, `TechniciansAdmin`, `TransactionsAdmin`, `ServiceRequestAdmin` | Mengelola data utama dan monitoring operasional sistem.                           |
| Employee   | `DashboardEmployee`, `CustomersEmployee`, `ProductsEmployee`, `TransactionsEmployee`, `ServiceRequestEmployee`                                          | Membantu operasional transaksi, customer, produk, dan service request.            |
| Customer   | `DashboardCustomer`                                                                                                                                     | Mengakses dashboard customer dan kemungkinan aktivitas service request/transaksi. |
| Supplier   | `DashboardSupplier`, `ProductsSupplier`, `NotificationsSuppliers`                                                                                       | Mengelola informasi supplier, produk, dan notifikasi.                             |
| Technician | `DashboardTechnician`, `ServiceRequestTechnician`, `TasksTechnicians`, `NotificationsTechnicians`                                                       | Melihat dan menangani service request serta tugas teknisi.                        |

## 9. Getting Started

### 9.1 Prerequisites

- Node.js versi LTS, direkomendasikan Node.js 20 atau lebih baru.
- npm sebagai package manager.
- Backend CellTrack sudah berjalan dan endpoint API sudah disiapkan.
- File environment dibuat berdasarkan `.env.example`.

### 9.2 Installing

```bash
git clone https://github.com/AditNovadianto/fe-celltrack.git
cd fe-celltrack
npm install
cp .env.example .env
npm run dev
```

Aplikasi development Vite umumnya berjalan di `http://localhost:5173`, kecuali port diubah oleh konfigurasi lokal.

### 9.3 Build and Preview

```bash
npm run build
npm run preview
```

## 10. Environment Configuration

| Variable           | Description                                   | Note                                                        |
| ------------------ | --------------------------------------------- | ----------------------------------------------------------- |
| API Base URL       | Alamat backend API CellTrack                  | Sesuaikan dengan `.env.example` dan environment deployment. |
| Client-side Config | Konfigurasi yang dibutuhkan Vite              | Variable Vite umumnya menggunakan prefix `VITE_`.           |
| Secret Values      | Hindari menyimpan secret sensitif di frontend | Secret frontend dapat terbaca di browser setelah build.     |

## 11. Tests

Repository menyediakan script linting melalui `npm run lint`. Berdasarkan struktur file dan package script yang tersedia, automated unit test belum terlihat sebagai script tersendiri. Karena itu, proses testing yang direkomendasikan adalah kombinasi linting, build verification, dan manual functional testing.

```bash
npm run lint
npm run build
```

Manual test checklist:

- Login dan logout untuk setiap role.
- Akses protected route tanpa login harus diarahkan sesuai aturan aplikasi.
- Admin dapat membuka modul customer, employee, product, supplier, technician, transaction, dan service request.
- Employee dapat membuka modul customer, product, transaction, dan service request.
- Supplier dapat membuka dashboard dan produk supplier.
- Technician dapat membuka dashboard, service request, task, dan notifikasi.
- Build production berhasil tanpa TypeScript error.

## 12. Deployment

Frontend ini dapat dideploy ke platform static hosting seperti Vercel, Netlify, atau server sendiri menggunakan Nginx/Apache. Proses deployment dasar:

```bash
npm install
npm run build
```

Folder hasil build Vite berada di `dist/`. Untuk deployment mandiri, arahkan web server ke folder `dist/` dan pastikan fallback route untuk Single Page Application diarahkan ke `index.html`.

## 13. Security and Access Control Notes

- Gunakan `ProtectedRoute` untuk halaman yang membutuhkan autentikasi.
- Token/session harus dikelola secara konsisten melalui utility `auth.ts`.
- Validasi role tetap harus dilakukan juga di backend, bukan hanya di frontend.
- Jangan commit `.env` yang berisi konfigurasi lokal atau data sensitif.
- Gunakan HTTPS pada production environment.
- Hindari menyimpan secret backend di variable frontend karena hasil build dapat dibaca oleh browser.

## 14. Coding and Maintenance Guidelines

- Pertahankan pemisahan komponen berdasarkan role agar modul mudah dirawat.
- Shared UI component sebaiknya ditempatkan di `src/components/ui/`.
- Utility umum ditempatkan di `src/lib/` atau `src/utils/` sesuai konteks penggunaannya.
- Tambahkan komentar singkat pada fungsi yang memiliki logika kompleks seperti dekripsi bill, parsing transaksi, atau transformasi data API.
- Jalankan `npm run lint` dan `npm run build` sebelum membuat pull request atau deployment.

## 15. Contributing

Kontribusi pengembangan frontend dilakukan melalui GitHub. Alur kontribusi yang disarankan:

1. Clone repository frontend.
2. Buat branch baru sesuai fitur atau perbaikan.
3. Lakukan perubahan pada branch yang sudah dibuat.
4. Uji perubahan melalui browser.
5. Pastikan integrasi API backend tetap berjalan.
6. Commit perubahan dengan pesan yang jelas.
7. Push branch ke repository.
8. Ajukan pull request atau merge ke branch utama.

## 16. Release History

| Version | Description                                                    |
| ------- | -------------------------------------------------------------- |
| 0.0.0   | Initial frontend version based on React, TypeScript, and Vite. |

## 17. Authors

| Nama/Role      | Keterangan                                                                          |
| -------------- | ----------------------------------------------------------------------------------- |
| AditNovadianto | Pemilik repository GitHub `fe-celltrack` dan Developer.                             |
| Penyusun SCD   | Dokumentasi disusun berdasarkan repository frontend dan tree file yang dilampirkan. |

## 18. References

- CBC Documentation Templates - README for Software: https://compbiocore.github.io/cbc-documentation-templates/readme/
- Frontend Repository: https://github.com/AditNovadianto/fe-celltrack
- Related Backend Repository: https://github.com/AditNovadianto/be-celltrack
