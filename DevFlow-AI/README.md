# DevFlow AI

DevFlow AI is a full-stack starter application with:

- React + Vite frontend
- Node.js + Express backend
- MySQL database connection
- Axios for API requests
- CORS enabled
- Environment variable support
- API health check endpoint

## Folder Structure

```text
DevFlow-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── healthController.js
│   │   ├── routes/
│   │   │   └── healthRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Setup Commands

### 1. Create the project folders

```bash
mkdir DevFlow-AI
cd DevFlow-AI
mkdir frontend backend
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

Backend:

```bash
cp .env.example .env
```

Frontend:

```bash
cd ../frontend
cp .env.example .env
```

### 5. Start the backend

```bash
cd ../backend
npm run dev
```

### 6. Start the frontend

```bash
cd ../frontend
npm run dev
```

## API Endpoint

- Health check: `GET http://localhost:5000/api/health`

## Notes

- Update `backend/.env` with your MySQL credentials.
- Update `frontend/.env` if your backend base URL changes.
- The health check will report backend status and attempt a database ping.
