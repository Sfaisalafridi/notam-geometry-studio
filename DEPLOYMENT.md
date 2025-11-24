# NOTAM Geometry Studio - Deployment Guide

## Quick Deploy (Recommended)

### Step 1: Deploy Backend (Railway - FREE)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `notam-geometry-studio` repository
5. Railway will auto-detect Python and deploy
6. Copy the deployed URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend (Vercel - FREE)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import `notam-geometry-studio` repository
5. Configure:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-app.railway.app` (from Step 1)
7. Click "Deploy"

### Step 3: Buy & Connect Domain

#### Option A: Namecheap (Recommended - ~$10/year)
1. Go to https://www.namecheap.com
2. Search for your desired domain (e.g., `notamstudio.com`)
3. Purchase domain (~$8-15/year)
4. In Namecheap Dashboard:
   - Go to "Domain List" → Click "Manage"
   - Go to "Advanced DNS"
   - Add these records:
     ```
     Type: CNAME
     Host: @
     Value: cname.vercel-dns.com
     TTL: Automatic
     
     Type: CNAME
     Host: www
     Value: cname.vercel-dns.com
     TTL: Automatic
     ```

5. In Vercel Dashboard:
   - Go to your project → "Settings" → "Domains"
   - Add your domain (e.g., `notamstudio.com`)
   - Vercel will automatically configure SSL

#### Option B: Cloudflare (FREE DNS + Domain)
1. Go to https://www.cloudflare.com/products/registrar/
2. Transfer or register domain
3. In Cloudflare DNS:
   - Add CNAME: `@` → `cname.vercel-dns.com`
   - Add CNAME: `www` → `cname.vercel-dns.com`
4. In Vercel, add your domain

### Step 4: Update Frontend API URL
After backend is deployed, update the frontend to use the production API:

1. In `frontend/src/components/Sidebar.tsx`, change:
   ```typescript
   const response = await axios.post('http://localhost:8000/api/parse', { text: textInput });
   ```
   to:
   ```typescript
   const response = await axios.post('https://your-backend.railway.app/api/parse', { text: textInput });
   ```

2. Commit and push changes - Vercel will auto-redeploy

## Alternative: All-in-One Deployment (Render)

1. Go to https://render.com
2. Create account
3. Deploy backend:
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy frontend:
   - New → Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

## Cost Breakdown
- **Domain**: $8-15/year (Namecheap/Cloudflare)
- **Hosting**: $0/month (Free tiers)
  - Vercel: Free for personal projects
  - Railway: Free tier (500 hours/month)
  - Render: Free tier available

## Total Cost: ~$10/year

## Recommended Domain Names
- notamstudio.com
- notamgeometry.com
- notamparser.com
- aviationnotam.com
- notammap.com

Check availability at: https://www.namecheap.com
