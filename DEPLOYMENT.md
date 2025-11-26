# Deployment Guide for Sabor de Londres

This guide will help you deploy your Vite + React application to various platforms so you can share it online.

## ⚠️ Important: API Key Security

Your app uses `GEMINI_API_KEY` which gets embedded in the client bundle at build time. This means the API key will be visible in the browser's JavaScript. Consider:

1. **Using API key restrictions** in Google Cloud Console to limit usage
2. **Setting up a backend proxy** (more secure) to keep the key server-side
3. **Using environment variables** that are injected at build time (current approach)

## Prerequisites

1. Make sure your app builds successfully:
   ```bash
   pnpm run build
   ```

2. Have your `GEMINI_API_KEY` ready (you'll need to add it as an environment variable in your deployment platform)

---

## Option 1: Vercel (Recommended - Easiest)

**Best for:** Quick deployment, automatic HTTPS, custom domains

### Steps:

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Sign up at [vercel.com](https://vercel.com)** (free account)

3. **Import your GitHub repository:**
   - Click "New Project"
   - Import your GitHub repo
   - Configure project settings:
     - **Framework Preset:** Vite
     - **Build Command:** `pnpm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `pnpm install`

4. **Add Environment Variable:**
   - Go to Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your-api-key-here`
   - Make sure it's added for "Production", "Preview", and "Development"

5. **Deploy!** Vercel will automatically deploy and give you a URL like `your-app-name.vercel.app`

### Automatic Deployments
- Every push to `main` triggers a production deployment
- Pull requests get preview deployments automatically

---

## Option 2: Netlify

**Best for:** Simple deployment, great free tier, form handling

### Steps:

1. **Push your code to GitHub** (see Option 1)

2. **Sign up at [netlify.com](https://netlify.com)** (free account)

3. **Deploy from Git:**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     - **Build command:** `pnpm run build`
     - **Publish directory:** `dist`
     - **Base directory:** (leave empty)

4. **Add Environment Variable:**
   - Go to Site Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your-api-key-here`

5. **Deploy!** Netlify will give you a URL like `your-app-name.netlify.app`

### Manual Deployment (Alternative)
If you prefer to deploy manually:
```bash
pnpm run build
npx netlify-cli deploy --prod --dir=dist
```

---

## Option 3: Cloudflare Pages

**Best for:** Fast global CDN, generous free tier, edge computing

### Steps:

1. **Push your code to GitHub**

2. **Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)**

3. **Create a new project:**
   - Connect to GitHub
   - Select your repository
   - Build settings:
     - **Framework preset:** Vite
     - **Build command:** `pnpm run build`
     - **Build output directory:** `dist`

4. **Add Environment Variable:**
   - Go to Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your-api-key-here`

5. **Deploy!** You'll get a URL like `your-app-name.pages.dev`

---

## Option 4: GitHub Pages

**Best for:** Free hosting directly from GitHub, simple setup

### Steps:

1. **Install gh-pages package:**
   ```bash
   pnpm add -D gh-pages
   ```

2. **Update `package.json`:**
   Add to scripts:
   ```json
   "predeploy": "pnpm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Update `vite.config.ts`:**
   Add `base: '/your-repo-name/'` if deploying to a subdirectory

4. **Add Environment Variable:**
   GitHub Pages doesn't support server-side environment variables.
   You'll need to:
   - Create a `.env.production` file locally with your API key
   - **⚠️ Important:** Add `.env.production` to `.gitignore` and don't commit it
   - Or use GitHub Secrets and GitHub Actions for builds

5. **Deploy:**
   ```bash
   pnpm run deploy
   ```

6. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select source: `gh-pages` branch
   - Your site will be at `username.github.io/repo-name`

---

## Option 5: Render

**Best for:** Simple setup, good free tier, automatic SSL

### Steps:

1. **Push your code to GitHub**

2. **Sign up at [render.com](https://render.com)**

3. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Connect GitHub repository
   - Build settings:
     - **Build Command:** `pnpm run build`
     - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   - Go to Environment tab
   - Add: `GEMINI_API_KEY` = `your-api-key-here`

5. **Deploy!** You'll get a URL like `your-app-name.onrender.com`

---

## Quick Comparison

| Platform | Free Tier | Setup Time | Best For |
|----------|-----------|------------|----------|
| **Vercel** | ✅ Excellent | ⚡ Fastest | Production apps |
| **Netlify** | ✅ Excellent | ⚡ Fast | All-purpose |
| **Cloudflare Pages** | ✅ Excellent | ⚡ Fast | Global performance |
| **GitHub Pages** | ✅ Free | ⚠️ Medium | Open source projects |
| **Render** | ✅ Good | ⚡ Fast | Simple deployments |

---

## Post-Deployment Checklist

- [ ] Test your deployed site
- [ ] Verify API key works (check browser console for errors)
- [ ] Test all features (search, map, etc.)
- [ ] Update `index.html` with your new URL for SEO tags
- [ ] Set up a custom domain (optional)
- [ ] Enable analytics (optional)

---

## Troubleshooting

### Build fails with "API key not found"
- Make sure environment variable is set in deployment platform
- Variable name must match exactly: `GEMINI_API_KEY`
- Redeploy after adding environment variables

### API calls fail in production
- Check browser console for errors
- Verify API key is correctly set in environment variables
- Check if API key has domain restrictions that need updating

### 404 errors when refreshing pages
- For Vercel/Netlify: They handle this automatically with SPA rewrites
- For GitHub Pages: May need a `404.html` that redirects to `index.html`

---

## Need Help?

- Check your deployment platform's documentation
- Review build logs in the deployment dashboard
- Test locally with `pnpm run build && pnpm run preview`

