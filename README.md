# Project Walkthrough & Deployment Guide

This document outlines how to set up, build, and deploy this project to **GitHub Pages**, as well as how to configure the backend on **Supabase**.

## 1. Prerequisites
- Node.js (v18+)
- A GitHub account and repository for this project.
- A Supabase account.

## 2. Local Setup
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Rename `.env.example` to `.env` and fill in your Supabase details:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 3. Supabase Configuration
Your database uses Supabase for authentication, storage, and database management.
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open the `supabase/schema.sql` file in this repository, copy its contents, and run it in the SQL Editor to generate all necessary tables and RLS policies.
4. Enable Discord or Google Auth via the **Authentication -> Providers** settings in Supabase, and make sure the Site URL matches your local host or your GitHub Pages domain.

## 4. Deploying to GitHub Pages
This project has been configured to be fully compatible with GitHub Pages:
- The router was updated to `HashRouter` (in `src/App.jsx`) to resolve GitHub Pages 404 issues on refresh.
- The base URL was set to `./` in `vite.config.js`.
- The `vercel.json` file has been removed as it is no longer required.

### Step-by-Step Deployment
1. **Push your code to GitHub:**
   Commit all changes and push them to your main branch.
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages"
   git push origin main
   ```

2. **Setup GitHub Actions for Deployment:**
   Create a workflow file in your repository: `.github/workflows/deploy.yml`. Add the following configuration:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: ["main"]
     workflow_dispatch:
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   concurrency:
     group: "pages"
     cancel-in-progress: false
   
   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'
         - name: Install dependencies
           run: npm install
         - name: Build
           env:
             VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
             VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

3. **Configure GitHub Repository Secrets:**
   Since the build process requires your Supabase keys, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your **Repository Settings -> Secrets and variables -> Actions**.

4. **Enable GitHub Pages:**
   Go to your repository **Settings -> Pages**. Under **Build and deployment**, set the **Source** to **GitHub Actions**.

Once you push these changes to the `main` branch, the GitHub Action will automatically build and deploy your app to your `.github.io` URL!
