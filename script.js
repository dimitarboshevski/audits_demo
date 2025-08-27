// Global state management
let currentUser = null;
let currentAudit = null;
let analysisSteps = [];
let extractedFacts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and redirect only on login page
    const user = localStorage.getItem('sicpa_user');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (user && (currentPage === 'index.html' || currentPage === '')) {
        window.location.href = 'main.html';
    }
});

// Login functionality
function simulateLogin() {
    showLoading();
    
    setTimeout(() => {
        const user = {
            name: 'John Doe',
            email: 'john.doe@company.com',
            avatar: 'JD'
        };
        
        localStorage.setItem('sicpa_user', JSON.stringify(user));
        hideLoading();
        window.location.href = 'main.html';
    }, 2000);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        showLoading();
        
        setTimeout(() => {
            const user = {
                name: email.split('@')[0],
                email: email,
                avatar: email.substring(0, 2).toUpperCase()
            };
            
            localStorage.setItem('sicpa_user', JSON.stringify(user));
            hideLoading();
            window.location.href = 'main.html';
        }, 1500);
    }
}

function logout() {
    localStorage.removeItem('sicpa_user');
    localStorage.removeItem('sicpa_settings');
    localStorage.removeItem('current_audit_id');
    localStorage.removeItem('sicpa_audits');
    window.location.href = 'index.html';
}

// Loading overlay functions
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Settings functionality
function saveSettings() {
    const settings = {
        jira: {
            url: document.getElementById('jiraUrl')?.value || '',
            username: document.getElementById('jiraUsername')?.value || '',
            token: document.getElementById('jiraToken')?.value || ''
        },
        confluence: {
            url: document.getElementById('confluenceUrl')?.value || '',
            username: document.getElementById('confluenceUsername')?.value || '',
            token: document.getElementById('confluenceToken')?.value || ''
        },
        bitbucket: {
            url: document.getElementById('bitbucketUrl')?.value || '',
            username: document.getElementById('bitbucketUsername')?.value || '',
            token: document.getElementById('bitbucketToken')?.value || ''
        }
    };
    
    localStorage.setItem('sicpa_settings', JSON.stringify(settings));
    
    // Show success message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Settings Saved!';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Individual settings save functions
function saveJiraSettings() {
    const jiraSettings = {
        url: document.getElementById('jiraUrl')?.value || '',
        username: document.getElementById('jiraUsername')?.value || '',
        token: document.getElementById('jiraToken')?.value || ''
    };
    
    const settings = JSON.parse(localStorage.getItem('sicpa_settings') || '{}');
    settings.jira = jiraSettings;
    localStorage.setItem('sicpa_settings', JSON.stringify(settings));
    
    // Update connection status if all fields are filled
    if (jiraSettings.url && jiraSettings.username && jiraSettings.token) {
        updateConnectionStatus('jira', 'connected');
    }
    
    showButtonSuccess(event.target, 'Jira Settings Saved!');
}

function saveConfluenceSettings() {
    const confluenceSettings = {
        url: document.getElementById('confluenceUrl')?.value || '',
        username: document.getElementById('confluenceUsername')?.value || '',
        token: document.getElementById('confluenceToken')?.value || ''
    };
    
    const settings = JSON.parse(localStorage.getItem('sicpa_settings') || '{}');
    settings.confluence = confluenceSettings;
    localStorage.setItem('sicpa_settings', JSON.stringify(settings));
    
    // Update connection status if all fields are filled
    if (confluenceSettings.url && confluenceSettings.username && confluenceSettings.token) {
        updateConnectionStatus('confluence', 'connected');
    }
    
    showButtonSuccess(event.target, 'Confluence Settings Saved!');
}

function saveBitbucketSettings() {
    const bitbucketSettings = {
        url: document.getElementById('bitbucketUrl')?.value || '',
        username: document.getElementById('bitbucketUsername')?.value || '',
        token: document.getElementById('bitbucketToken')?.value || ''
    };
    
    const settings = JSON.parse(localStorage.getItem('sicpa_settings') || '{}');
    settings.bitbucket = bitbucketSettings;
    localStorage.setItem('sicpa_settings', JSON.stringify(settings));
    
    // Update connection status if all fields are filled
    if (bitbucketSettings.url && bitbucketSettings.username && bitbucketSettings.token) {
        updateConnectionStatus('bitbucket', 'connected');
    }
    
    showButtonSuccess(event.target, 'Bitbucket Settings Saved!');
}

// Update connection status display
function updateConnectionStatus(service, status) {
    const statusElements = document.querySelectorAll(`.connection-item .connection-details .connection-status`);
    statusElements.forEach(element => {
        const parentItem = element.closest('.connection-item');
        const serviceName = parentItem.querySelector('h4').textContent.toLowerCase();
        
        if (serviceName === service) {
            element.className = `connection-status status-${status}`;
            element.textContent = status === 'connected' ? 'Connected' : 'Not Connected';
        }
    });
}

// Connection test functions
function testJiraConnection() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Testing...';
    button.disabled = true;
    
    setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate simulation
        if (success) {
            button.textContent = 'Connection OK ✓';
            button.style.background = '#28a745';
        } else {
            button.textContent = 'Connection Failed ✗';
            button.style.background = '#dc3545';
        }
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }, 2000);
}

function testConfluenceConnection() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Testing...';
    button.disabled = true;
    
    setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
            button.textContent = 'Connection OK ✓';
            button.style.background = '#28a745';
        } else {
            button.textContent = 'Connection Failed ✗';
            button.style.background = '#dc3545';
        }
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }, 2000);
}

function testBitbucketConnection() {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Testing...';
    button.disabled = true;
    
    setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
            button.textContent = 'Connection OK ✓';
            button.style.background = '#28a745';
        } else {
            button.textContent = 'Connection Failed ✗';
            button.style.background = '#dc3545';
        }
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }, 2000);
}

// Security settings functions
function saveSecuritySettings() {
    // Collect all security settings
    const securitySettings = {
        auditLogging: document.querySelector('input[value="audit-logging"]')?.checked || false,
        autoDelete: document.querySelector('input[value="auto-delete"]')?.checked || false,
        encryptData: document.querySelector('input[value="encrypt-data"]')?.checked || false,
        anonymizeData: document.querySelector('input[value="anonymize-data"]')?.checked || false,
        usageAnalytics: document.querySelector('input[value="usage-analytics"]')?.checked || false
    };
    
    localStorage.setItem('sicpa_security_settings', JSON.stringify(securitySettings));
    showButtonSuccess(event.target, 'Security Settings Saved!');
}

function exportSettings() {
    const settings = {
        general: JSON.parse(localStorage.getItem('sicpa_settings') || '{}'),
        security: JSON.parse(localStorage.getItem('sicpa_security_settings') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'sicpa_audit_settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showButtonSuccess(event.target, 'Settings Exported!');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
        localStorage.clear();
        alert('All data has been cleared. The page will now reload.');
        window.location.reload();
    }
}

// Utility functions
function showButtonSuccess(button, message) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    
    button.textContent = message;
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBg;
    }, 2000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('sicpa_settings') || '{}');
    
    // Populate form fields and update connection status
    if (settings.jira) {
        const jiraUrl = document.getElementById('jiraUrl');
        const jiraUsername = document.getElementById('jiraUsername');
        const jiraToken = document.getElementById('jiraToken');
        
        if (jiraUrl) jiraUrl.value = settings.jira.url || '';
        if (jiraUsername) jiraUsername.value = settings.jira.username || '';
        if (jiraToken) jiraToken.value = settings.jira.token || '';
        
        // Update connection status if all fields are filled
        if (settings.jira.url && settings.jira.username && settings.jira.token) {
            updateConnectionStatus('jira', 'connected');
        }
    }
    
    if (settings.confluence) {
        const confluenceUrl = document.getElementById('confluenceUrl');
        const confluenceUsername = document.getElementById('confluenceUsername');
        const confluenceToken = document.getElementById('confluenceToken');
        
        if (confluenceUrl) confluenceUrl.value = settings.confluence.url || '';
        if (confluenceUsername) confluenceUsername.value = settings.confluence.username || '';
        if (confluenceToken) confluenceToken.value = settings.confluence.token || '';
        
        // Update connection status if all fields are filled
        if (settings.confluence.url && settings.confluence.username && settings.confluence.token) {
            updateConnectionStatus('confluence', 'connected');
        }
    }
    
    if (settings.bitbucket) {
        const bitbucketUrl = document.getElementById('bitbucketUrl');
        const bitbucketUsername = document.getElementById('bitbucketUsername');
        const bitbucketToken = document.getElementById('bitbucketToken');
        
        if (bitbucketUrl) bitbucketUrl.value = settings.bitbucket.url || '';
        if (bitbucketUsername) bitbucketUsername.value = settings.bitbucket.username || '';
        if (bitbucketToken) bitbucketToken.value = settings.bitbucket.token || '';
        
        // Update connection status if all fields are filled
        if (settings.bitbucket.url && settings.bitbucket.username && settings.bitbucket.token) {
            updateConnectionStatus('bitbucket', 'connected');
        }
    }
}

// Main page functionality
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('sicpa_user') || '{}');
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    
    if (userAvatar) userAvatar.textContent = user.avatar || 'U';
    if (userName) userName.textContent = user.name || 'User';
}

function loadAudits() {
    let audits = JSON.parse(localStorage.getItem('sicpa_audits') || '[]');
    
    // Initialize with mock data if no audits exist
    if (audits.length === 0) {
        audits = getMockAudits();
        localStorage.setItem('sicpa_audits', JSON.stringify(audits));
    }
    
    // Store all audits for filtering
    window.allAudits = audits;
    
    renderAudits(audits);
    updateFilterSummary(audits.length, audits.length);
}

function renderAudits(audits) {
    const auditGrid = document.querySelector('.audit-grid');
    if (!auditGrid) return;
    
    if (audits.length === 0) {
        auditGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6c757d;">
                <p>No audits found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    auditGrid.innerHTML = audits.map(audit => `
        <div class="audit-card" onclick="openAudit('${audit.id}')">
            <div class="audit-status status-${audit.status.replace(/\s+/g, '-').toLowerCase()}">${audit.status}</div>
            <div class="audit-title">${audit.name}</div>
            <div class="audit-meta">Project: ${audit.project}</div>
            <div class="audit-meta">Category: ${audit.category || 'N/A'}</div>
            <div class="audit-meta">Created: ${new Date(audit.created).toLocaleDateString()}</div>
            <div class="audit-meta">Duration: ${audit.timeRange}</div>
            <div class="audit-meta">Team: ${audit.teamSize} members</div>
        </div>
    `).join('');
}

function filterAudits() {
    if (!window.allAudits) return;
    
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const projectFilter = document.getElementById('projectFilter').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filteredAudits = window.allAudits.filter(audit => {
        // Status filter
        if (statusFilter !== 'all' && audit.status !== statusFilter) {
            return false;
        }
        
        // Category filter
        if (categoryFilter !== 'all' && audit.category !== categoryFilter) {
            return false;
        }
        
        // Project name filter
        if (projectFilter && !audit.project.toLowerCase().includes(projectFilter)) {
            return false;
        }
        
        // Date filter
        if (dateFilter !== 'all') {
            const auditDate = new Date(audit.created);
            const now = new Date();
            const diffTime = now - auditDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            switch (dateFilter) {
                case 'last-week':
                    if (diffDays > 7) return false;
                    break;
                case 'last-month':
                    if (diffDays > 30) return false;
                    break;
                case 'last-quarter':
                    if (diffDays > 90) return false;
                    break;
                case 'last-year':
                    if (diffDays > 365) return false;
                    break;
            }
        }
        
        return true;
    });
    
    renderAudits(filteredAudits);
    updateFilterSummary(filteredAudits.length, window.allAudits.length);
}

function clearFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('projectFilter').value = '';
    document.getElementById('dateFilter').value = 'all';
    
    if (window.allAudits) {
        renderAudits(window.allAudits);
        updateFilterSummary(window.allAudits.length, window.allAudits.length);
    }
}

function updateFilterSummary(filtered, total) {
    const filterSummary = document.getElementById('filterSummary');
    const filteredCount = document.getElementById('filteredCount');
    const totalCount = document.getElementById('totalCount');
    
    if (filterSummary && filteredCount && totalCount) {
        filteredCount.textContent = filtered;
        totalCount.textContent = total;
        
        if (filtered < total) {
            filterSummary.style.display = 'block';
        } else {
            filterSummary.style.display = 'none';
        }
    }
}

function getMockAudits() {
    return [
        {
            id: 'audit_001',
            name: 'E-Commerce Platform Q3 2024',
            project: 'Online Store Redesign',
            status: 'completed',
            created: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
            timeRange: 'Q3 2024 (3 months)',
            teamSize: 12,
            facts: [
                "12 project members: 6 developers, 3 QA engineers, 2 UX designers, 1 PM",
                "New React architecture introduced on July 15, 2024",
                "Senior Frontend Developer Maria Garcia joined in August 2024",
                "Average story completion time: 2.8 days",
                "Code review process improved with automated testing",
                "Team velocity increased by 35% in Q3 2024",
                "New payment gateway integration completed successfully"
            ],
            stats: {
                totalStories: 243,
                completionRate: '94%',
                avgDaysPerStory: 2.8,
                teamMembers: 12,
                velocity: 58
            }
        },
        {
            id: 'audit_002',
            name: 'Mobile Banking App Security Audit',
            project: 'Banking Mobile Platform',
            status: 'completed',
            created: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
            timeRange: 'August 2024 (1 month)',
            teamSize: 8,
            facts: [
                "8 project members: 4 developers, 2 security specialists, 1 QA, 1 PM",
                "Enhanced security protocols implemented on August 1, 2024",
                "Penetration testing completed with zero critical vulnerabilities",
                "Average security review time: 1.5 days",
                "Implemented two-factor authentication for all transactions",
                "Security compliance improved by 28%",
                "New encryption standards adopted across all modules"
            ],
            stats: {
                totalStories: 89,
                completionRate: '100%',
                avgDaysPerStory: 1.5,
                teamMembers: 8,
                velocity: 42
            }
        },
        {
            id: 'audit_003',
            name: 'CRM System Integration',
            project: 'Customer Management Platform',
            status: 'in progress',
            created: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
            timeRange: 'September 2024 (ongoing)',
            teamSize: 10,
            facts: [
                "10 project members: 5 developers, 2 QA engineers, 2 business analysts, 1 PM",
                "Salesforce integration started on September 1, 2024",
                "New data migration specialist John Smith joined in September",
                "Average story completion time: 3.5 days",
                "API integration testing in progress",
                "Current sprint velocity: 45 story points",
                "Data migration phase 1 completed successfully"
            ],
            stats: {
                totalStories: 156,
                completionRate: '67%',
                avgDaysPerStory: 3.5,
                teamMembers: 10,
                velocity: 45
            }
        },
        {
            id: 'audit_004',
            name: 'Data Analytics Dashboard',
            project: 'Business Intelligence Platform',
            status: 'completed',
            created: Date.now() - (45 * 24 * 60 * 60 * 1000), // 45 days ago
            timeRange: 'June-July 2024 (2 months)',
            teamSize: 6,
            facts: [
                "6 project members: 3 developers, 1 data scientist, 1 QA, 1 PM",
                "PowerBI integration completed on June 20, 2024",
                "Real-time analytics capabilities added",
                "Average dashboard load time: 1.2 seconds",
                "Implemented advanced data visualization components",
                "Performance optimization resulted in 40% faster queries",
                "User adoption rate reached 85% within first month"
            ],
            stats: {
                totalStories: 78,
                completionRate: '100%',
                avgDaysPerStory: 2.1,
                teamMembers: 6,
                velocity: 35
            }
        },
        {
            id: 'audit_005',
            name: 'Cloud Migration Project',
            project: 'Infrastructure Modernization',
            status: 'pending',
            created: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
            timeRange: 'Planned for Q4 2024',
            teamSize: 15,
            facts: [],
            stats: {
                totalStories: 0,
                completionRate: '0%',
                avgDaysPerStory: 0,
                teamMembers: 15,
                velocity: 0
            }
        }
    ];
}

function createNewAudit() {
    window.location.href = 'create-audit.html';
}

function handleAuditCreation(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.getElementById('auditName').value,
        project: document.getElementById('projectName').value,
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value,
        timeRange: document.getElementById('timeRange').value,
        teamSize: document.getElementById('teamSize').value,
        sprintDuration: document.getElementById('sprintDuration').value,
        methodology: document.getElementById('methodology').value,
        department: document.getElementById('department').value,
        analysisDepth: document.getElementById('analysisDepth').value,
        reportFormat: document.getElementById('reportFormat').value,
        confidentialityLevel: document.getElementById('confidentialityLevel').value,
        notifications: document.getElementById('notifications').value,
        includeWeekends: document.getElementById('includeWeekends').value
    };
    
    // Handle custom date range
    if (formData.timeRange === 'custom') {
        formData.startDate = document.getElementById('startDate').value;
        formData.endDate = document.getElementById('endDate').value;
    }
    
    // Collect data sources
    formData.sources = Array.from(document.querySelectorAll('input[name="sources"]:checked')).map(cb => cb.value);
    
    // Collect source-specific options
    formData.jiraOptions = Array.from(document.querySelectorAll('input[name="jira-options"]:checked')).map(cb => cb.value);
    formData.confluenceOptions = Array.from(document.querySelectorAll('input[name="confluence-options"]:checked')).map(cb => cb.value);
    formData.bitbucketOptions = Array.from(document.querySelectorAll('input[name="bitbucket-options"]:checked')).map(cb => cb.value);
    
    // Collect advanced options
    formData.advancedOptions = Array.from(document.querySelectorAll('input[name="advanced-options"]:checked')).map(cb => cb.value);
    
    // Create audit object
    const audit = {
        id: 'audit_' + Date.now(),
        name: formData.name,
        project: formData.project,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        status: 'pending',
        created: Date.now(),
        timeRange: getTimeRangeDisplay(formData.timeRange, formData.startDate, formData.endDate),
        teamSize: getTeamSizeNumber(formData.teamSize),
        configuration: formData,
        facts: [],
        stats: {
            totalStories: 0,
            completionRate: '0%',
            avgDaysPerStory: 0,
            teamMembers: getTeamSizeNumber(formData.teamSize),
            velocity: 0
        }
    };
    
    // Save audit
    const audits = JSON.parse(localStorage.getItem('sicpa_audits') || '[]');
    audits.push(audit);
    localStorage.setItem('sicpa_audits', JSON.stringify(audits));
    
    // Set as current audit and mark for auto-start, then redirect to dashboard
    localStorage.setItem('current_audit_id', audit.id);
    localStorage.setItem('auto_start_analysis', 'true');
    window.location.href = 'dashboard.html';
}

function saveAsDraft() {
    const formData = new FormData(document.getElementById('auditCreationForm'));
    localStorage.setItem('audit_draft', JSON.stringify(Object.fromEntries(formData)));
    
    // Show success message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Draft Saved!';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function getTimeRangeDisplay(timeRange, startDate, endDate) {
    switch (timeRange) {
        case 'last1month': return 'Last 1 Month';
        case 'last3months': return 'Last 3 Months';
        case 'last6months': return 'Last 6 Months';
        case 'last1year': return 'Last 1 Year';
        case 'custom': return `${startDate} to ${endDate}`;
        default: return 'Last 3 Months';
    }
}

function getTeamSizeNumber(teamSize) {
    switch (teamSize) {
        case 'small': return Math.floor(Math.random() * 4) + 2; // 2-5
        case 'medium': return Math.floor(Math.random() * 9) + 6; // 6-14
        case 'large': return Math.floor(Math.random() * 10) + 15; // 15-24
        default: return Math.floor(Math.random() * 15) + 5; // 5-19
    }
}

function openAudit(auditId) {
    localStorage.setItem('current_audit_id', auditId);
    window.location.href = 'dashboard.html';
}

// Dashboard functionality
function loadAuditInfo() {
    const auditId = localStorage.getItem('current_audit_id');
    let audits = JSON.parse(localStorage.getItem('sicpa_audits') || '[]');
    
    // Initialize with mock data if no audits exist
    if (audits.length === 0) {
        audits = getMockAudits();
        localStorage.setItem('sicpa_audits', JSON.stringify(audits));
    }
    
    currentAudit = audits.find(a => a.id === auditId);
    
    if (currentAudit) {
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) {
            headerTitle.textContent = `Audit: ${currentAudit.name}`;
        }
        
        // Check if we should auto-start analysis (from create-audit form)
        const autoStart = localStorage.getItem('auto_start_analysis');
        if (autoStart === 'true') {
            localStorage.removeItem('auto_start_analysis'); // Remove flag after use
            autoStartAnalysis();
            return;
        }
        
        // If this is a completed audit, show the completed analysis
        if (currentAudit.status === 'completed' && currentAudit.facts && currentAudit.facts.length > 0) {
            showCompletedAudit();
        }
    }
}

function autoStartAnalysis() {
    // Update audit status to in-progress
    if (currentAudit) {
        currentAudit.status = 'in progress';
        updateAuditInStorage();
    }
    
    // Hide filters and show analysis steps immediately
    const filtersSection = document.querySelector('.filters');
    const analysisSection = document.querySelector('.analysis-steps');
    
    if (filtersSection) filtersSection.style.display = 'none';
    if (analysisSection) analysisSection.style.display = 'block';
    
    // Show a brief loading message
    setTimeout(() => {
        // Start the analysis simulation automatically
        simulateDataExtraction();
    }, 500);
}

function showCompletedAudit() {
    // Hide filters and show completed analysis
    const filtersSection = document.querySelector('.filters');
    const analysisSection = document.querySelector('.analysis-steps');
    
    if (filtersSection) filtersSection.style.display = 'none';
    if (analysisSection) analysisSection.style.display = 'block';
    
    // Show all steps as completed
    const steps = ['extraction', 'ingestion', 'analysis', 'facts', 'dashboard'];
    steps.forEach(stepId => {
        const stepElement = document.getElementById(`step-${stepId}`);
        if (stepElement) {
            stepElement.classList.add('completed');
            const progressBar = stepElement.querySelector('.progress-fill');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }
    });
    
    // Show facts from the current audit
    extractedFacts = [...currentAudit.facts];
    displayFacts();
    
    // Show final dashboard step
    const dashboardStep = document.getElementById('step-dashboard');
    if (dashboardStep) {
        dashboardStep.style.display = 'block';
        dashboardStep.classList.add('active');
    }
    
    // Show facts and dashboard sections
    const factsStep = document.getElementById('step-facts');
    if (factsStep) {
        factsStep.style.display = 'block';
        factsStep.classList.add('active');
    }
    
    generateCompletedDashboard();
}

function generateCompletedDashboard() {
    if (!currentAudit || !currentAudit.stats) return;
    
    // Call the proper final dashboard generation (which includes D3.js charts)
    // Add a small delay to ensure DOM elements are ready
    setTimeout(() => {
        generateFinalDashboard();
    }, 100);
}

function startAnalysis() {
    const filters = {
        timeRange: document.getElementById('timeRange')?.value || 'last3months',
        project: document.getElementById('project')?.value || '',
        sources: Array.from(document.querySelectorAll('input[name="sources"]:checked')).map(cb => cb.value)
    };
    
    // Store the manual filters for this audit
    if (currentAudit) {
        currentAudit.manualFilters = filters;
        updateAuditInStorage();
    }
    
    // Hide filters and show analysis steps
    document.querySelector('.filters').style.display = 'none';
    document.querySelector('.analysis-steps').style.display = 'block';
    
    // Start the analysis simulation
    simulateDataExtraction();
}

function updateAuditInStorage() {
    if (!currentAudit) return;
    
    const audits = JSON.parse(localStorage.getItem('sicpa_audits') || '[]');
    const auditIndex = audits.findIndex(a => a.id === currentAudit.id);
    
    if (auditIndex !== -1) {
        audits[auditIndex] = currentAudit;
        localStorage.setItem('sicpa_audits', JSON.stringify(audits));
    }
}

function simulateDataExtraction() {
    const steps = [
        { id: 'extraction', title: 'Data Extraction', duration: 3000 },
        { id: 'ingestion', title: 'Data Ingestion', duration: 2000 },
        { id: 'analysis', title: 'Data Analysis', duration: 4000 }
    ];
    
    let currentStep = 0;
    
    function processStep() {
        if (currentStep >= steps.length) {
            // After data analysis completes, show facts review
            showFactsReview();
            return;
        }
        
        const step = steps[currentStep];
        const stepElement = document.getElementById(`step-${step.id}`);
        
        if (stepElement) {
            stepElement.classList.add('active');
            
            // Simulate progress
            const progressBar = stepElement.querySelector('.progress-fill');
            if (progressBar) {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        
                        stepElement.classList.remove('active');
                        stepElement.classList.add('completed');
                        
                        currentStep++;
                        setTimeout(processStep, 500);
                    }
                    progressBar.style.width = progress + '%';
                }, step.duration / 10);
            }
        }
    }
    
    processStep();
}

function showFactsReview() {
    // Generate random facts for new audits
    if (!currentAudit || !currentAudit.facts || currentAudit.facts.length === 0) {
        extractedFacts = generateRealisticFacts();
        console.log('Generated facts:', extractedFacts); // Debug log
    } else {
        extractedFacts = [...currentAudit.facts];
        console.log('Using existing facts:', extractedFacts); // Debug log
    }
    
    // Make sure the facts step is visible and marked as active
    const factsStep = document.getElementById('step-facts');
    if (factsStep) {
        factsStep.classList.add('active');
        factsStep.style.display = 'block';
        console.log('Facts step found and set to active'); // Debug log
    } else {
        console.error('Facts step element not found!'); // Debug log
    }
    
    // Display the facts
    displayFacts();
    console.log('displayFacts() called'); // Debug log
    
    // Scroll to facts section
    setTimeout(() => {
        if (factsStep) {
            factsStep.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function generateRealisticFacts() {
    const today = new Date();
    const teamSize = currentAudit?.teamSize || 8;
    const category = currentAudit?.category || 'development';
    const sources = currentAudit?.configuration?.sources || ['jira', 'confluence', 'bitbucket'];
    
    // Generate random dates within the last 12 months
    const getRandomDate = (monthsBack) => {
        const date = new Date(today);
        date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsBack));
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };
    
    const getRandomPercentage = (min, max) => Math.floor(Math.random() * (max - min) + min);
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
    
    // Base facts that work for any audit
    const baseFacts = [
        `📊 Team composition: ${teamSize} members (${Math.floor(teamSize * 0.5)} developers, ${Math.floor(teamSize * 0.25)} QA, ${Math.floor(teamSize * 0.125)} PM, ${Math.ceil(teamSize * 0.125)} DevOps)`,
        `📈 Team velocity increased by ${getRandomPercentage(15, 40)}% in the last quarter`,
        `⏱️ Average story completion time: ${(Math.random() * 2 + 2).toFixed(1)} days`,
        `🔄 Sprint duration optimized to ${getRandomNumber(2, 4)} weeks on ${getRandomDate(6)}`
    ];
    
    // Source-specific facts based on enabled integrations
    const jiraFacts = [
        `🐛 Bug reports decreased by ${getRandomPercentage(20, 45)}% since ${getRandomDate(8)}`,
        `🎯 Story point accuracy improved by ${getRandomPercentage(15, 35)}% after process refinement on ${getRandomDate(4)}`,
        `⚡ Critical bugs resolution time reduced from ${getRandomNumber(4, 8)} to ${getRandomNumber(1, 3)} hours`,
        `📋 Backlog grooming sessions increased from weekly to twice-weekly starting ${getRandomDate(3)}`
    ];
    
    const confluenceFacts = [
        `📖 Documentation coverage increased by ${getRandomPercentage(25, 50)}% with ${getRandomNumber(15, 45)} new pages created`,
        `👥 Knowledge sharing sessions introduced on ${getRandomDate(5)} with ${getRandomPercentage(80, 95)}% team participation`,
        `🔍 Code review guidelines updated on ${getRandomDate(2)} improving review quality scores by ${getRandomPercentage(20, 35)}%`,
        `📝 Technical debt documentation created covering ${getRandomNumber(12, 25)} legacy components`
    ];
    
    const bitbucketFacts = [
        `🔀 Pull request review time decreased by ${getRandomPercentage(25, 45)}% after implementing automated checks`,
        `🚀 Deployment frequency increased to ${getRandomNumber(3, 8)} times per week since ${getRandomDate(4)}`,
        `🔒 Security scan integration added on ${getRandomDate(2)} identifying ${getRandomNumber(5, 15)} vulnerabilities`,
        `🌿 Branch protection rules implemented on ${getRandomDate(3)} reducing direct commits by ${getRandomPercentage(85, 98)}%`
    ];
    
    // Team change facts with realistic names and dates
    const teamChangeFacts = [
        `👋 Senior Developer Alex Martinez joined the team on ${getRandomDate(6)}`,
        `🎓 QA Engineer Lisa Chen was promoted to Lead QA on ${getRandomDate(4)}`,
        `🆕 DevOps Specialist Michael Rodriguez introduced on ${getRandomDate(8)}`,
        `📚 Junior Developer Emma Wilson started internship program on ${getRandomDate(3)}`
    ];
    
    // Select facts based on enabled sources and add variety
    let selectedFacts = [...baseFacts];
    
    if (sources.includes('jira')) {
        selectedFacts.push(...jiraFacts.slice(0, 2));
    }
    
    if (sources.includes('confluence')) {
        selectedFacts.push(...confluenceFacts.slice(0, 2));
    }
    
    if (sources.includes('bitbucket')) {
        selectedFacts.push(...bitbucketFacts.slice(0, 2));
    }
    
    // Add team change facts
    selectedFacts.push(...teamChangeFacts.slice(0, 2));
    
    // Add category-specific facts
    const categoryFacts = getCategorySpecificFacts(category);
    selectedFacts.push(...categoryFacts);
    
    // Shuffle and take exactly 10 facts
    const shuffled = selectedFacts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
}

function getCategorySpecificFacts(category) {
    const getRandomDate = (monthsBack) => {
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsBack));
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };
    
    const getRandomPercentage = (min, max) => Math.floor(Math.random() * (max - min) + min);
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
    
    const categoryFactsMap = {
        security: [
            `🛡️ Security vulnerabilities decreased by ${getRandomPercentage(40, 70)}% after implementing new scanning tools on ${getRandomDate(4)}`,
            `🔐 Multi-factor authentication adoption reached ${getRandomPercentage(85, 98)}% team coverage by ${getRandomDate(2)}`,
            `🚨 Security incident response time improved to ${getRandomNumber(15, 45)} minutes average`
        ],
        performance: [
            `⚡ Application response time improved by ${getRandomPercentage(25, 55)}% following optimization on ${getRandomDate(3)}`,
            `📊 Database query performance increased by ${getRandomPercentage(30, 60)}% with new indexing strategy`,
            `🎯 Page load times reduced from ${(Math.random() * 2 + 3).toFixed(1)}s to ${(Math.random() * 1 + 1).toFixed(1)}s`
        ],
        integration: [
            `🔌 API integration success rate improved to ${getRandomPercentage(95, 99)}% after error handling updates on ${getRandomDate(4)}`,
            `🌐 Third-party service dependencies reduced from ${getRandomNumber(8, 15)} to ${getRandomNumber(3, 7)} services`,
            `📡 Data synchronization latency decreased by ${getRandomPercentage(40, 65)}% with new messaging system`
        ],
        migration: [
            `📦 Legacy system migration completed ${getRandomPercentage(60, 90)}% with ${getRandomNumber(2, 8)} remaining components`,
            `🔄 Data migration batch processing improved throughput by ${getRandomPercentage(35, 70)}%`,
            `⬆️ Platform upgrade to latest version completed on ${getRandomDate(2)} with zero downtime`
        ],
        compliance: [
            `✅ Compliance audit score increased from ${getRandomPercentage(70, 85)}% to ${getRandomPercentage(90, 98)}%`,
            `📋 Policy adherence monitoring implemented covering ${getRandomNumber(15, 25)} critical processes`,
            `🔍 Automated compliance checks introduced reducing manual review time by ${getRandomPercentage(50, 75)}%`
        ],
        quality: [
            `🧪 Test coverage increased from ${getRandomPercentage(60, 80)}% to ${getRandomPercentage(85, 95)}% since ${getRandomDate(5)}`,
            `🔧 Automated testing pipeline reduced manual testing effort by ${getRandomPercentage(40, 70)}%`,
            `💎 Code quality score improved by ${getRandomPercentage(20, 45)}% with new linting rules introduced on ${getRandomDate(3)}`
        ]
    };
    
    return categoryFactsMap[category] || [
        `💼 Project milestone achievement rate increased to ${getRandomPercentage(85, 95)}%`,
        `📈 Overall project efficiency improved by ${getRandomPercentage(20, 40)}% in recent months`
    ];
}

function displayFacts() {
    const factsList = document.getElementById('factsList');
    console.log('displayFacts - factsList element:', factsList); // Debug log
    console.log('displayFacts - extractedFacts:', extractedFacts); // Debug log
    
    if (!factsList) {
        console.error('factsList element not found!');
        return;
    }
    
    if (!extractedFacts || extractedFacts.length === 0) {
        console.warn('No facts to display');
        factsList.innerHTML = '<li class="fact-item"><span class="fact-text">No facts generated yet...</span></li>';
        return;
    }
    
    factsList.innerHTML = extractedFacts.map((fact, index) => `
        <li class="fact-item" data-index="${index}">
            <span class="fact-text">${fact}</span>
            <div class="fact-actions">
                <button class="btn-small btn-delete" onclick="deleteFact(${index})">Delete</button>
            </div>
        </li>
    `).join('');
    
    console.log('Facts displayed successfully:', extractedFacts.length, 'facts');
}

function addCustomFact() {
    const factText = document.getElementById('newFactText')?.value.trim();
    if (!factText) return;
    
    extractedFacts.push(factText);
    displayFacts();
    
    document.getElementById('newFactText').value = '';
    
    // Mark as user-added
    const lastItem = document.querySelector('.fact-item:last-child');
    if (lastItem) {
        lastItem.classList.add('user-added');
    }
}

function deleteFact(index) {
    extractedFacts.splice(index, 1);
    displayFacts();
}

function proceedToFinalAnalysis() {
    // Update audit status and save facts
    if (currentAudit) {
        currentAudit.status = 'completed';
        currentAudit.facts = [...extractedFacts];
        currentAudit.completedAt = Date.now();
        
        // Generate realistic stats based on configuration
        generateRealisticStats();
        updateAuditInStorage();
    }
    
    // Mark facts step as completed
    const factsStep = document.getElementById('step-facts');
    if (factsStep) {
        factsStep.classList.remove('active');
        factsStep.classList.add('completed');
    }
    
    // Show final dashboard step
    const dashboardStep = document.getElementById('step-dashboard');
    if (dashboardStep) {
        dashboardStep.style.display = 'block';
        dashboardStep.classList.add('active');
        dashboardStep.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Generate final dashboard data
    generateFinalDashboard();
}

function generateRealisticStats() {
    if (!currentAudit) return;
    
    const config = currentAudit.configuration || {};
    const teamSize = currentAudit.teamSize || 8;
    
    // Generate stats based on audit configuration
    const baseStories = teamSize * 15; // Rough estimate: 15 stories per team member
    const variation = Math.random() * 0.4 + 0.8; // 80-120% variation
    
    currentAudit.stats = {
        totalStories: Math.floor(baseStories * variation),
        completionRate: Math.floor(Math.random() * 20 + 80) + '%', // 80-100%
        avgDaysPerStory: Math.round((Math.random() * 2 + 2) * 10) / 10, // 2.0-4.0 days
        teamMembers: teamSize,
        velocity: Math.floor(teamSize * (Math.random() * 10 + 35)) // 35-45 points per team member
    };
}

function generateFinalDashboard() {
    // Update KPI cards with real data
    updateKPICards();
    
    // Generate comprehensive summary
    generateExecutiveSummary();
    
    // Generate insights and recommendations
    generateInsights();
    
    // Create mock charts using Chart.js or similar
    createMockCharts();
}

function updateKPICards() {
    if (!currentAudit || !currentAudit.stats) return;
    
    const stats = currentAudit.stats;
    
    // Update KPI values
    document.getElementById('totalStories').textContent = stats.totalStories;
    document.getElementById('completionRate').textContent = stats.completionRate;
    document.getElementById('avgDays').textContent = stats.avgDaysPerStory;
    document.getElementById('teamMembers').textContent = stats.teamMembers;
}

function generateExecutiveSummary() {
    if (!currentAudit) return;
    
    const stats = currentAudit.stats;
    const config = currentAudit.configuration;
    const category = currentAudit.category || 'development';
    const teamSize = currentAudit.teamSize;
    
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;
    
    // Generate dynamic summary based on audit data
    const projectName = currentAudit.name;
    const completionRate = parseInt(stats.completionRate);
    const velocity = stats.velocity;
    
    const summary = `
        <p>This comprehensive audit analysis of <span class="highlight">${projectName}</span> was conducted over the specified time period, analyzing data from ${config?.sources?.join(', ') || 'multiple sources'} to provide insights into team performance, project progress, and development efficiency.</p>
        
        <p>The project demonstrates <span class="highlight">${completionRate >= 90 ? 'exceptional' : completionRate >= 80 ? 'strong' : completionRate >= 70 ? 'satisfactory' : 'concerning'} performance</span> with a completion rate of ${stats.completionRate} across ${stats.totalStories} total stories. The team of ${teamSize} members has maintained an average story completion time of ${stats.avgDaysPerStory} days, indicating ${stats.avgDaysPerStory <= 2.5 ? 'excellent' : stats.avgDaysPerStory <= 4 ? 'good' : 'room for improvement in'} development velocity.</p>
        
        <p>Key performance indicators reveal that the team's velocity of ${velocity} story points per sprint ${velocity >= 50 ? 'exceeds industry benchmarks' : velocity >= 35 ? 'aligns with industry standards' : 'suggests opportunities for optimization'}. The ${category} project category analysis shows ${getCategoryInsight(category)} patterns consistent with similar ${category} initiatives.</p>
        
        <p>Process improvements identified during this audit period include enhanced code review practices, optimized sprint planning, and improved cross-team collaboration. The implementation of automated testing and continuous integration has contributed to ${getRandomPercentage(15, 30)}% reduction in defect rates and ${getRandomPercentage(20, 40)}% improvement in deployment frequency.</p>
        
        <p>Resource allocation analysis indicates ${getTeamCompositionInsight(teamSize)} team structure with balanced skill distribution. The project timeline adherence rate of ${getRandomPercentage(85, 95)}% demonstrates effective project management and realistic sprint planning. Communication patterns show regular standups, retrospectives, and planning sessions contributing to team cohesion.</p>
        
        <p>Moving forward, the analysis recommends focusing on ${getRecommendationFocus(completionRate, velocity)} to further enhance team productivity and project outcomes. Continued monitoring of key metrics and regular process refinements will ensure sustained performance improvements and successful project delivery.</p>
    `;
    
    summaryContent.innerHTML = summary;
}

function generateInsights() {
    const insightsGrid = document.getElementById('insightsGrid');
    if (!insightsGrid) return;
    
    const insights = [
        {
            type: 'positive',
            icon: '🚀',
            title: 'High Team Velocity',
            content: 'Team velocity has increased by 25% over the last quarter, indicating improved estimation accuracy and development efficiency.'
        },
        {
            type: 'info',
            icon: '📊',
            title: 'Balanced Workload Distribution',
            content: 'Story point distribution across team members shows balanced workload with no single team member overloaded.'
        },
        {
            type: 'positive',
            icon: '🔄',
            title: 'Effective Sprint Planning',
            content: 'Sprint completion rates consistently above 85% demonstrate accurate planning and realistic goal setting.'
        },
        {
            type: 'warning',
            icon: '⚠️',
            title: 'Code Review Bottleneck',
            content: 'Average pull request review time of 1.2 days could be optimized to improve development flow.'
        },
        {
            type: 'info',
            icon: '📈',
            title: 'Quality Trend',
            content: 'Bug discovery rate has decreased by 30% since implementing enhanced testing practices.'
        },
        {
            type: 'positive',
            icon: '🎯',
            title: 'Goal Achievement',
            content: 'Project milestones are being met ahead of schedule with 95% of planned features delivered on time.'
        }
    ];
    
    insightsGrid.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <div class="insight-title">
                <span>${insight.icon}</span>
                ${insight.title}
            </div>
            <div class="insight-content">
                ${insight.content}
            </div>
        </div>
    `).join('');
}

function getCategoryInsight(category) {
    const insights = {
        security: 'robust security protocols and compliance',
        performance: 'optimization-focused development and monitoring',
        integration: 'seamless system connectivity and data flow',
        migration: 'systematic data transition and legacy modernization',
        compliance: 'regulatory adherence and audit trail',
        quality: 'comprehensive testing and quality assurance',
        development: 'agile development and iterative delivery'
    };
    
    return insights[category] || 'efficient development and delivery';
}

function getTeamCompositionInsight(teamSize) {
    if (teamSize <= 5) return 'a lean and agile';
    if (teamSize <= 10) return 'a well-balanced';
    return 'a comprehensive';
}

function getRecommendationFocus(completionRate, velocity) {
    if (completionRate >= 90 && velocity >= 50) return 'maintaining current excellence while exploring advanced automation';
    if (completionRate >= 80) return 'optimizing development processes and enhancing collaboration tools';
    return 'improving estimation accuracy and addressing development bottlenecks';
}

function getRandomPercentage(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createMockCharts() {
    // Create all D3.js charts
    setTimeout(() => {
        try {
            console.log('Creating D3.js charts...');
            if (typeof createVelocityChart === 'function') {
                createVelocityChart();
                console.log('Velocity chart created');
            }
            if (typeof createBurndownChart === 'function') {
                createBurndownChart();
                console.log('Burndown chart created');
            }
            if (typeof createBugTrendsChart === 'function') {
                createBugTrendsChart();
                console.log('Bug trends chart created');
            }
            if (typeof createTeamDistributionChart === 'function') {
                createTeamDistributionChart();
                console.log('Team distribution chart created');
            }
            if (typeof setupTooltip === 'function') {
                setupTooltip();
                console.log('Tooltip setup complete');
            }
        } catch (error) {
            console.error('Error creating charts:', error);
        }
    }, 500);
}

function downloadReport(format = 'json') {
    if (!currentAudit) return;
    
    const reportData = {
        auditName: currentAudit.name,
        projectName: currentAudit.project,
        category: currentAudit.category,
        description: currentAudit.description,
        configuration: currentAudit.configuration,
        facts: extractedFacts,
        stats: currentAudit.stats,
        generatedAt: new Date().toISOString(),
        completedAt: currentAudit.completedAt,
        teamSize: currentAudit.teamSize,
        timeRange: currentAudit.timeRange
    };
    
    let content, mimeType, fileName, extension;
    
    switch (format) {
        case 'pdf':
            content = generatePDFContent(reportData);
            mimeType = 'text/html';
            extension = 'html';
            fileName = `${reportData.auditName.replace(/\s+/g, '_')}_Report.${extension}`;
            break;
            
        case 'excel':
            content = generateCSVContent(reportData);
            mimeType = 'text/csv';
            extension = 'csv';
            fileName = `${reportData.auditName.replace(/\s+/g, '_')}_Data.${extension}`;
            break;
            
        case 'json':
        default:
            content = JSON.stringify(reportData, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            fileName = `${reportData.auditName.replace(/\s+/g, '_')}_Report.${extension}`;
            break;
    }
    
    const dataBlob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Downloaded!';
    button.style.background = 'rgba(255, 255, 255, 0.4)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'rgba(255, 255, 255, 0.2)';
    }, 2000);
}

function generatePDFContent(reportData) {
    const summary = document.getElementById('summaryContent')?.innerHTML || '';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${reportData.auditName} - Audit Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .section { margin-bottom: 30px; }
                .highlight { background: #f0f0f0; padding: 2px 4px; }
                .stats { display: flex; justify-content: space-around; margin: 20px 0; }
                .stat { text-align: center; }
                .facts { list-style: none; padding: 0; }
                .facts li { margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #667eea; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${reportData.auditName}</h1>
                <h2>Project Audit Report</h2>
                <p>Generated on ${new Date(reportData.generatedAt).toLocaleDateString()}</p>
            </div>
            
            <div class="section">
                <h3>Project Information</h3>
                <p><strong>Project:</strong> ${reportData.projectName}</p>
                <p><strong>Category:</strong> ${reportData.category}</p>
                <p><strong>Time Range:</strong> ${reportData.timeRange}</p>
                <p><strong>Team Size:</strong> ${reportData.teamSize} members</p>
            </div>
            
            <div class="section">
                <h3>Key Metrics</h3>
                <div class="stats">
                    <div class="stat">
                        <h4>${reportData.stats.totalStories}</h4>
                        <p>Total Stories</p>
                    </div>
                    <div class="stat">
                        <h4>${reportData.stats.completionRate}</h4>
                        <p>Completion Rate</p>
                    </div>
                    <div class="stat">
                        <h4>${reportData.stats.avgDaysPerStory}</h4>
                        <p>Avg Days/Story</p>
                    </div>
                    <div class="stat">
                        <h4>${reportData.stats.velocity}</h4>
                        <p>Velocity (points/sprint)</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>Executive Summary</h3>
                ${summary}
            </div>
            
            <div class="section">
                <h3>Key Facts</h3>
                <ul class="facts">
                    ${reportData.facts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
            </div>
        </body>
        </html>
    `;
}

function generateCSVContent(reportData) {
    const csvData = [
        ['Metric', 'Value'],
        ['Audit Name', reportData.auditName],
        ['Project Name', reportData.projectName],
        ['Category', reportData.category],
        ['Team Size', reportData.teamSize],
        ['Time Range', reportData.timeRange],
        ['Total Stories', reportData.stats.totalStories],
        ['Completion Rate', reportData.stats.completionRate],
        ['Avg Days per Story', reportData.stats.avgDaysPerStory],
        ['Velocity', reportData.stats.velocity],
        ['Generated At', new Date(reportData.generatedAt).toLocaleDateString()],
        [''],
        ['Key Facts'],
        ...reportData.facts.map(fact => ['', fact])
    ];
    
    return csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Navigation functions
function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Utility functions
function checkAuth() {
    const user = localStorage.getItem('sicpa_user');
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            // Login page - don't check auth, just initialize if needed
            break;
        case 'main.html':
            if (checkAuth()) {
                loadUserInfo();
                loadAudits();
                setActiveNav('main.html');
            }
            break;
        case 'settings.html':
            if (checkAuth()) {
                loadUserInfo();
                loadSettings();
                setActiveNav('settings.html');
            }
            break;
        case 'create-audit.html':
            if (checkAuth()) {
                loadUserInfo();
                loadAuditDraft();
                setActiveNav('main.html'); // Highlight audits since this is part of audit creation
            }
            break;
        case 'dashboard.html':
            if (checkAuth()) {
                loadUserInfo();
                loadAuditInfo();
                setActiveNav('dashboard.html');
            }
            break;
    }
}

function loadAuditDraft() {
    const draft = localStorage.getItem('audit_draft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            // Populate form with draft data
            Object.keys(draftData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = draftData[key];
                }
            });
        } catch (e) {
            console.warn('Could not load draft data:', e);
        }
    }
}

// Run page initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
