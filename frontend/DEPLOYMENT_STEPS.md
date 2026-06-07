# Quick Deployment Commands

This file contains the exact commands to deploy your frontend to Vercel.

## 1. Navigate to frontend and set up git

```bash
cd frontend
```

## 2. Initialize Git (if not already a git repo)

```bash
git init
git branch -M main
```

## 3. Add your new GitHub repository as remote

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/docxtract-frontend.git
```

To check current remote:
```bash
git remote -v
```

To remove old remote (if exists):
```bash
git remote remove origin
```

## 4. Commit and push to GitHub

```bash
git add .
git commit -m "Initial commit: Frontend deployment to Vercel"
git push -u origin main
```

## 5. Deploy to Vercel

### Option A: Web Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Add Environment Variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://docxtract-backend-production.up.railway.app`
5. Click Deploy

### Option B: Vercel CLI

```bash
# Install globally
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# When prompted, add environment variable:
# NEXT_PUBLIC_API_URL=https://docxtract-backend-production.up.railway.app
```

## Verification

After deployment:

1. Visit your Vercel URL (e.g., https://docxtract-frontend.vercel.app)
2. Try logging in
3. Open browser DevTools (F12) → Network tab
4. Check that API calls go to `https://docxtract-backend-production.up.railway.app`

## Update Backend URL (if needed)

If you need to change the backend URL later:

**Option 1: Update Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Edit `NEXT_PUBLIC_API_URL`
5. Redeploy

**Option 2: Via Vercel CLI**
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://docxtract-backend-production.up.railway.app
vercel --prod
```

## File Structure in Your New Repo

Your new repository should contain only:
```
docxtract-frontend/
├── app/
├── components/
├── hooks/
├── lib/
├── public/
├── styles/
├── .env.example
├── .env.local (git-ignored)
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

## Backend Verification

Before deployment, verify your backend is working:

```bash
# Check backend status
curl https://docxtract-backend-production.up.railway.app/docs
```

You should see the Swagger API documentation page.
