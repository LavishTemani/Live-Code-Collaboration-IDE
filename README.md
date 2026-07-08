# Live Code Collaboration IDE
LiveIDE is a web-based collaborative coding platform that allows multiple users to write, edit, and compile code together in real-time.

## Prerequisites
- Node.js 18+ installed
- npm installed
- MongoDB running or accessible via `MONGO_URI`
- Docker installed if you plan to use the backend container execution features

## Install dependencies
From the project root:
```bash
cd "c:\Users\lavis\Coading\New Project\LiveIDE"
npm install
```

Install frontend and backend dependencies:
```bash
npm run install-all
```

If you prefer, install each package manually:
```bash
cd frontend
npm install
cd ../backend
npm install
```

## Run the project
### Option 1: Start both services together
From the project root:
```bash
npm run start
```

### Option 2: Start each service separately
In one terminal:
```bash
cd frontend
npm run dev
```

In a second terminal:
```bash
cd backend
npm run dev
```

## Environment setup
Create a `.env` file inside `backend/` with these values:
```ini
MONGO_URI=<your-mongo-uri>
SECRET_KEY=<your-session-secret>
JWT_SECRET=<your-jwt-secret>
```

If `MONGO_URI` is not set, the backend will start with an in-memory session store for local development only.

## Default ports
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- WebRTC signaling: `http://localhost:4444`

## Notes
- Docker is required only for backend container execution features.
- The backend starts the local `y-webrtc` signaling server automatically.
- Use `npm run start` from the root only after running `npm install` to ensure the root dev dependency is installed.

