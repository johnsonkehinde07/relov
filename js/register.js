/* ========================================
   JS/register.js - Registration Logic
   ======================================== */

let currentRegisterStep = 1;
const totalRegisterSteps = 3;
let uploadedVerificationFile = null;

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Register page loaded');
    
    setupPasswordStrength();
    setupVerificationUpload();
    setupUniversitySuggestions();
    updateRegisterProgress(1);
});

/* ========================================
   STEP NAVIGATION
   ======================================== */
function nextRegisterStep(step) {
    // Validate current step
    if (!validateRegisterStep(currentRegisterStep)) {
        return;
    }
    
    currentRegisterStep = step;
    updateRegisterStep(step);
}

function prevRegisterStep(step) {
    currentRegisterStep = step;
    updateRegisterStep(step);
}

function updateRegisterStep(step) {
    // Update form steps
    document.querySelectorAll('.form-step-register').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.form-step-register[data-step="${step}"]`).classList.add('active');
    
    // Update progress
    updateRegisterProgress(step);
    
    // Scroll to top of form
    document.querySelector('.register-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function updateRegisterProgress(step) {
    const indicators = document.querySelectorAll('.step-indicator');
    const lines = document.querySelectorAll('.step-line');
    
    indicators.forEach((el, index) => {
        const num = index + 1;
        el.classList.remove('active', 'completed');
        
        if (num < step) {
            el.classList.add('completed');
        } else if (num === step) {
            el.classList.add('active');
        }
    });
    
    lines.forEach((line, index) => {
        const num = index + 1;
        line.classList.toggle('active', num < step);
    });
}

/* ========================================
   VALIDATION
   ======================================== */
function validateRegisterStep(step) {
    const stepElement = document.querySelector(`.form-step-register[data-step="${step}"]`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Remove existing error
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.remove();
        
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                field.style.outline = '2px solid var(--danger)';
            } else {
                field.style.outline = '';
            }
            return;
        }
        
        if (!field.value || field.value.trim() === '') {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'This field is required');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Special validation for step 1 (password match)
    if (step === 1) {
        const password = document.getElementById('regPassword');
        const confirm = document.getElementById('regConfirmPassword');
        
        if (password.value && confirm.value && password.value !== confirm.value) {
            isValid = false;
            confirm.classList.add('error');
            showFieldError(confirm, 'Passwords do not match');
        }
        
        // Password length
        if (password.value && password.value.length < 8) {
            isValid = false;
            password.classList.add('error');
            showFieldError(password, 'Password must be at least 8 characters');
        }
    }
    
    // Special validation for step 3 (verification)
    if (step === 3) {
        const termsCheckbox = document.getElementById('regTerms');
        if (!termsCheckbox.checked) {
            isValid = false;
            termsCheckbox.style.outline = '2px solid var(--danger)';
            showToast('⚠️ Please agree to the Terms of Service', 'error');
        } else {
            termsCheckbox.style.outline = '';
        }
        
        // Check if verification file is uploaded (optional)
        if (!uploadedVerificationFile) {
            // Show warning but don't block
            showToast('💡 You can upload your student ID for faster verification', 'info');
        }
    }
    
    if (!isValid) {
        showToast('⚠️ Please fill in all required fields correctly', 'error');
    }
    
    return isValid;
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
   PASSWORD STRENGTH
   ======================================== */
function setupPasswordStrength() {
    const passwordInput = document.getElementById('regPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Update bar
        strengthBar.className = 'strength-bar';
        if (password.length === 0) {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = '';
            strengthText.className = 'strength-text';
            return;
        }
        
        if (strength < 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.className = 'strength-text weak';
        } else if (strength < 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium';
            strengthText.className = 'strength-text medium';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.className = 'strength-text strong';
        }
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    
    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Uppercase
    if (/[A-Z]/.test(password)) score++;
    
    // Lowercase
    if (/[a-z]/.test(password)) score++;
    
    // Numbers
    if (/[0-9]/.test(password)) score++;
    
    // Special characters
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
}

/* ========================================
   VERIFICATION UPLOAD
   ======================================== */
function setupVerificationUpload() {
    const uploadArea = document.getElementById('verificationUpload');
    const fileInput = document.getElementById('verificationFile');
    
    uploadArea.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') {
            fileInput.click();
        }
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = this.files[0];
        if (file) {
            handleVerificationFile(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary)';
        this.style.background = 'var(--primary-50)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.background = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file) {
            handleVerificationFile(file);
        }
    });
}

function handleVerificationFile(file) {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showToast('⚠️ Please upload JPG, PNG, or PDF files only', 'error');
        return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showToast('⚠️ File too large. Max 5MB', 'error');
        return;
    }
    
    uploadedVerificationFile = file;
    
    const uploadArea = document.getElementById('verificationUpload');
    uploadArea.classList.add('uploaded');
    
    // Update content
    const content = uploadArea.querySelector('.upload-content');
    content.innerHTML = `
        <i class="fas fa-check-circle upload-icon" style="color: var(--primary);"></i>
        <h4 style="color: var(--primary);">${file.name}</h4>
        <p>${(file.size / 1024).toFixed(1)} KB • Click to change</p>
        <span class="file-name">✅ Uploaded successfully</span>
    `;
    
    showToast('✅ Verification file uploaded', 'success');
}

/* ========================================
   UNIVERSITY SUGGESTIONS
   ======================================== */
function setupUniversitySuggestions() {
    const universitySelect = document.getElementById('regUniversity');
    const emailInput = document.getElementById('regEmail');
    
    const universityDomains = {
        'uc-berkeley': 'berkeley.edu',
        'nyu': 'nyu.edu',
        'ut-austin': 'utexas.edu',
        'stanford': 'stanford.edu',
        'ucla': 'ucla.edu',
        'michigan': 'umich.edu',
        'harvard': 'harvard.edu',
        'mit': 'mit.edu'
    };
    
    universitySelect.addEventListener('change', function() {
        const value = this.value;
        if (value && universityDomains[value]) {
            const domain = universityDomains[value];
            const currentEmail = emailInput.value;
            
            // If email doesn't have an @ or is empty, suggest
            if (!currentEmail || !currentEmail.includes('@')) {
                const name = currentEmail || 'student';
                const cleanName = name.split('@')[0];
                emailInput.value = `${cleanName}@${domain}`;
            }
        }
    });
    
    emailInput.addEventListener('blur', function() {
        const email = this.value;
        if (email && email.includes('@')) {
            const domain = email.split('@')[1];
            // Could auto-select university based on domain
        }
    });
}

/* ========================================
   HANDLE REGISTER
   ======================================== */
function handleRegister(event) {
    event.preventDefault();
    
    // Validate final step
    if (!validateRegisterStep(3)) {
        return;
    }
    
    // Collect all form data
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value,
        university: document.getElementById('regUniversity').value,
        faculty: document.getElementById('regFaculty').value,
        level: document.getElementById('regLevel').value,
        studentId: document.getElementById('regStudentId').value,
        verificationMethod: document.querySelector('input[name="verification"]:checked')?.value || 'email',
        verificationFile: uploadedVerificationFile ? uploadedVerificationFile.name : null,
        terms: document.getElementById('regTerms').checked
    };
    
    console.log('📝 Registering user:', formData);
    
    // Show loading state
    const btn = document.getElementById('registerBtn');
    const btnText = document.getElementById('registerBtnText');
    const btnIcon = document.getElementById('registerBtnIcon');
    
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btnText.textContent = 'Creating Account...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    
    // Simulate API call
    setTimeout(() => {
        // Success (demo)
        localStorage.setItem('relov_logged_in', 'true');
        localStorage.setItem('relov_user_email', formData.email);
        localStorage.setItem('relov_user_name', formData.name);
        
        showToast('🎉 Account created successfully! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

/* ========================================
   SOCIAL REGISTER
   ======================================== */
function socialRegister(provider) {
    const providerNames = {
        google: 'Google',
        microsoft: 'Microsoft'
    };
    
    showToast(`🔄 Connecting to ${providerNames[provider]}...`, 'info');
    
    setTimeout(() => {
        // Demo: auto-register with social
        localStorage.setItem('relov_logged_in', 'true');
        localStorage.setItem('relov_user_email', `${provider}@university.edu`);
        localStorage.setItem('relov_user_name', `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`);
        localStorage.setItem('relov_social_provider', provider);
        
        showToast(`✅ Signed up with ${providerNames[provider]}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
}

/* ========================================
   TOGGLE PASSWORD
   ======================================== */
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

/* ========================================
   TOAST NOTIFICATION
   ======================================== */
function showToast(message, type = 'info') {
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
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

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