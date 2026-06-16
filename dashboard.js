/* dashboard.js - UrbanNexus Dashboard Visualizations and Tab Management */

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initSidebar();
    initDashboardData();
    initLogout();
});

/* 1. Session check to prevent unauthorized access */
function checkSession() {
    const sessionStr = localStorage.getItem('un_session');
    if (!sessionStr) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    const session = JSON.parse(sessionStr);
    const currentPage = window.location.pathname.split('/').pop();

    // Verify correct dashboard access
    if (currentPage === 'admin-dashboard.html' && session.role !== 'admin') {
        window.location.href = 'user-dashboard.html';
    } else if (currentPage === 'user-dashboard.html' && session.role !== 'user') {
        window.location.href = 'admin-dashboard.html';
    }

    // Set user name in welcome fields
    const userNameEls = document.querySelectorAll('.dashboard-user-name');
    userNameEls.forEach(el => {
        el.innerText = session.name;
    });

    const userEmailEls = document.querySelectorAll('.dashboard-user-email');
    userEmailEls.forEach(el => {
        el.innerText = session.email;
    });
}

/* 2. Sidebar Navigation and Tab Switching */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const dashHamburger = document.querySelector('.dash-hamburger');
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    const dashViews = document.querySelectorAll('.dash-view-section');
    const overlay = document.getElementById('sidebar-overlay');

    // Close sidebar from toggle button inside sidebar
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Open sidebar from hamburger button in topbar
    if (dashHamburger && sidebar) {
        dashHamburger.addEventListener('click', () => {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }

    // Close sidebar when clicking backdrop overlay
    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (menuItems.length > 0 && dashViews.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = item.getAttribute('data-target');
                if (!targetViewId) return;

                // Update active sidebar item
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Toggle active view
                dashViews.forEach(view => {
                    if (view.id === targetViewId) {
                        view.style.display = 'block';
                    } else {
                        view.style.display = 'none';
                    }
                });

                // Update page title in topbar
                const pageTitle = document.querySelector('.page-title h2');
                if (pageTitle) {
                    pageTitle.innerText = item.querySelector('span').innerText;
                }

                // If on mobile, close sidebar on selection
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });
    }
}

/* 3. Dashboard Chart Rendering & Table Management */
function initDashboardData() {
    // Check if on Admin Dashboard
    const isAdmin = document.getElementById('admin-analytics-view') !== null;
    
    if (isAdmin) {
        renderAdminCharts();
        populateUserTable();
        populateAdminInbox();
        populateAdminNodes();
    } else {
        renderUserCharts();
        initUserSupportTickets();
    }
}

function renderAdminCharts() {
    const barsContainer = document.querySelector('.mock-bar-chart');
    if (!barsContainer) return;

    // Smart City energy conservation stats
    const mockData = [
        { label: 'Jan', value: 45 },
        { label: 'Feb', value: 60 },
        { label: 'Mar', value: 75 },
        { label: 'Apr', value: 50 },
        { label: 'May', value: 85 },
        { label: 'Jun', value: 95 },
        { label: 'Jul', value: 110 }
    ];

    barsContainer.innerHTML = '';
    mockData.forEach(item => {
        const barGroup = document.createElement('div');
        barGroup.className = 'chart-bar-group';

        const barFill = document.createElement('div');
        barFill.className = 'chart-bar-fill';
        barFill.style.height = '0%';
        barFill.setAttribute('data-val', item.value + 'MWh');

        const label = document.createElement('span');
        label.className = 'chart-bar-label';
        label.innerText = item.label;

        barGroup.appendChild(barFill);
        barGroup.appendChild(label);
        barsContainer.appendChild(barGroup);

        // Animate bar entry
        setTimeout(() => {
            barFill.style.height = `${(item.value / 120) * 100}%`;
        }, 100);
    });
}

function renderUserCharts() {
    // User dashboard energy savings/usage charts
    const progressFill = document.getElementById('energy-saving-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '78%';
        }, 300);
    }
}

function populateUserTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    // Retrieve users from localStorage + merge default mock users
    const registeredUsers = JSON.parse(localStorage.getItem('un_users') || '[]');
    const defaultUsers = [
        { name: 'Sarah Connor', email: 's.connor@cyberdyne.org', role: 'User', status: 'Active' },
        { name: 'Bruce Wayne', email: 'bruce@waynecorp.com', role: 'User', status: 'Active' },
        { name: 'Elena Rostova', email: 'e.rostova@smartgrid.io', role: 'User', status: 'Inactive' }
    ];

    // Merge lists
    const allUsers = [...registeredUsers.map(u => ({ name: u.name, email: u.email, role: 'User', status: 'Active' })), ...defaultUsers];

    tableBody.innerHTML = '';
    allUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-meta">
                    <div class="user-meta-avatar" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; color: #000;">
                        ${user.name.charAt(0)}
                    </div>
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="badge-status ${user.status.toLowerCase()}">${user.status}</span></td>
            <td>
                <button class="action-btn" title="Edit User"><i data-lucide="edit-2"></i></button>
                <button class="action-btn" title="Delete User" style="color: var(--accent);"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/* 4. Logout Logic */
function initLogout() {
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear current user session
            localStorage.removeItem('un_session');
            window.location.href = 'index.html';
        });
    });
}

/* 5. Municipal Messages Inbox (Admin Dashboard Extra) */
const mockMessages = [
    { id: 1, sender: 'Mayor Raymond Vance', email: 'vance@citygov.org', subject: 'District 1 Transit Audit', body: 'Marcus, our transit numbers are looking solid, but we need an audit report on District 1\'s intersection node layout. The carbon credit offset metrics need to match our baseline projections before the budget review next Wednesday. Send over the tech specs ASAP.', date: 'June 15, 2026 - 16:30' },
    { id: 2, sender: 'Sarah Connor', email: 's.connor@cyberdyne.org', subject: 'Sensor Hub B14 Calibration', body: 'Substation energy router node B14 seems to be fluctuating its telemetry broadcasts. The load balance alternates between 0% and 80% every 5 minutes. I suggest running a software diagnostic fallback routine. Let me know when you schedule the scan.', date: 'June 14, 2026 - 11:20' },
    { id: 3, sender: 'Bruce Wayne', email: 'bruce@waynecorp.com', subject: 'Private-By-Design Feeds Query', body: 'UrbanNexus Team, Wayne Enterprises is interested in reviewing the ISO compliance certifications of your video feed anonymizer modules. We want to verify that no pixel data is cached locally at the node. Send the security catalog document.', date: 'June 12, 2026 - 09:15' }
];

function populateAdminInbox() {
    const listContainer = document.getElementById('admin-inbox-list');
    const readerContainer = document.getElementById('admin-inbox-reader');
    if (!listContainer || !readerContainer) return;

    listContainer.innerHTML = '';
    mockMessages.forEach(msg => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.01); cursor: pointer; transition: var(--transition-smooth); margin-bottom: 0.5rem;';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <strong style="font-size: 0.85rem; color: #fff;">${msg.sender.split(' ').pop()}</strong>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${msg.date.split(' - ')[0]}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${msg.subject}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${msg.body}</div>
        `;
        
        item.addEventListener('mouseenter', () => item.style.borderColor = 'rgba(0, 240, 255, 0.3)');
        item.addEventListener('mouseleave', () => item.style.borderColor = 'rgba(255,255,255,0.08)');
        
        item.addEventListener('click', () => {
            readerContainer.innerHTML = `
                <div>
                    <h3 style="font-size: 1.25rem; color: #fff; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">${msg.subject}</h3>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                        <span>From: <strong>${msg.sender}</strong> (${msg.email})</span>
                        <span>${msg.date}</span>
                    </div>
                    <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.7; white-space: pre-line;">${msg.body}</p>
                </div>
            `;
        });

        listContainer.appendChild(item);
    });
}

/* 6. Smart Node Infrastructure Loader (Admin Dashboard Extra) */
const mockNodes = [
    { id: 'TR-402', location: 'District 1 - Innovation Core', status: 'Online', load: '42%', latency: '4ms' },
    { id: 'SG-809', location: 'District 3 - South Grid Array', status: 'Online', load: '81%', latency: '7ms' },
    { id: 'SE-102', location: 'District 2 - Transit Hub', status: 'Maintenance', load: '0%', latency: '142ms' },
    { id: 'WT-550', location: 'District 4 - Aqueducts Node', status: 'Online', load: '14%', latency: '11ms' }
];

function populateAdminNodes() {
    const tableBody = document.getElementById('admin-nodes-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    mockNodes.forEach(node => {
        const row = document.createElement('tr');
        const statusClass = node.status.toLowerCase() === 'online' ? 'active' : 'inactive';
        row.innerHTML = `
            <td><strong style="color: var(--primary);">${node.id}</strong></td>
            <td>${node.location}</td>
            <td><span class="badge-status ${statusClass}">${node.status}</span></td>
            <td>${node.load}</td>
            <td>${node.latency}</td>
        `;
        tableBody.appendChild(row);
    });
}

/* 7. Citizen Support Desk tickets (User Dashboard Extra) */
function initUserSupportTickets() {
    const ticketForm = document.getElementById('user-ticket-form');
    const ticketsList = document.getElementById('user-tickets-list');
    if (!ticketForm || !ticketsList) return;

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const categorySelect = document.getElementById('ticket-category');
        const messageTextarea = document.getElementById('ticket-message');

        const category = categorySelect.options[categorySelect.selectedIndex].text;
        const message = messageTextarea.value.trim();

        if (!message) return;

        // Generate mock ticket ID
        const ticketId = 'TK-' + Math.floor(1000 + Math.random() * 9000);
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // Add to list
        const li = document.createElement('li');
        li.style.cssText = 'border-top: 1px solid var(--border-light); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;';
        li.innerHTML = `
            <div>
                <h4 style="font-size: 0.9rem;">#${ticketId}: ${category}</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Filed on ${dateStr}</p>
            </div>
            <span class="badge-status inactive" style="background: rgba(255,165,0,0.1); color: orange;">Pending</span>
        `;

        // Prepend to top of list
        ticketsList.insertBefore(li, ticketsList.firstChild);

        // Reset form
        messageTextarea.value = '';
        
        alert('Support ticket filed successfully as #' + ticketId);
    });
}
