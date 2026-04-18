# ⚡ Analyst Pro — AI Data API (Backend)

A robust Express.js REST API that powers the Analyst Pro dashboard. Handles CSV data processing, dataset management, and AI-powered natural language data queries using Google Gemini.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)

---

## ✨ Features

- **📁 CSV Upload & Processing** — Upload CSV files with automatic parsing and statistical analysis
- **🤖 AI Query Engine** — Natural language data queries powered by Google Gemini API
- **📊 Data Analysis** — Automatic calculation of statistics, distributions, and correlations
- **💡 Smart Suggestions** — AI-generated query suggestions based on dataset structure
- **🔒 CORS Protected** — Configurable origin whitelist for secure cross-origin requests
- **📦 Dataset Management** — Store, retrieve, and preview multiple datasets

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js 18+** | Runtime environment |
| **Express 4** | Web framework |
| **Google Gemini API** | AI-powered data analysis |
| **Multer** | File upload handling |
| **PapaParse** | CSV parsing |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |

---

## 📁 Project Structure

```
analyst-pro-backend/
├── controllers/          # Request handlers (future use)
├── middleware/            # Custom middleware (future use)
├── routes/
│   ├── data.js           # Dataset statistics & analysis endpoints
│   ├── query.js          # AI query & suggestions endpoints
│   └── upload.js         # File upload & dataset management
├── uploads/              # Uploaded CSV files (gitignored)
├── utils/
│   ├── aiEngine.js       # Google Gemini AI integration
│   └── dataProcessor.js  # CSV processing & statistical analysis
├── .env.example          # Environment variable template
├── .gitignore
├── index.js              # Server entry point
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

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **Google Gemini API Key** — Get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/analyst-pro-backend.git
cd analyst-pro-backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start development server (with auto-reload)
npm run dev
```

The API will run at `http://localhost:3001`

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3001` |
| `GEMINI_API_KEY` | Google Gemini API key | **Required** |
| `MAX_FILE_SIZE_MB` | Max upload size in MB | `50` |
| `FRONTEND_URL` | Frontend URL for CORS | — |

---

## 🌐 Deployment (Railway)

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repo
4. Add environment variables:
   - `GEMINI_API_KEY` = your Google Gemini API key
   - `FRONTEND_URL` = `https://your-app.vercel.app`
   - `MAX_FILE_SIZE_MB` = `50`
5. Railway auto-detects Node.js and runs `npm start`
6. Copy the generated Railway URL for the frontend config

---

## 🔗 Related

- **Frontend Repository:** [analyst-pro-frontend](https://github.com/YOUR_USERNAME/analyst-pro-frontend)

---

## 📄 License

This project is private and proprietary.
