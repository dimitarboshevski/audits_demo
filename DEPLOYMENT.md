# Azure Deployment Guide - SICPA Audits

## Quick Start (Automated)

### Option 1: Using Deployment Script
```bash
./deploy.sh
```

### Option 2: Manual Azure Portal Deployment

## Prerequisites

1. **Azure Subscription** - Active Azure account
2. **GitHub Account** - Repository hosting
3. **Azure CLI** (optional for script deployment)

## Step-by-Step Manual Deployment

### 1. Prepare Repository

1. **Create GitHub Repository**:
   ```bash
   # Initialize git if not done
   git init
   git add .
   git commit -m "Initial commit: SICPA Audits application"
   git branch -M main
   
   # Add your GitHub repository
   git remote add origin https://github.com/YOUR_USERNAME/sicpa-audits.git
   git push -u origin main
   ```

### 2. Create Azure Static Web App

1. **In Azure Portal**:
   - Go to [portal.azure.com](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

2. **Basic Configuration**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: `sicpa-audits` (or your preferred name)
   - **Plan Type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users

3. **Deployment Details**:
   - **Source**: GitHub
   - **GitHub Account**: Sign in and authorize
   - **Organization**: Your GitHub username/org
   - **Repository**: sicpa-audits (or your repo name)
   - **Branch**: main

4. **Build Details**:
   - **Build Presets**: Custom
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: `/`

5. **Review and Create**:
   - Click "Review + create"
   - Click "Create"

### 3. Automatic Deployment

Azure will automatically:
- Create GitHub Actions workflow
- Build and deploy your application
- Provide you with a URL: `https://YOUR_APP_NAME.azurestaticapps.net`

## Configuration Files Explained

### `staticwebapp.config.json`
```json 
{
  "routes": [
    { "route": "/", "serve": "/index.html" },
    { "route": "/main", "serve": "/main.html" }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

### GitHub Actions Workflow
- Located in `.github/workflows/azure-static-web-apps.yml`
- Automatically triggered on push to main branch
- Handles build and deployment process

## Custom Domain Setup (Optional)

1. **In Azure Portal**:
   - Navigate to your Static Web App
   - Click "Custom domains"
   - Click "Add"
   - Enter your domain name
   - Follow DNS verification steps

2. **SSL Certificate**:
   - Automatically provided by Azure
   - Free Let's Encrypt certificate

## Environment Variables

For production deployment, you may want to configure:
- API endpoints
- Authentication settings
- Feature flags

Add these in Azure Portal:
1. Navigate to your Static Web App
2. Click "Configuration"
3. Add application settings

## Monitoring and Logs

1. **Application Insights**:
   - Enable in Azure portal for detailed analytics
   - Monitor performance and errors

2. **GitHub Actions Logs**:
   - Check build and deployment status
   - View logs at: `https://github.com/YOUR_USERNAME/sicpa-audits/actions`

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check GitHub Actions logs
   - Verify file paths in workflow
   - Ensure all dependencies are included

2. **Routing Issues**:
   - Verify `staticwebapp.config.json` routes
   - Check fallback configuration

3. **Charts Not Loading**:
   - Ensure D3.js CDN is accessible
   - Check browser console for errors
   - Verify `charts.js` is being served correctly

### Debug Steps:

1. **Local Testing**:
   ```bash
   python3 -m http.server 8000
   # Test at http://localhost:8000
   ```

2. **Check Deployment Status**:
   - Azure Portal → Static Web Apps → Your app → Functions
   - GitHub → Actions tab

3. **Browser Developer Tools**:
   - Check Console for JavaScript errors
   - Verify Network tab for failed requests

## Cost Optimization

### Free Tier Limits:
- 100 GB bandwidth per month
- 0.5 GB storage
- Custom domains included

### Scaling:
- Standard tier for production workloads
- Custom authentication providers
- API integration support

## Security Best Practices

1. **HTTPS Only**: Automatically enforced
2. **CORS Configuration**: Set in `staticwebapp.config.json`
3. **Authentication**: Configure in Azure portal
4. **Headers**: Security headers in configuration

## Backup and Recovery

1. **Source Code**: GitHub repository
2. **Configuration**: Export from Azure portal
3. **Data**: Browser localStorage (consider export features)

## Support and Documentation

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [D3.js Documentation](https://d3js.org/)

---

🎉 **Your SICPA Audits application is now live on Azure!**
