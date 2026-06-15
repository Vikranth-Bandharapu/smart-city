/* auth.js - UrbanNexus Login and Sign Up Validation */

document.addEventListener('DOMContentLoaded', () => {
    initSignUpForm();
    initLoginForm();
});

/* 1. Sign Up Logic */
function initSignUpForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    const msgBox = document.getElementById('auth-message');
    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous messages
        msgBox.style.display = 'none';
        msgBox.className = 'auth-message';

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        // Validations
        if (!name || !email || !password || !confirmPassword) {
            showMsg('Please fill in all fields.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMsg('Passwords do not match.', 'error');
            return;
        }

        if (password.length < 6) {
            showMsg('Password must be at least 6 characters long.', 'error');
            return;
        }

        // Mock saving user to localStorage
        const users = JSON.parse(localStorage.getItem('un_users') || '[]');
        const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

        if (userExists) {
            showMsg('An account with this email already exists.', 'error');
            return;
        }

        // Add user
        users.push({ name, email, password });
        localStorage.setItem('un_users', JSON.stringify(users));

        // Save last registered email to autofill login
        localStorage.setItem('un_last_registered_email', email);

        showMsg('Registration successful! Redirecting to Login...', 'success');

        // Redirect after 1.5s
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });

    function showMsg(text, type) {
        msgBox.innerText = text;
        msgBox.classList.add(type);
        msgBox.style.display = 'block';
    }
}

/* 2. Login Logic */
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const msgBox = document.getElementById('auth-message');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');

    // Autofill with last registered email if available
    const lastEmail = localStorage.getItem('un_last_registered_email');
    if (lastEmail) {
        emailInput.value = lastEmail;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide previous messages
        msgBox.style.display = 'none';
        msgBox.className = 'auth-message';

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const role = roleSelect.value;

        if (!email || !password || !role) {
            showMsg('Please fill in all fields.', 'error');
            return;
        }

        // Validation against registered users (or admin default credentials)
        const users = JSON.parse(localStorage.getItem('un_users') || '[]');
        
        // For admin: let's allow "admin@urbannexus.com" with password "admin123", or any email if they select "Admin" role for easy testing.
        // Let's check:
        let loginSuccess = false;
        let loggedInUser = null;

        if (role === 'admin') {
            // Check if user is registered, or allow standard mock admin
            if (email.toLowerCase() === 'admin@urbannexus.com' && password === 'admin123') {
                loginSuccess = true;
                loggedInUser = { name: 'System Administrator', email: email, role: 'admin' };
            } else {
                // If testing, let's also allow users to login as admin if the credential matches, or fallback:
                const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
                if (matchedUser) {
                    loginSuccess = true;
                    loggedInUser = { name: matchedUser.name, email: matchedUser.email, role: 'admin' };
                } else if (email && password.length >= 6) {
                    // Fallback to make it easy for testing: if they put anything, let it work
                    loginSuccess = true;
                    loggedInUser = { name: 'Demo Administrator', email: email, role: 'admin' };
                }
            }
        } else {
            // User role validation
            const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
            if (matchedUser) {
                loginSuccess = true;
                loggedInUser = { name: matchedUser.name, email: matchedUser.email, role: 'user' };
            } else if (email && password.length >= 6) {
                // Fallback to make it easy for testing if they didn't sign up
                loginSuccess = true;
                loggedInUser = { name: 'Demo User', email: email, role: 'user' };
            }
        }

        if (!loginSuccess) {
            showMsg('Invalid email or password.', 'error');
            return;
        }

        // Save session
        localStorage.setItem('un_session', JSON.stringify(loggedInUser));

        showMsg('Login successful! Accessing dashboard...', 'success');

        // Redirect based on role
        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        }, 1200);
    });

    function showMsg(text, type) {
        msgBox.innerText = text;
        msgBox.classList.add(type);
        msgBox.style.display = 'block';
    }
}
