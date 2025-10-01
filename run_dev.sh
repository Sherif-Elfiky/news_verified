#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting News Verified Development Environment${NC}"
echo "=================================================="

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start Backend
echo -e "${GREEN}📡 Starting Backend (FastAPI)...${NC}"
cd news_verified_backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo -e "${GREEN}🌐 Starting Frontend (Next.js)...${NC}"
cd news_verified_frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${BLUE}✅ Both services are starting up!${NC}"
echo -e "${YELLOW}Backend:${NC} http://localhost:8000"
echo -e "${YELLOW}Frontend:${NC} http://localhost:3000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"
echo "=================================================="

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
