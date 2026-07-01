/* ========================================
   JS/universities.js - Universities Page Logic
   ======================================== */

let selectedUniversity = '';

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏛️ Universities page loaded');
    
    // Check URL params for university selection
    const urlParams = new URLSearchParams(window.location.search);
    const university = urlParams.get('university');
    if (university) {
        selectedUniversity = university;
        highlightUniversity(university);
    }
});

/* ========================================
   JOIN WAITLIST
   ======================================== */
function joinWaitlist(universityName) {
    // Store university name
    selectedUniversity = universityName;
    
    // Update modal text
    document.getElementById('waitlistUniversityText').textContent = 
        `Get notified when ${universityName} joins Relov`;
    
    // Pre-select university in dropdown
    const select = document.getElementById('waitlistUniversity');
    const optionMap = {
        'Covenant University': 'covenant',
        'Babcock University': 'babcock',
        'Lead City University': 'lead-city',
        'Afe Babalola University': 'abuad',
        'University of Lagos': 'unilag',
        'Obafemi Awolowo University': 'oau'
    };
    
    const value = optionMap[universityName];
    if (value) {
        select.value = value;
    }
    
    // Show modal
    document.getElementById('waitlistModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* ========================================
   CLOSE WAITLIST MODAL
   ======================================== */
function closeWaitlistModal() {
    document.getElementById('waitlistModal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ========================================
   SUBMIT WAITLIST
   ======================================== */
function submitWaitlist(event) {
    event.preventDefault();
    
    const name = document.getElementById('waitlistName').value.trim();
    const email = document.getElementById('waitlistEmail').value.trim();
    const university = document.getElementById('waitlistUniversity').value;
    
    // Validate
    if (!name) {
        showToast('⚠️ Please enter your full name', 'error');
        return;
    }
    
    if (!email || !isValidEmail(email)) {
        showToast('⚠️ Please enter a valid email address', 'error');
        return;
    }
    
    if (!university) {
        showToast('⚠️ Please select your university', 'error');
        return;
    }
    
    // Get university name
    const select = document.getElementById('waitlistUniversity');
    const universityName = select.options[select.selectedIndex].text;
    
    // Simulate API call
    console.log('📝 Waitlist signup:', { name, email, university: universityName });
    
    // Show success
    showToast(`✅ You've joined the waitlist for ${universityName}!`, 'success');
    
    // Close modal
    closeWaitlistModal();
    
    // Reset form
    document.getElementById('waitlistForm').reset();
}

/* ========================================
   HIGHLIGHT UNIVERSITY
   ======================================== */
function highlightUniversity(university) {
    // Scroll to universities section
    const section = document.querySelector('.universities-grid-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Highlight the card if it exists
    const cards = document.querySelectorAll('.university-card');
    cards.forEach(card => {
        const name = card.querySelector('.university-name')?.textContent?.toLowerCase() || '';
        if (name.includes(university.toLowerCase())) {
            card.style.borderColor = 'var(--primary)';
            card.style.boxShadow = '0 0 0 3px rgba(26, 86, 219, 0.15), var(--shadow-lg)';
            setTimeout(() => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 3000);
        }
    });
}

/* ========================================
   VALIDATE EMAIL
   ======================================== */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
   CLOSE MODAL ON ESCAPE
   ======================================== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeWaitlistModal();
    }
});

/* ========================================
   CLOSE MODAL ON OVERLAY CLICK
   ======================================== */
document.querySelector('.modal-overlay')?.addEventListener('click', function() {
    closeWaitlistModal();
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
   ANIMATE STATS ON SCROLL
   ======================================== */
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                
                // Only animate if it contains a number
                if (/\d/.test(text)) {
                    const number = parseFloat(text.replace(/[^0-9.]/g, ''));
                    if (!isNaN(number) && number > 0) {
                        animateNumber(el, number);
                    }
                }
                
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.5
    });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateNumber(element, target) {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Get the original suffix
        const originalText = element.textContent;
        const hasCurrency = originalText.includes('₦');
        const suffix = originalText.replace(/[0-9.]/g, '');
        
        // Plain number - NO commas, NO formatting
        let displayValue = Math.floor(current);
        let result = displayValue.toString();
        
        // Add currency symbol if needed
        if (hasCurrency) {
            result = '₦' + result + suffix.replace('₦', '');
        } else {
            result = result + suffix;
        }
        
        element.textContent = result;
    }, stepTime);
}

// Run animation on load
window.addEventListener('load', function() {
    setTimeout(animateStats, 500);
}); 