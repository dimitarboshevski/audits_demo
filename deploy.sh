#!/bin/bash

# SICPA Audits - Azure Deployment Script

echo "🚀 SICPA Audits - Azure Static Web App Deployment"
echo "================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Please install Azure CLI first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    echo "🔐 Please login to Azure..."
    az login
fi

echo "📦 Adding files to Git..."
git add .

echo "💾 Committing changes..."
git commit -m "Deploy SICPA Audits application - $(date)"

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No Git remote origin found."
    echo "Please add your GitHub repository:"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "🌐 Pushing to GitHub..."
git push origin main

echo "🏗️  Creating Azure Static Web App..."

# Prompt for resource details
read -p "Enter Azure Resource Group name [sicpa-audits-rg]: " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-sicpa-audits-rg}

read -p "Enter Static Web App name [sicpa-audits]: " APP_NAME
APP_NAME=${APP_NAME:-sicpa-audits}

read -p "Enter Azure region [East US 2]: " LOCATION
LOCATION=${LOCATION:-eastus2}

# Get GitHub repository URL
REPO_URL=$(git remote get-url origin)
echo "📁 Repository URL: $REPO_URL"

# Create resource group if it doesn't exist
echo "🏢 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create static web app
echo "⚡ Creating Static Web App..."
az staticwebapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source $REPO_URL \
    --location "$LOCATION" \
    --branch main \
    --app-location "/" \
    --output-location "/" \
    --login-with-github

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. Check GitHub Actions in your repository for build status"
echo "2. Your app will be available at: https://$APP_NAME.azurestaticapps.net"
echo "3. Configure custom domain in Azure portal if needed"
echo ""
echo "🔗 Useful links:"
echo "   Azure Portal: https://portal.azure.com"
echo "   GitHub Actions: ${REPO_URL}/actions"
echo ""
echo "🎉 Happy auditing!"
