# 🛩️ Seaplane Dock Management System

A dock management system tailored for the seaplane industry to monitor and manage dock occupancy in real-time. This system supports role-based access control, interactive dock management, and clean visual dashboards.

---

## 🚀 Features

- Real-time Dock Status Monitoring  
- Role-Based Access Control (`OCC` and `Viewer` roles)  
- Interactive Dock Management with Manual Overrides  
- Fleet Management CRUD Operations  
- Aesthetic Reports Dashboard with Charts  
- Supabase Integration with Persistent Storage  
- Responsive and User-Friendly Interface  

---

## 📦 Tech Stack

- Next.js (React Framework)  
- Tailwind CSS + ShadCN UI  
- Supabase for Database and Authentication  
- Recharts for Data Visualization  

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/seaplane-dock-management.git
cd seaplane-dock-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

### 4. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app.

---

## 👤 User Credentials

| Role     | Email          | Password |
|----------|----------------|----------|
| OCC User | occ@test.com   | 123      |
| Viewer   | view@test.com  | 123      |

- **OCC User:** Full access to manage docks and fleet.  
- **Viewer User:** View-only access to monitor docks and fleet.

---

Enjoy managing the docks efficiently! ✈️⚓
