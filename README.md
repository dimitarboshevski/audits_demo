# SICPA Audits - Project Audit Analysis Platform

A comprehensive web application for conducting automated project audits with data extraction from Jira, Confluence, and Bitbucket.

## Features

- **Microsoft SSO Authentication Simulation**
- **Multi-Integration Support**: Jira, Confluence, Bitbucket
- **Interactive D3.js Charts**: Velocity trends, burndown charts, bug analysis, team distribution
- **Comprehensive Audit Management**: Create, filter, and manage audits
- **Advanced Analytics**: Automated fact extraction and insights generation
- **Professional Reporting**: Multi-format export (PDF, Excel, JSON)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: D3.js v7
- **Storage**: Browser LocalStorage
- **Architecture**: Single Page Application (SPA)

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SICPA_Audit
   ```

2. **Start local server**
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Deployment to Azure Static Web Apps

### Prerequisites

- Azure subscription
- GitHub account
- Git repository

### Step 1: Create Azure Static Web App

1. **In Azure Portal**:
   - Navigate to "Create a resource" → "Static Web App"
   - Choose subscription and resource group
   - Enter app name: `sicpa-audits`
   - Select deployment source: GitHub
   - Authorize GitHub and select repository
   - Build configuration:
     - Build presets: "Custom"
     - App location: `/`
     - Output location: `/`
   - Click "Review + create"

### Step 2: Configure GitHub Repository

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SICPA Audits application"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **GitHub Actions** will automatically trigger deployment

### Step 3: Access Deployed Application

- Your app will be available at: `https://<app-name>.azurestaticapps.net`
- Custom domain can be configured in Azure portal

## Configuration Files

### `staticwebapp.config.json`
- Routing configuration for SPA
- MIME types and caching headers
- 404 fallback handling

### `.github/workflows/azure-static-web-apps.yml`
- Automated CI/CD pipeline
- Triggered on push to main/master branch
- Handles build and deployment

## Application Structure

```
SICPA_Audit/
├── index.html              # Login page
├── main.html               # Audit management dashboard
├── settings.html           # Integration settings
├── create-audit.html       # New audit creation
├── dashboard.html          # Audit analysis dashboard
├── script.js               # Main application logic
├── charts.js              # D3.js chart implementations
├── styles.css             # Application styling
├── staticwebapp.config.json # Azure deployment config
└── .github/workflows/      # GitHub Actions
```

## Usage

### 1. Authentication
- Click "Sign in with Microsoft" (simulated)
- Or use email/password form

### 2. Integration Setup
- Navigate to Settings
- Configure Jira, Confluence, Bitbucket credentials
- Test connections

### 3. Create Audit
- Click "New Audit" from main dashboard
- Configure audit parameters
- Select data sources and analysis options

### 4. View Results
- Interactive charts and visualizations
- Extracted facts review and editing
- Comprehensive executive summary
- Download reports in multiple formats

## Browser Support

- Chrome 80+
- Firefox 74+
- Safari 13+
- Edge 80+

## Security

- All data stored in browser LocalStorage
- No server-side data transmission
- API credentials used only for direct service calls
- Client-side encryption available

## License

Proprietary - SICPA Internal Use Only

## Support

For technical support or feature requests, contact the development team.Deployment token configured
