# 🚀 Learn Buddy - Free Deployment Guide

Deploy your Learn Buddy application for **FREE** using popular hosting platforms!

## 📋 Table of Contents
- [Backend Deployment (FastAPI)](#backend-deployment)
- [Frontend Deployment (React)](#frontend-deployment)
- [Environment Variables](#environment-variables)
- [Testing Your Deployment](#testing)

---

## 🔧 Backend Deployment

### Option 1: Render (Recommended) ⭐

**Free Tier**: 750 hours/month, automatic HTTPS, custom domains

1. **Sign up at [Render.com](https://render.com)**

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Learn-buddy` repository

3. **Configure the service**:
   - **Name**: `learn-buddy-api`
   - **Region**: Choose closest to your users
   - **Root Directory**: `text-to-speech`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. **Click "Create Web Service"**

5. **Wait for deployment** (3-5 minutes)

6. **Copy your API URL** (e.g., `https://learn-buddy-api.onrender.com`)

**Note**: Free tier services spin down after 15 minutes of inactivity. First request may take 30-50 seconds.

---

### Option 2: Railway

**Free Tier**: $5 credit/month, automatic HTTPS

1. **Sign up at [Railway.app](https://railway.app)**

2. **New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose `text-to-speech` directory

3. **Configuration**:
   - Railway auto-detects Python
   - Add environment variable: `PORT` (Railway sets this automatically)

4. **Deploy** and copy your API URL

---

### Option 3: PythonAnywhere

**Free Tier**: 1 web app, 512MB storage

1. **Sign up at [PythonAnywhere.com](https://www.pythonanywhere.com)**

2. **Create Web App**
   - Go to "Web" tab
   - Click "Add a new web app"
   - Choose "Manual configuration" → Python 3.10

3. **Configure WSGI**:
   - Edit WSGI configuration file
   - Add:
   ```python
   from app.main import app as application
   ```

4. **Install dependencies**:
   - Open Bash console
   - `pip install -r requirements.txt`

5. **Reload web app**

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended) ⭐

**Free Tier**: Unlimited bandwidth, automatic HTTPS, preview deployments

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**:
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`
   - (Use the URL from backend deployment)

5. **Deploy** - Takes 1-2 minutes

6. **Get your URL**: `https://your-app.vercel.app`

---

### Option 2: Netlify

**Free Tier**: 100GB bandwidth/month, automatic HTTPS

1. **Sign up at [Netlify.com](https://netlify.com)**

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

4. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

5. **Deploy Site**

---

### Option 3: GitHub Pages

**Free Tier**: Unlimited for public repos

1. **Install gh-pages**:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Add to `package.json`**:
   ```json
   {
     "homepage": "https://yourusername.github.io/Learn-buddy",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages** in repository settings

---

## 🔐 Environment Variables

### Backend Environment Variables (Optional)

No environment variables required for basic deployment!

### Frontend Environment Variables (Required)

Create `.env.production` in `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**For Vercel**: Add in dashboard → Settings → Environment Variables  
**For Netlify**: Add in Site settings → Environment variables  
**For GitHub Pages**: Hardcode in `constants/index.js` (not recommended for sensitive data)

---

## ✅ Testing Your Deployment

### 1. Test Backend API

Visit your backend URL:
```
https://your-backend-url.onrender.com/docs
```

You should see the FastAPI interactive documentation.

Test the health endpoint:
```
https://your-backend-url.onrender.com/health
```

Should return: `{"status": "healthy", "service": "text-to-speech"}`

### 2. Test Frontend

Visit your frontend URL:
```
https://your-app.vercel.app
```

1. Navigate to "Reading Practice"
2. Select a language (e.g., Hindi)
3. Choose a reading material
4. Click "Start Reading"
5. Verify TTS works

---

## 🎯 Recommended Setup

**Best Free Combination**:
- **Backend**: Render (reliable, easy, auto-deploy)
- **Frontend**: Vercel (fast, unlimited bandwidth, great DX)

**Total Cost**: $0/month  
**Setup Time**: 15-20 minutes  
**Maintenance**: Auto-deploy on git push

---

## 🔄 Deployment Workflow

1. **Deploy Backend First** (Render/Railway)
   - Get backend URL

2. **Configure Frontend** with backend URL
   - Update environment variable

3. **Deploy Frontend** (Vercel/Netlify)
   - Done!

4. **Future Updates**:
   - Just push to GitHub
   - Automatic deployment! 🎉

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Application failed to respond"**
- Check build logs on Render/Railway
- Verify `requirements.txt` is complete
- Ensure start command is correct

**CORS Errors**
- Backend already has CORS enabled for all origins
- If issues persist, check browser console

### Frontend Issues

**API Calls Failing**
- Verify `REACT_APP_API_URL` is set correctly
- Check if backend is running (visit `/health` endpoint)
- Check browser console for errors

**Build Failures**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall
- Check Node version (should be 14+)

### Performance Issues

**Backend Slow First Request**
- Free tier services sleep after 15 min inactivity
- Consider using a service like UptimeRobot to ping every 5 minutes
- Or upgrade to paid tier ($7/month on Render)

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Render** | 750h/month | $7/month | Backend APIs |
| **Railway** | $5 credit | $5/month usage | Full-stack apps |
| **Vercel** | Unlimited | $20/month | Frontend apps |
| **Netlify** | 100GB/month | $19/month | Static sites |
| **GitHub Pages** | Unlimited | Free | Public projects |

---

## 🚀 Quick Start Commands

### Deploy Backend to Render
1. Push code to GitHub
2. Connect repo on Render
3. Click Deploy

### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### One-Click Deployment

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/KARTIKNAIK18/Learn-buddy)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KARTIKNAIK18/Learn-buddy)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🎉 Success!

Your Learn Buddy app is now live and accessible worldwide! 🌍

**Share your deployed app**:
- Frontend: `https://your-app.vercel.app`
- API Docs: `https://your-backend-url.onrender.com/docs`

Happy learning! 📚✨
