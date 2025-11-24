# Deployment Instructions for notamstudio.net

## ✅ Step 1: Domain Purchase (IN PROGRESS)
You're currently purchasing **notamstudio.net** for $13.18/year from Namecheap.
Complete the checkout process.

---

## 🚀 Step 2: Create GitHub Repository

### Option A: Via GitHub Website (Recommended - No Git Required)
1. Go to https://github.com/new
2. Repository name: `notam-geometry-studio`
3. Description: `NOTAM Geometry Parser and Visualizer`
4. Set to **Public**
5. Click "Create repository"
6. On the next page, click "uploading an existing file"
7. Drag and drop the ENTIRE `notam-geometry-studio` folder
8. Click "Commit changes"

### Option B: Install Git and Push
If you prefer using Git:
1. Download Git: https://git-scm.com/download/win
2. Install Git
3. Open PowerShell in `c:\Users\Lenovo\notam-geometry-studio`
4. Run these commands:
```bash
git init
git add .
git commit -m "Initial commit - NOTAM Geometry Studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/notam-geometry-studio.git
git push -u origin main
```

---

## 🔧 Step 3: Deploy Backend to Railway (FREE)

1. **Go to Railway**: https://railway.app
2. **Sign Up**: Click "Login" → "Login with GitHub"
3. **Authorize Railway** to access your GitHub
4. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `notam-geometry-studio`
5. **Configure**:
   - Railway will auto-detect Python
   - It will use the `Procfile` we created
6. **Wait for Deployment** (2-3 minutes)
7. **Get Your URL**:
   - Click on your deployment
   - Go to "Settings" → "Domains"
   - Click "Generate Domain"
   - **COPY THIS URL** (e.g., `https://notam-studio-production.up.railway.app`)
   - Save it for Step 4

---

## 🎨 Step 4: Deploy Frontend to Vercel (FREE)

1. **Go to Vercel**: https://vercel.com
2. **Sign Up**: Click "Sign Up" → "Continue with GitHub"
3. **Authorize Vercel** to access your GitHub
4. **Import Project**:
   - Click "Add New..." → "Project"
   - Find and select `notam-geometry-studio`
   - Click "Import"
5. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (click "Edit" and type `frontend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Add Environment Variable**:
   - Click "Environment Variables"
   - **Name**: `VITE_API_URL`
   - **Value**: (Paste your Railway URL from Step 3)
   - Click "Add"
7. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
8. **Get Your Vercel URL**:
   - After deployment, you'll see a URL like `https://notam-geometry-studio.vercel.app`
   - **Test it** - click the URL to see your app live!

---

## 🌐 Step 5: Connect Your Domain (notamstudio.net)

### Part A: Configure Vercel
1. In your Vercel project, go to **Settings** → **Domains**
2. Click "Add"
3. Enter: `notamstudio.net`
4. Click "Add"
5. Vercel will show you need to configure DNS
6. **Keep this page open** - you'll need the DNS records

### Part B: Configure Namecheap DNS
1. Go to https://www.namecheap.com
2. Click "Domain List" → Find `notamstudio.net` → Click "Manage"
3. Go to **Advanced DNS** tab
4. Click "Add New Record" and add these:

**Record 1:**
- Type: `CNAME`
- Host: `@`
- Value: `cname.vercel-dns.com`
- TTL: `Automatic`

**Record 2:**
- Type: `CNAME`
- Host: `www`
- Value: `cname.vercel-dns.com`
- TTL: `Automatic`

5. Click "Save All Changes"

### Part C: Verify in Vercel
1. Go back to Vercel → Domains page
2. Click "Refresh" or wait 1-2 minutes
3. Once verified, Vercel will automatically provision SSL certificate
4. Your site will be live at **https://notamstudio.net** in 5-10 minutes!

---

## 🎉 Final Step: Update API URL in Code

After both deployments are complete:

1. Open `frontend/src/components/Sidebar.tsx`
2. Find line ~47 (in `handleParse` function):
   ```typescript
   const response = await axios.post('http://localhost:8000/api/parse', { text: textInput });
   ```
3. Replace with your Railway URL:
   ```typescript
   const response = await axios.post('https://YOUR-RAILWAY-URL.railway.app/api/parse', { text: textInput });
   ```
4. Commit and push this change to GitHub
5. Vercel will auto-redeploy with the new API URL

---

## 📊 Deployment Summary

| Service | Purpose | Cost | URL |
|---------|---------|------|-----|
| Namecheap | Domain | $13.18/year | notamstudio.net |
| Railway | Backend API | FREE | Auto-generated |
| Vercel | Frontend | FREE | notamstudio.net |

**Total Annual Cost: $13.18**

---

## ✅ Checklist

- [ ] Domain purchased (notamstudio.net)
- [ ] GitHub repository created
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Domain DNS configured
- [ ] API URL updated in code
- [ ] Site live at https://notamstudio.net

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Railway logs: Railway Dashboard → Your Project → Deployments → View Logs
2. Check Vercel logs: Vercel Dashboard → Your Project → Deployments → View Function Logs
3. Verify DNS: Use https://dnschecker.org to check if DNS has propagated

**Common Issues:**
- **"Site not found"**: DNS takes 5-30 minutes to propagate globally
- **"API Error"**: Make sure you updated the API URL in Sidebar.tsx
- **"Build failed"**: Check the deployment logs for specific error messages
