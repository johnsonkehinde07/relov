/* ========================================
   JS/auth.js - Authentication Logic
   ======================================== */

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Auth page loaded');
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Setup form submission
    setupFormValidation();
});

/* ========================================
   CHECK AUTH STATUS
   ======================================== */
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('relov_logged_in') === 'true';
    if (isLoggedIn) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

/* ========================================
   FORM VALIDATION
   ======================================== */
function setupFormValidation() {
    const form = document.getElementById('loginForm');
    
    // Real-time validation on inputs
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error state while typing
            this.classList.remove('error');
            const errorEl = this.parentElement.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    // Remove existing error
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.remove();
    
    if (!value) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value && value.length < 6) {
        field.classList.add('error');
        showFieldError(field, 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = `
        color: var(--danger);
        font-size: 0.8125rem;
        margin-top: 0.25rem;
        display: block;
    `;
    error.textContent = message;
    field.parentElement.appendChild(error);
}

/* ========================================
   HANDLE LOGIN
   ======================================== */
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');
    
    // Validate fields
    const isEmailValid = validateField(email);
    const isPasswordValid = validateField(password);
    
    if (!isEmailValid || !isPasswordValid) {
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('loginBtn');
    const btnText = document.getElementById('loginBtnText');
    const btnIcon = document.getElementById('loginBtnIcon');
    
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btnText.textContent = 'Signing in...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    
    // Simulate API call
    setTimeout(() => {
        // Check credentials (demo)
        if (email.value === 'student@university.edu' && password.value === 'password123') {
            // Success
            if (rememberMe.checked) {
                localStorage.setItem('relov_logged_in', 'true');
                localStorage.setItem('relov_user_email', email.value);
            }
            
            showToast('✅ Welcome back! Redirecting...', 'success');
            
            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Failed
            showToast('❌ Invalid email or password. Please try again.', 'error');
            
            // Reset button
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btnText.textContent = 'Sign In';
            btnIcon.className = 'fas fa-arrow-right';
            
            // Shake animation
            document.querySelector('.auth-container').style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                document.querySelector('.auth-container').style.animation = '';
            }, 500);
        }
    }, 1500);
}

/* ========================================
   SOCIAL LOGIN
   ======================================== */
function socialLogin(provider) {
    const providerNames = {
        google: 'Google',
        microsoft: 'Microsoft',
        apple: 'Apple'
    };
    
    showToast(`🔄 Redirecting to ${providerNames[provider]}...`, 'info');
    
    // Simulate social login
    setTimeout(() => {
        // Demo: auto-login with social
        localStorage.setItem('relov_logged_in', 'true');
        localStorage.setItem('relov_user_email', 'social@university.edu');
        localStorage.setItem('relov_social_provider', provider);
        
        showToast(`✅ Signed in with ${providerNames[provider]}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
}

/* ========================================
   TOGGLE PASSWORD VISIBILITY
   ======================================== */
function togglePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const icon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

/* ========================================
   FILL DEMO CREDENTIALS
   ======================================== */
function fillDemo(email, password) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    
    // Highlight the fields
    const emailField = document.getElementById('loginEmail');
    const passField = document.getElementById('loginPassword');
    
    emailField.style.borderColor = 'var(--primary)';
    emailField.style.boxShadow = '0 0 0 3px rgba(26, 86, 219, 0.1)';
    passField.style.borderColor = 'var(--primary)';
    passField.style.boxShadow = '0 0 0 3px rgba(26, 86, 219, 0.1)';
    
    setTimeout(() => {
        emailField.style.borderColor = '';
        emailField.style.boxShadow = '';
        passField.style.borderColor = '';
        passField.style.boxShadow = '';
    }, 2000);
    
    showToast('📝 Credentials filled! Click Sign In.', 'info');
}

/* ========================================
   TOAST NOTIFICATION
   ======================================== */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    }
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* ========================================
   KEYBOARD SHORTCUTS
   ======================================== */
document.addEventListener('keydown', function(e) {
    // Press "Esc" to clear form
    if (e.key === 'Escape') {
        document.getElementById('loginForm').reset();
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error');
            const errorEl = input.parentElement.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        });
        showToast('🧹 Form cleared', 'info');
    }
});

/* ========================================
   NAVBAR FUNCTIONS
   ======================================== */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

/* ========================================
   SHAKE ANIMATION (for error feedback)
   ======================================== */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);