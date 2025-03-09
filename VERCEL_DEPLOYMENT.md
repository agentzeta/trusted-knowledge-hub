
# Deploying to Vercel

This guide will walk you through the process of deploying this application to Vercel, allowing for continuous updates while maintaining your deployed version.

## Prerequisites

1. A GitHub account
2. A Vercel account (you can sign up with your GitHub account)
3. Your project code pushed to a GitHub repository

## Step 1: Prepare Your Repository

1. Create a new repository on GitHub if you haven't already
2. Push your code to the repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Sign in to [Vercel](https://vercel.com/)
2. Click on "Add New" > "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install

5. Environment Variables:
   - Add any API keys or secrets your application needs:
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY
     - Any other API keys used in the application

6. Click "Deploy"

## Step 3: Set Up Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository. Whenever you push changes to your main branch, Vercel will automatically rebuild and redeploy your application.

## Step 4: Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions to configure DNS settings

## Step 5: Update Your Application

To update your deployed application:

1. Make changes to your code locally
2. Commit and push to GitHub:

```bash
git add .
git commit -m "Update description"
git push origin main
```

3. Vercel will automatically deploy the changes

## Additional Tips

- Use Vercel's preview deployments by creating pull requests in GitHub
- Set up branch protection rules in GitHub to prevent accidental deployments
- Use Vercel's CLI for more advanced deployment options:
  ```bash
  npm i -g vercel
  vercel login
  vercel
  ```

## Troubleshooting

If you encounter any issues during deployment:

1. Check Vercel's build logs for errors
2. Ensure all environment variables are properly set
3. Verify that your build command is correct
4. Test your application locally with `npm run build` to ensure it builds successfully

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
