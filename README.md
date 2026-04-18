# 🧠 Analyst Pro — AI-Powered Data Analytics Dashboard

A full-stack, premium AI data analytics platform that lets you upload CSV datasets, explore data through natural language queries powered by Google Gemini, and generate beautiful visual reports — all through a sleek, modern dark-themed interface.

![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)

---

## ✨ Features

### Frontend
- **📊 Interactive Dashboard** — Real-time metrics, sales trend charts, and top products visualization
- **🤖 AI-Powered Insights** — Natural language data queries powered by Google Gemini
- **📁 CSV Upload** — Drag-and-drop file upload with instant data parsing
- **🔍 Data Exploration** — Filter, sort, and explore datasets with an intuitive interface
- **📋 Report Generation** — Automated reports with exportable data
- **⚙️ Settings Panel** — Customizable preferences and configuration
- **🎨 Premium UI** — Dark-themed design with smooth animations and glassmorphism effects

### Backend
- **📦 Dataset Management** — Store, retrieve, preview, and analyze multiple datasets
- **🤖 AI Query Engine** — Natural language to data analysis via Google Gemini API
- **📊 Statistical Analysis** — Automatic calculation of statistics, distributions, and correlations
- **💡 Smart Suggestions** — AI-generated query suggestions based on dataset structure
- **🔒 CORS Protected** — Configurable origin whitelist for secure cross-origin requests

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Recharts** | Data visualization charts |
| **PapaParse** | CSV parsing |
| **React Router v6** | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 18+** | Runtime environment |
| **Express 4** | Web framework |
| **Google Gemini API** | AI-powered data analysis |
| **Multer** | File upload handling |
| **PapaParse** | CSV parsing |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
Analyst Pro/
│
├── 📂 Frontend (Root)
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── AIInsightsPanel.jsx
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── SalesTrendChart.jsx
│   │   │   │   └── TopProductsChart.jsx
│   │   │   └── layout/
│   │   │       ├── Layout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── TopBar.jsx
│   │   ├── context/
│   │   │   └── DataContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DataUploadPage.jsx
│   │   │   ├── ExplorationPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── 📂 server/ (Backend)
    ├── controllers/
    ├── middleware/
    ├── routes/
    │   ├── data.js
    │   ├── query.js
    │   └── upload.js
    ├── uploads/
    ├── utils/
    │   ├── aiEngine.js
    │   └── dataProcessor.js
    ├── index.js
    └── package.json
```

---

## 🔌 API Endpoints

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

### Upload & Datasets
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload a CSV file |
| `GET` | `/api/upload/datasets` | List all loaded datasets |
| `GET` | `/api/upload/datasets/:id` | Get dataset details |
| `GET` | `/api/upload/datasets/:id/preview` | Preview dataset rows |

### AI Queries
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/query` | Send a natural language query |
| `POST` | `/api/query/structured` | Execute a structured query |
| `GET` | `/api/query/suggestions/:id` | Get AI query suggestions |

### Data Analysis
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/data/stats/:id` | Get dataset statistics |
| `GET` | `/api/data/distribution/:id/:column` | Get column distribution |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** 18+ installed
- **Google Gemini API Key** — Get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 1. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend server
npm run dev
```

Backend runs at `http://localhost:3001`

### 2. Setup Frontend

```bash
# From root directory
npm install

# Start frontend dev server
npm run dev
```

Frontend runs at `http://localhost:5173` — Vite proxy automatically forwards `/api` requests to the backend.

---

## 🌐 Deployment

This project is split into two separate repos for deployment:

| Component | Repo | Platform | URL |
|---|---|---|---|
| **Frontend** | `analyst-pro-frontend` | [Vercel](https://vercel.com) | `https://your-app.vercel.app` |
| **Backend** | `analyst-pro-backend` | [Railway](https://railway.app) | `https://your-api.up.railway.app` |

### Deploy Backend (Railway)

1. Push `analyst-pro-backend` repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the backend repo
4. Add environment variables:

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `MAX_FILE_SIZE_MB` | `50` |

5. Railway auto-detects Node.js and runs `npm start`
6. Copy the generated Railway URL

### Deploy Frontend (Vercel)

1. Push `analyst-pro-frontend` repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import the frontend repo
3. Set framework preset to **Vite**
4. Add environment variable:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-railway-url.up.railway.app/api` |

5. Deploy!

### Post-Deployment

Go back to Railway and update `FRONTEND_URL` with your actual Vercel URL to enable CORS.

```
┌─────────────────────┐         HTTPS          ┌──────────────────────┐
│                     │  ──────────────────►    │                      │
│   Vercel (Frontend) │   VITE_API_URL          │  Railway (Backend)   │
│   React + Vite      │   /api/*                │  Express API         │
│                     │  ◄──────────────────    │  Gemini AI Engine    │
│                     │         JSON            │                      │
└─────────────────────┘                        └──────────────────────┘
```

---

## 🔐 Environment Variables

### Frontend (.env)
| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API URL | Production only |

### Backend (.env)
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3001` |
| `GEMINI_API_KEY` | Google Gemini API key | **Required** |
| `MAX_FILE_SIZE_MB` | Max upload file size | `50` |
| `FRONTEND_URL` | Frontend URL for CORS | — |

> ⚠️ **Never commit `.env` files to GitHub.** Use `.env.example` as a reference template.

---

## 📸 Pages

| Page | Description |
|---|---|
| **Dashboard** | Overview metrics, sales trends, top products, AI insights |
| **Data Upload** | Drag-and-drop CSV uploader with file validation |
| **Exploration** | Interactive data table with filters, search, and AI queries |
| **Reports** | Generated analytics reports with charts and export |
| **Settings** | App preferences and configuration |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using React, Express, and Google Gemini AI**
