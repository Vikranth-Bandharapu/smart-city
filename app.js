/* ==========================================================================
   Stackly Smart City Portal - Main Logic File
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Accessibility & Theme Switches
       ========================================================================== */
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const contrastToggleBtn = document.getElementById('contrast-toggle-btn');
    
    // Theme Switcher
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('contrast-theme')) {
            body.classList.remove('contrast-theme');
        }
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        }
    });
    // High Contrast Switcher
    contrastToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('contrast-theme')) {
            body.classList.remove('contrast-theme');
            body.classList.add('dark-theme'); // default back
        } else {
            body.classList.remove('dark-theme');
            body.classList.remove('light-theme');
            body.classList.add('contrast-theme');
        }
    });
    // Accessible Font Scaling
    let currentFontSize = 100; // in percent
    const htmlEl = document.documentElement;
    const fontDecrease = document.getElementById('font-decrease');
    const fontReset = document.getElementById('font-reset');
    const fontIncrease = document.getElementById('font-increase');
    fontDecrease.addEventListener('click', () => {
        if (currentFontSize > 80) {
            currentFontSize -= 10;
            htmlEl.style.fontSize = `${currentFontSize}%`;
        }
    });
    fontReset.addEventListener('click', () => {
        currentFontSize = 100;
        htmlEl.style.fontSize = '100%';
    });
    fontIncrease.addEventListener('click', () => {
        if (currentFontSize < 130) {
            currentFontSize += 10;
            htmlEl.style.fontSize = `${currentFontSize}%`;
        }
    });
    // Language Selector Alert
    const langSelect = document.getElementById('language-select');
    langSelect.addEventListener('change', (e) => {
        alert(`Language changed to: ${e.target.options[e.target.selectedIndex].text} (Portal Simulation Only)`);
    });
    /* ==========================================================================
       2. Mobile Navigation Toggle Menu
       ========================================================================== */
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    // Close nav when clicking a menu link
    navMenu.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });
    /* ==========================================================================
       3. Search Bar Auto-Suggest Simulation
       ========================================================================== */
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const searchDatabase = [
        { term: 'Pay Electricity & Water Bills', url: '#services', category: 'Utilities' },
        { term: 'Transit Cards & Subway Routes', url: '#services', category: 'Transit' },
        { term: 'Commercial Zoning & Expansion Permits', url: '#services', category: 'Permits' },
        { term: 'Report Road Potholes or Leaks', url: '#engagement', category: 'Community' },
        { term: 'Smart EV Parking Space Availability', url: '#services', category: 'Transit' },
        { term: 'Garbage Collection Calendar & Waste Bins', url: '#services', category: 'Utilities' },
        { term: 'Demographics & Budget Records', url: '#services', category: 'Permits' }
    ];
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';
        
        if (query.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        const matches = searchDatabase.filter(item => 
            item.term.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
        if (matches.length > 0) {
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerHTML = `<span>🔍</span> <span>${match.term}</span> <small style="margin-left:auto; color:var(--accent-cyan); font-size:0.7rem;">${match.category}</small>`;
                div.addEventListener('click', () => {
                    searchInput.value = match.term;
                    suggestionsBox.style.display = 'none';
                    window.location.hash = match.url;
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'flex';
        } else {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.style.color = 'var(--text-muted)';
            div.textContent = 'No matching civic resources found';
            suggestionsBox.appendChild(div);
            suggestionsBox.style.display = 'flex';
        }
    });
    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
    /* ==========================================================================
       4. Service Category Filtering
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const categoryFilter = button.getAttribute('data-filter');
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (categoryFilter === 'all' || cardCategory === categoryFilter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    /* ==========================================================================
       5. Smart Initiatives Pillar Tabs
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const paneContents = document.querySelectorAll('.pane-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Unselect previous
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            paneContents.forEach(pane => pane.classList.remove('active'));
            // Select clicked
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const targetPaneId = button.getAttribute('aria-controls');
            const targetPane = document.getElementById(targetPaneId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
    /* ==========================================================================
       6. Simulated Real-time IoT Dashboard
       ========================================================================== */
    const countdownEl = document.getElementById('countdown-timer');
    let refreshSeconds = 5;
    // Dom values
    const dAQI = document.getElementById('dash-aqi');
    const dAQIBar = document.getElementById('dash-aqi-bar');
    const dAQIStatus = document.getElementById('dash-aqi-status');
    const dGrid = document.getElementById('dash-grid');
    const dGridBar = document.getElementById('dash-grid-bar');
    const dTransit = document.getElementById('dash-transit');
    const dTransitBar = document.getElementById('dash-transit-bar');
    const dWater = document.getElementById('dash-water');
    const dWaterBar = document.getElementById('dash-water-bar');
    const dParking = document.getElementById('dash-parking');
    const dParkingBar = document.getElementById('dash-parking-bar');
    const dWifi = document.getElementById('dash-wifi');
    const dWifiBar = document.getElementById('dash-wifi-bar');
    // Initial Dashboard values
    let telemetryData = {
        aqi: 42,
        grid: 64.5,
        transit: 18,
        water: 87.2,
        parking: 726,
        wifi: 14249
    };
    function updateDashboardUI() {
        // Fluctuate AQI
        telemetryData.aqi += Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        if (telemetryData.aqi < 30) telemetryData.aqi = 30;
        if (telemetryData.aqi > 60) telemetryData.aqi = 60;
        dAQI.textContent = telemetryData.aqi;
        dAQIBar.style.width = `${telemetryData.aqi}%`;
        if (telemetryData.aqi <= 50) {
            dAQIStatus.textContent = 'Optimal';
            dAQIStatus.className = 'dash-badge green';
            dAQIBar.className = 'progress-bar-fill green';
        } else {
            dAQIStatus.textContent = 'Moderate';
            dAQIStatus.className = 'dash-badge gold';
            dAQIBar.className = 'progress-bar-fill gold';
        }
        // Fluctuate Grid Load
        telemetryData.grid += (Math.random() * 2 - 1); // float
        telemetryData.grid = Math.max(50.0, Math.min(85.0, telemetryData.grid));
        dGrid.textContent = telemetryData.grid.toFixed(1);
        dGridBar.style.width = `${telemetryData.grid}%`;
        // Fluctuate Transit fleet
        if (Math.random() > 0.8) {
            telemetryData.transit += Math.random() > 0.5 ? 1 : -1;
            telemetryData.transit = Math.max(15, Math.min(22, telemetryData.transit));
            dTransit.textContent = telemetryData.transit;
            dTransitBar.style.width = `${(telemetryData.transit / 20) * 100}%`;
        }
        // Fluctuate Water Level
        telemetryData.water += (Math.random() * 0.2 - 0.1);
        telemetryData.water = Math.max(80.0, Math.min(95.0, telemetryData.water));
        dWater.textContent = telemetryData.water.toFixed(1);
        dWaterBar.style.width = `${telemetryData.water}%`;
        // Fluctuate Parking spaces
        telemetryData.parking += Math.floor(Math.random() * 7) - 3;
        telemetryData.parking = Math.max(600, Math.min(850, telemetryData.parking));
        dParking.textContent = telemetryData.parking;
        const parkingPercent = ((1250 - telemetryData.parking) / 1250) * 100;
        dParkingBar.style.width = `${parkingPercent}%`;
        // Fluctuate WiFi users
        telemetryData.wifi += Math.floor(Math.random() * 101) - 50;
        telemetryData.wifi = Math.max(13000, Math.min(16000, telemetryData.wifi));
        dWifi.textContent = telemetryData.wifi.toLocaleString();
        dWifiBar.style.width = `${(telemetryData.wifi / 20000) * 100}%`;
    }
    // Interval handler
    setInterval(() => {
        refreshSeconds--;
        if (refreshSeconds < 0) {
            updateDashboardUI();
            refreshSeconds = 5;
        }
        countdownEl.textContent = refreshSeconds;
    }, 1000);
    /* ==========================================================================
       7. Interactive Projects Map Hotspots
       ========================================================================== */
    const mapHotspots = document.querySelectorAll('.map-hotspot');
    const projCategory = document.getElementById('proj-category');
    const projStatus = document.getElementById('proj-status');
    const projTitle = document.getElementById('proj-title');
    const projDesc = document.getElementById('proj-desc');
    const projBudget = document.getElementById('proj-budget');
    const projImpact = document.getElementById('proj-impact');
    const projProgressText = document.getElementById('proj-progress-text');
    const projProgressBar = document.getElementById('proj-progress-bar');
    const leadContractor = document.querySelector('.project-footer strong');
    const projectDatabase = {
        solar: {
            title: 'Sector 4 Solar Farm (Phase II)',
            desc: 'Installing 12,000 highly efficient bi-facial photovoltaic panels to add an extra 6.2 MW output into the Stackly Municipal grid by autumn.',
            category: 'Renewable Energy',
            categoryClass: 'project-tag tag-blue',
            status: 'In Construction',
            budget: '$4.2M',
            impact: '+6.2 Megawatts',
            progress: '65%',
            progressColor: 'cyan',
            contractor: 'Stackly Power Systems'
        },
        metro: {
            title: 'Subway Extension Line 4',
            desc: 'Carving tunnels connecting Residential Sector 2 directly with Eco-Valley Suburbs. Adding 4 fully automated stations and driverless carriage links.',
            category: 'Smart Mobility',
            categoryClass: 'project-tag tag-purple',
            status: 'Excavation Phase',
            budget: '$18.5M',
            impact: '80K Daily Riders',
            progress: '32%',
            progressColor: 'purple',
            contractor: 'Metro Tunneling JV'
        },
        lights: {
            title: 'Smart Streetlight Retrofit',
            desc: 'Deploying connected high-efficiency LED lights with built-in ambient light sensors, atmospheric monitors, and acoustic distress triggers.',
            category: 'IoT Infrastructure',
            categoryClass: 'project-tag tag-gold',
            status: 'Zoning Rollout',
            budget: '$1.8M',
            impact: '-30% Grid Draw',
            progress: '89%',
            progressColor: 'gold',
            contractor: 'Stackly Systems Systems'
        },
        parks: {
            title: 'Free Civic Wi-Fi Parks',
            desc: 'Deploying high-speed public router hubs within all municipal parks in Sector 1 and 3, featuring circular solar parasols for recharging devices.',
            category: 'Digital Inclusion',
            categoryClass: 'project-tag tag-green',
            status: 'Completed',
            budget: '$850K',
            impact: '100% Free Coverage',
            progress: '100%',
            progressColor: 'emerald',
            contractor: 'Metro Tel-Link & Stackly'
        }
    };
    mapHotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            // Remove active classes
            mapHotspots.forEach(hs => hs.classList.remove('active'));
            hotspot.classList.add('active');
            const projKey = hotspot.getAttribute('data-project');
            const data = projectDatabase[projKey];
            if (data) {
                projCategory.textContent = data.category;
                projCategory.className = data.categoryClass;
                projStatus.textContent = data.status;
                projTitle.textContent = data.title;
                projDesc.textContent = data.desc;
                projBudget.textContent = data.budget;
                projImpact.textContent = data.impact;
                projProgressText.textContent = data.progress;
                projProgressBar.style.width = data.progress;
                
                // Set color
                projProgressBar.className = `progress-bar-fill ${data.progressColor}`;
                leadContractor.textContent = data.contractor;
            }
        });
    });
    /* ==========================================================================
       8. Issue Submission Form & Success Handler
       ========================================================================== */
    const issueForm = document.getElementById('issue-report-form');
    const successAlert = document.getElementById('report-success');
    const generatedTicketIdEl = document.getElementById('generated-ticket-id');
    const copyTicketBtn = document.getElementById('copy-ticket-btn');
    // Local Ticket Database
    let ticketDatabase = {
        'STK-99812': {
            type: 'Broken Streetlight',
            sector: 'Sector 2 (Residential)',
            status: 'Resolved',
            workflow: [
                { step: 'Service Request Created', time: 'June 09, 2026 - 10:14 AM', state: 'completed' },
                { step: 'Technician Assigned', time: 'June 10, 2026 - 02:40 PM', state: 'completed' },
                { step: 'Maintenance Completed', time: 'June 11, 2026 - 11:30 AM', state: 'current' }
            ]
        },
        'STK-44512': {
            type: 'Water Pipe Leak',
            sector: 'Sector 3 (Eco Valley)',
            status: 'In Progress',
            workflow: [
                { step: 'Service Request Created', time: 'June 12, 2026 - 08:05 AM', state: 'completed' },
                { step: 'Crew Dispatched to Location', time: 'June 13, 2026 - 09:15 AM', state: 'current' },
                { step: 'Resolution Pending', time: 'Estimated: 6 hours', state: 'pending' }
            ]
        }
    };
    issueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('issue-type').value;
        const sectorVal = document.getElementById('issue-sector').value;
        const desc = document.getElementById('issue-desc').value;
        const email = document.getElementById('reporter-email').value;
        // Generate Random Ticket
        const randNum = Math.floor(10000 + Math.random() * 90000); // 5 digit
        const ticketId = `STK-${randNum}`;
        // Save Ticket in Mock DB
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        ticketDatabase[ticketId] = {
            type: type,
            sector: sectorVal,
            status: 'Assigned',
            workflow: [
                { step: 'Service Request Created', time: `${formattedDate} - ${formattedTime}`, state: 'completed' },
                { step: 'Department Routing', time: 'Assigned to Municipal Support', state: 'current' },
                { step: 'Technician Dispatched', time: 'Pending Scheduling', state: 'pending' }
            ]
        };
        // UI Changes
        generatedTicketIdEl.textContent = ticketId;
        issueForm.reset();
        issueForm.classList.add('hidden');
        successAlert.classList.remove('hidden');
    });
    // Copy Ticket Clipboard logic
    copyTicketBtn.addEventListener('click', () => {
        const textToCopy = generatedTicketIdEl.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyTicketBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyTicketBtn.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
    /* ==========================================================================
       9. Service Request Tracker Lookup
       ========================================================================== */
    const trackerInput = document.getElementById('tracker-input');
    const trackerSubmitBtn = document.getElementById('tracker-submit-btn');
    const trackerResults = document.getElementById('tracker-results');
    function executeTrackerLookup() {
        const lookupId = trackerInput.value.toUpperCase().trim();
        trackerResults.innerHTML = '';
        if (!lookupId) {
            trackerResults.innerHTML = `<div class="tracker-placeholder-msg" style="color:var(--accent-red)">Please enter a ticket ID.</div>`;
            return;
        }
        const ticket = ticketDatabase[lookupId];
        if (ticket) {
            // Render Ticket
            let workflowHTML = '';
            ticket.workflow.forEach(step => {
                let stepClass = 'workflow-step';
                if (step.state === 'completed') stepClass += ' completed';
                if (step.state === 'current') stepClass += ' current';
                workflowHTML += `
                    <div class="${stepClass}">
                        <span>${step.step}</span>
                        <span class="workflow-time">${step.time}</span>
                    </div>
                `;
            });
            trackerResults.innerHTML = `
                <div class="active-ticket-info">
                    <h4>Ticket: <code>${lookupId}</code> <span class="ticket-status-val">[${ticket.status}]</span></h4>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1rem;">
                        <strong>Type:</strong> ${ticket.type} <br>
                        <strong>Location:</strong> ${ticket.sector}
                    </p>
                    <div class="ticket-workflow">
                        ${workflowHTML}
                    </div>
                </div>
            `;
        } else {
            trackerResults.innerHTML = `
                <div class="tracker-placeholder-msg" style="color:var(--accent-red)">
                    ⚠️ Ticket ID <strong>"${lookupId}"</strong> not found. <br>
                    Try searching: <code>STK-99812</code> or <code>STK-44512</code>.
                </div>
            `;
        }
    }
    trackerSubmitBtn.addEventListener('click', executeTrackerLookup);
    trackerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeTrackerLookup();
        }
    });
    /* ==========================================================================
       10. Citizen Opinion Poll
       ========================================================================== */
    const submitVoteBtn = document.getElementById('submit-vote-btn');
    const pollContainer = document.getElementById('poll-container');
    const pollResultsPanel = document.getElementById('poll-results-panel');
    submitVoteBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="poll-vote"]:checked');
        if (!selectedOption) {
            alert('Please select an option to cast your vote!');
            return;
        }
        // Hide inputs and show animated stats
        pollContainer.classList.add('hidden');
        pollResultsPanel.classList.remove('hidden');
    });
});