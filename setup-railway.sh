#!/usr/bin/env bash
set -e

echo "=== Pilot Monorepo — Railway Setup ==="
echo ""

# 1. Install Railway CLI
if ! command -v railway &> /dev/null; then
  echo "Installing Railway CLI..."
  npm install -g @railway/cli
else
  echo "Railway CLI already installed: $(railway --version)"
fi

# 2. Authenticate
echo ""
echo "Logging in to Railway..."
railway login

# 3. Create project
echo ""
echo "Creating Railway project..."
railway init

# 4. Add PostgreSQL
echo ""
echo "Add a PostgreSQL database in the Railway dashboard:"
echo "  1. Open your project at https://railway.com/dashboard"
echo "  2. Click 'New' → 'Database' → 'PostgreSQL'"
echo ""
read -p "Press Enter once you've added PostgreSQL..."

# 5. Link and deploy backend
echo ""
echo "Setting up backend service..."
cd backend
railway link
railway up
cd ..

# 6. Link and deploy frontend
echo ""
echo "Setting up frontend service..."
cd frontend
railway link
railway up
cd ..

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. In Railway dashboard, set backend env var:"
echo "     DATABASE_URL = \${{Postgres.DATABASE_URL}}"
echo "  2. Generate public domains for both services"
echo "  3. Set frontend build arg:"
echo "     VITE_API_URL = https://<your-backend-domain>.up.railway.app"
echo "  4. Connect your GitHub repo for auto-deploy on push"
