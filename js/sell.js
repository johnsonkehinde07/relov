/* ========================================
   JS/sell.js - Sell Page Logic
   ======================================== */

let uploadedFiles = [];
let currentStep = 1;
const totalSteps = 4;

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Sell page loaded');
    
    setupImageUpload();
    setupAvailabilityToggle();
    setupPriceSuggestions();
    updateProgress(1);
});

/* ========================================
   STEP NAVIGATION
   ======================================== */
function nextStep(step) {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
        return;
    }
    
    currentStep = step;
    updateStep(step);
}

function prevStep(step) {
    currentStep = step;
    updateStep(step);
}

function updateStep(step) {
    // Update form steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    
    // Update progress
    updateProgress(step);
    
    // Scroll to top of form
    document.querySelector('.sell-form-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.step-item');
    const lines = document.querySelectorAll('.step-line');
    
    steps.forEach((el, index) => {
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
function validateStep(step) {
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Remove existing error
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.remove();
        
        if (!field.value || field.value.trim() === '') {
            isValid = false;
            field.classList.add('error');
            field.style.borderColor = 'var(--danger)';
            
            // Add error message
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = `
                color: var(--danger);
                font-size: 0.8125rem;
                margin-top: 0.25rem;
                display: block;
            `;
            errorMsg.textContent = 'This field is required';
            field.parentElement.appendChild(errorMsg);
            
            // Focus first invalid field
            if (isValid === false) {
                field.focus();
            }
        } else {
            field.style.borderColor = '';
        }
    });
    
    // Special validation for step 2 (images)
    if (step === 2 && uploadedFiles.length === 0) {
        isValid = false;
        const uploadArea = document.getElementById('uploadArea');
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.style.cssText = `
            color: var(--danger);
            font-size: 0.8125rem;
            margin-top: 0.5rem;
            display: block;
            text-align: center;
        `;
        errorMsg.textContent = 'Please upload at least one photo';
        uploadArea.parentElement.appendChild(errorMsg);
        
        setTimeout(() => {
            if (errorMsg.parentElement) {
                errorMsg.remove();
            }
        }, 3000);
    }
    
    if (!isValid) {
        showToast('⚠️ Please fill in all required fields');
    }
    
    return isValid;
}

/* ========================================
   IMAGE UPLOAD
   ======================================== */
function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageUpload');
    
    // Click to upload
    uploadArea.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') {
            fileInput.click();
        }
    });
    
    // File selection
    fileInput.addEventListener('change', function(e) {
        handleFiles(this.files);
        this.value = ''; // Reset so same file can be re-selected
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const maxFiles = 5;
    const remaining = maxFiles - uploadedFiles.length;
    
    if (remaining <= 0) {
        showToast('⚠️ Maximum 5 photos allowed');
        return;
    }
    
    const filesToAdd = Math.min(files.length, remaining);
    const fileArray = Array.from(files).slice(0, filesToAdd);
    
    fileArray.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showToast('⚠️ Please upload image files only');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showToast('⚠️ File too large. Max 5MB per image');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedFiles.push({
                file: file,
                dataUrl: e.target.result
            });
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

function renderImagePreviews() {
    const grid = document.getElementById('imagePreviewGrid');
    
    if (uploadedFiles.length === 0) {
        grid.innerHTML = '';
        return;
    }
    
    grid.innerHTML = uploadedFiles.map((item, index) => `
        <div class="image-preview-item">
            <img src="${item.dataUrl}" alt="Upload ${index + 1}" />
            ${index === 0 ? '<span class="image-main-badge">Main</span>' : ''}
            <button class="remove-image" onclick="removeImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Update upload area text
    const uploadContent = document.querySelector('.upload-content h3');
    if (uploadedFiles.length >= 5) {
        uploadContent.textContent = 'Maximum photos reached';
        document.getElementById('uploadArea').style.opacity = '0.5';
        document.getElementById('uploadArea').style.cursor = 'default';
    } else {
        uploadContent.textContent = `Upload ${5 - uploadedFiles.length} more photos`;
        document.getElementById('uploadArea').style.opacity = '1';
        document.getElementById('uploadArea').style.cursor = 'pointer';
    }
}

function removeImage(index) {
    uploadedFiles.splice(index, 1);
    renderImagePreviews();
}

/* ========================================
   AVAILABILITY TOGGLE
   ======================================== */
function setupAvailabilityToggle() {
    const radios = document.querySelectorAll('input[name="availability"]');
    const dateInput = document.getElementById('specificDate');
    
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'specific') {
                dateInput.style.display = 'block';
                dateInput.required = true;
            } else {
                dateInput.style.display = 'none';
                dateInput.required = false;
                dateInput.value = '';
            }
        });
    });
}

/* ========================================
   PRICE SUGGESTIONS
   ======================================== */
function setupPriceSuggestions() {
    const categorySelect = document.getElementById('itemCategory');
    const priceInput = document.getElementById('itemPrice');
    const priceHint = document.getElementById('suggestedPrice');
    
    const suggestions = {
        furniture: '$25 - $100',
        electronics: '$50 - $300',
        books: '$20 - $80',
        fashion: '$15 - $60',
        kitchen: '$15 - $50',
        'room-essentials': '$10 - $40',
        services: '$20 - $50',
        food: '$10 - $30'
    };
    
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        if (category && suggestions[category]) {
            priceHint.textContent = suggestions[category];
            priceInput.placeholder = suggestions[category];
        } else {
            priceHint.textContent = '$15 - $100';
            priceInput.placeholder = '0.00';
        }
    });
}

/* ========================================
   REVIEW
   ======================================== */
function updateReview() {
    const title = document.getElementById('itemTitle').value || 'Item Title';
    const category = document.getElementById('itemCategory');
    const categoryText = category.options[category.selectedIndex]?.text || 'Category';
    const condition = document.querySelector('input[name="condition"]:checked');
    const conditionText = condition ? condition.parentElement.querySelector('.condition-label').textContent : 'Condition';
    const price = document.getElementById('itemPrice').value || '0.00';
    const university = document.getElementById('itemUniversity');
    const universityText = university.options[university.selectedIndex]?.text || '-';
    const location = document.getElementById('meetLocation').value || '-';
    const description = document.getElementById('itemDescription').value || '-';
    
    document.getElementById('reviewTitle').textContent = title;
    document.getElementById('reviewCategory').textContent = categoryText;
    document.getElementById('reviewCondition').textContent = conditionText;
    document.getElementById('reviewPrice').textContent = '$' + parseFloat(price).toFixed(2);
    document.getElementById('reviewUniversity').textContent = universityText;
    document.getElementById('reviewLocation').textContent = location;
    document.getElementById('reviewDescription').textContent = description;
    
    // Update review image
    const reviewImage = document.getElementById('reviewImage');
    if (uploadedFiles.length > 0) {
        reviewImage.innerHTML = `<img src="${uploadedFiles[0].dataUrl}" alt="Main image" />`;
    } else {
        reviewImage.innerHTML = '<i class="fas fa-image"></i>';
    }
}

/* ========================================
   SUBMIT
   ======================================== */
function submitListing(event) {
    event.preventDefault();
    
    // Validate final step
    if (!validateStep(4)) {
        return;
    }
    
    // Update review before submit
    updateReview();
    
    // Collect all form data
    const formData = {
        title: document.getElementById('itemTitle').value,
        category: document.getElementById('itemCategory').value,
        condition: document.querySelector('input[name="condition"]:checked')?.value || 'good',
        description: document.getElementById('itemDescription').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        university: document.getElementById('itemUniversity').value,
        location: document.getElementById('meetLocation').value,
        availability: document.querySelector('input[name="availability"]:checked')?.value || 'now',
        images: uploadedFiles.length
    };
    
    // Simulate API call
    console.log('📤 Submitting listing:', formData);
    
    // Show success
    showToast('✅ Your item has been listed successfully!');
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'marketplace.html';
    }, 2000);
    
    // Disable submit button
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Listing...';
}

/* ========================================
   SAVE DRAFT
   ======================================== */
function saveDraft() {
    // Collect form data
    const formData = {
        title: document.getElementById('itemTitle').value,
        category: document.getElementById('itemCategory').value,
        condition: document.querySelector('input[name="condition"]:checked')?.value || 'good',
        description: document.getElementById('itemDescription').value,
        price: document.getElementById('itemPrice').value,
        university: document.getElementById('itemUniversity').value,
        location: document.getElementById('meetLocation').value,
        availability: document.querySelector('input[name="availability"]:checked')?.value || 'now',
        images: uploadedFiles.length
    };
    
    // Save to localStorage
    localStorage.setItem('relov_draft', JSON.stringify(formData));
    
    showToast('💾 Draft saved successfully!');
}

/* ========================================
   TOAST NOTIFICATION
   ======================================== */
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
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