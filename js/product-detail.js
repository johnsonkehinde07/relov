/* ========================================
   JS/product-detail.js - Product Detail Logic
   ======================================== */

// Sample product data (matching marketplace.js)
const productData = {
    id: 1,
    title: 'Ergonomic Desk Chair',
    description: 'Like new, barely used. Great for long study sessions. Ergonomic design with lumbar support, adjustable height, and comfortable padding. Perfect for students who spend hours studying.',
    price: 45,
    category: 'furniture',
    condition: 'like-new',
    university: 'UC Berkeley',
    seller: 'John D.',
    sellerInitials: 'JD',
    time: '2 hours ago',
    location: 'Main Campus',
    image: '🪑',
    featured: false,
    sold: false,
    rating: 4.8,
    reviews: 24,
    memberSince: '2023',
    itemsSold: 12
};

// Related products
const relatedProducts = [
    {
        id: 2,
        title: 'Textbook Bundle - Calculus + Physics',
        price: 80,
        category: 'books',
        image: '📚',
        seller: 'Sarah M.',
        sellerInitials: 'SM',
        time: '5 hours ago',
        location: 'Science Building',
        condition: 'like-new'
    },
    {
        id: 3,
        title: 'Gaming Console - PS5',
        price: 350,
        category: 'electronics',
        image: '🎮',
        seller: 'Alex C.',
        sellerInitials: 'AC',
        time: '1 day ago',
        location: 'Dorm 4B',
        condition: 'like-new'
    },
    {
        id: 4,
        title: 'Mountain Bike',
        price: 180,
        category: 'room-essentials',
        image: '🚲',
        seller: 'Mike J.',
        sellerInitials: 'MJ',
        time: '2 days ago',
        location: 'Bike Rack',
        condition: 'good'
    },
    {
        id: 5,
        title: 'Dorm Room Mini Fridge',
        price: 65,
        category: 'kitchen',
        image: '🧊',
        seller: 'Emily R.',
        sellerInitials: 'ER',
        time: '3 days ago',
        location: 'Dorm 2A',
        condition: 'good'
    }
];

// Image gallery (simulated)
let currentImageIndex = 0;
const galleryImages = ['🪑', '🪑', '🪑', '🪑'];

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Product detail loaded');
    
    // Load product data (in production, this would come from URL params or API)
    loadProductData(productData);
    renderRelatedProducts(relatedProducts);
    setupImageGallery();
});

/* ========================================
   LOAD PRODUCT DATA
   ======================================== */
function loadProductData(product) {
    // Update breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.title;
    
    // Update title
    document.getElementById('productTitle').textContent = product.title;
    document.querySelector('title').textContent = product.title + ' - Relov';
    
    // Update category
    document.getElementById('productCategory').textContent = 
        product.category.charAt(0).toUpperCase() + product.category.slice(1);
    
    // Update price
    document.getElementById('productPrice').textContent = '$' + product.price;
    
    // Update description
    document.getElementById('productDescription').textContent = product.description;
    
    // Update condition
    const conditionDisplay = product.condition.split('-').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
    document.getElementById('productCondition').textContent = conditionDisplay;
    document.getElementById('detailCondition').textContent = conditionDisplay;
    
    // Update category detail
    document.getElementById('detailCategory').textContent = 
        product.category.charAt(0).toUpperCase() + product.category.slice(1);
    
    // Update time
    document.getElementById('detailListed').textContent = product.time;
    
    // Update location
    document.getElementById('detailLocation').textContent = product.location;
    
    // Update emoji
    document.getElementById('productEmoji').textContent = product.image;
    
    // Update badges
    if (product.sold) {
        document.getElementById('soldBadge').style.display = 'block';
    }
    if (product.featured) {
        document.getElementById('featuredBadge').style.display = 'block';
    }
    
    // Update seller
    document.getElementById('sellerName').textContent = product.seller;
    document.getElementById('sellerAvatar').textContent = product.sellerInitials;
    document.querySelector('.seller-meta span:first-child').innerHTML = 
        '<i class="fas fa-calendar"></i> Member since ' + product.memberSince;
    document.querySelector('.seller-meta span:last-child').innerHTML = 
        '<i class="fas fa-box"></i> ' + product.itemsSold + ' items sold';
    
    // Update rating
    const ratingStars = document.querySelector('.product-rating');
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    // Clear existing stars
    ratingStars.querySelectorAll('.fas.fa-star, .fas.fa-star-half-alt').forEach(el => el.remove());
    
    // Add stars
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        ratingStars.insertBefore(star, ratingStars.querySelector('.rating-count'));
    }
    if (hasHalfStar) {
        const star = document.createElement('i');
        star.className = 'fas fa-star-half-alt';
        ratingStars.insertBefore(star, ratingStars.querySelector('.rating-count'));
    }
    ratingStars.querySelector('.rating-count').textContent = 
        `(${product.reviews} reviews)`;
}

/* ========================================
   IMAGE GALLERY
   ======================================== */
function setupImageGallery() {
    // Set initial thumbnail
    updateThumbnails(0);
}

function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    updateImage(currentImageIndex);
    updateThumbnails(currentImageIndex);
}

function setImage(index) {
    currentImageIndex = index;
    updateImage(index);
    updateThumbnails(index);
}

function updateImage(index) {
    document.getElementById('productEmoji').textContent = galleryImages[index];
}

function updateThumbnails(activeIndex) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === activeIndex);
        thumb.querySelector('span').textContent = galleryImages[i % galleryImages.length];
    });
}

/* ========================================
   RENDER RELATED PRODUCTS
   ======================================== */
function renderRelatedProducts(products) {
    const grid = document.getElementById('relatedProducts');
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-card-image" style="background: ${getCategoryColor(product.category)};">
                <span style="font-size: 3rem;">${product.image}</span>
                <button class="product-card-heart" onclick="event.stopPropagation(); toggleWishlist(event, ${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-card-body">
                <div class="product-card-header">
                    <h3 class="product-card-title">${product.title}</h3>
                    <span class="product-card-time">${product.time}</span>
                </div>
                <p class="product-card-description">${product.condition}</p>
                <div class="product-card-footer">
                    <span class="product-card-price">$${product.price}</span>
                    <span class="product-card-location">
                        <i class="fas fa-map-pin"></i> ${product.location}
                    </span>
                </div>
                <div class="product-card-seller">
                    <div class="product-card-avatar" style="background: ${getAvatarColor(product.sellerInitials)};">
                        ${product.sellerInitials}
                    </div>
                    <span class="product-card-seller-name">${product.seller}</span>
                    <span class="product-card-badge">Verified</span>
                </div>
            </div>
        </div>
    `).join('');
}

/* ========================================
   ACTIONS
   ======================================== */
function viewProduct(id) {
    window.location.href = `product-detail.html?id=${id}`;
}

function contactSeller() {
    showToast('💬 Opening chat with seller...');
}

function makeOffer() {
    document.getElementById('offerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('offerModal').classList.remove('active');
    document.body.style.overflow = '';
}

function submitOffer(event) {
    event.preventDefault();
    const price = document.getElementById('offerPrice').value;
    const message = document.getElementById('offerMessage').value;
    
    if (!price || price <= 0) {
        showToast('⚠️ Please enter a valid offer price');
        return;
    }
    
    closeModal();
    showToast(`✅ Offer of $${price} sent to seller!`);
    
    // Reset form
    document.getElementById('offerForm').reset();
}

function toggleWishlist() {
    const btn = document.querySelector('.wishlist-btn');
    const icon = btn.querySelector('i');
    
    btn.classList.toggle('liked');
    if (btn.classList.contains('liked')) {
        icon.className = 'fas fa-heart';
        showToast('❤️ Added to wishlist');
    } else {
        icon.className = 'far fa-heart';
        showToast('Removed from wishlist');
    }
}

function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('productTitle').textContent,
            text: 'Check out this item on Relov!',
            url: window.location.href
        }).catch(() => {});
    } else {
        // Fallback
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('📋 Link copied to clipboard!');
        }).catch(() => {
            showToast('📋 Share: ' + window.location.href);
        });
    }
}

function reportProduct() {
    showToast('🚫 Report submitted. We\'ll review it shortly.');
}

function saveProduct() {
    showToast('📌 Product saved to your list');
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
   HELPER FUNCTIONS
   ======================================== */
function getCategoryColor(category) {
    const colors = {
        furniture: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
        electronics: 'linear-gradient(135deg, #F3E8FF, #FAF5FF)',
        books: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',
        fashion: 'linear-gradient(135deg, #FCE4EC, #FDF2F8)',
        kitchen: 'linear-gradient(135deg, #D1FAE5, #ECFDF5)',
        'room-essentials': 'linear-gradient(135deg, #E0E7FF, #EEF2FF)',
        services: 'linear-gradient(135deg, #FEE2E2, #FEF2F2)',
        food: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)'
    };
    return colors[category] || 'linear-gradient(135deg, #F1F5F9, #F8FAFC)';
}

function getAvatarColor(initials) {
    const colors = [
        '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', 
        '#10B981', '#EF4444', '#6366F1', '#14B8A6'
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
}

/* ========================================
   NAVBAR - Mobile Menu Toggle
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

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});