# Learn Buddy - Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] Backend requirements.txt is up to date
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No hardcoded localhost URLs

## 🚀 Deployment Steps

### Step 1: Deploy Backend (5 minutes)
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Select repo
4. Settings:
   - Root Directory: `text-to-speech`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Create Web Service
6. **Copy your API URL**: _____________________

### Step 2: Deploy Frontend (3 minutes)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import Project → Select repo
4. Settings:
   - Root Directory: `frontend`
   - Framework: Create React App
5. Environment Variables:
   - Key: `REACT_APP_API_URL`
   - Value: [Paste backend URL from Step 1]
6. Deploy
7. **Your live app**: _____________________

## 🎉 Done!

Your app is live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-api.onrender.com
- **API Docs**: https://your-api.onrender.com/docs

## 🔄 Future Updates

Just push to GitHub - automatic deployment! ✨

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 📱 Share Your App

- Share your Vercel URL with users
- Add to your portfolio/resume
- Post on social media

## ⚠️ Important Notes

1. **First Request**: Render free tier sleeps after 15 min - first request may take 30-50 seconds
2. **Bandwidth**: Vercel free tier has unlimited bandwidth
3. **Custom Domain**: Both platforms support custom domains for free
4. **SSL**: HTTPS enabled automatically on both platforms

## 🆘 Need Help?

Check DEPLOYMENT.md for detailed instructions and troubleshooting.
