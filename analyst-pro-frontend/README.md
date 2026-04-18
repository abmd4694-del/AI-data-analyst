# 🧠 Analyst Pro — AI Data Dashboard (Frontend)

A premium, AI-powered data analytics dashboard built with React and Vite. Upload CSV datasets, explore data with natural language queries powered by Google Gemini AI, and generate insightful reports — all through a sleek, modern interface.

![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **📊 Interactive Dashboard** — Real-time metrics, sales trend charts, and top products visualization
- **🤖 AI-Powered Insights** — Natural language data queries powered by Google Gemini
- **📁 CSV Upload & Processing** — Drag-and-drop file upload with instant data parsing
- **🔍 Data Exploration** — Filter, sort, and explore datasets with an intuitive interface
- **📋 Report Generation** — Automated reports with exportable data
- **⚙️ Settings Panel** — Customizable preferences and configuration
- **🎨 Premium UI** — Dark-themed design with smooth animations and glassmorphism effects

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Recharts** | Data visualization charts |
| **PapaParse** | CSV parsing |
| **React Router v6** | Client-side routing |

---

## 📁 Project Structure

```
analyst-pro-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIInsightsPanel.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── SalesTrendChart.jsx
│   │   │   └── TopProductsChart.jsx
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Sidebar.jsx
│   │       └── TopBar.jsx
│   ├── context/
│   │   └── DataContext.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── DataUploadPage.jsx
│   │   ├── ExplorationPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **Backend API** running ([analyst-pro-backend](https://github.com/YOUR_USERNAME/analyst-pro-backend))

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/analyst-pro-frontend.git
cd analyst-pro-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://your-backend.up.railway.app/api`) | Production only |

> **Note:** In local development, the Vite proxy forwards `/api` requests to `localhost:3001` automatically. No env var needed locally.

---

## 🌐 Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import this repo
3. Set framework preset to **Vite**
4. Add environment variable:
   - `VITE_API_URL` = `https://your-railway-backend-url.up.railway.app/api`
5. Deploy!

---

## 🔗 Related

- **Backend Repository:** [analyst-pro-backend](https://github.com/YOUR_USERNAME/analyst-pro-backend)

---

## 📄 License

This project is private and proprietary.
