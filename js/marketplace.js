/* ========================================
   JS/marketplace.js - Marketplace Logic
   ======================================== */

// Sample product data
const products = [
    {
        id: 1,
        title: 'Ergonomic Desk Chair',
        description: 'Like new, barely used. Great for long study sessions.',
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
        sold: false
    },
    {
        id: 2,
        title: 'Textbook Bundle - Calculus + Physics',
        description: 'Complete set for STEM students. Excellent condition.',
        price: 80,
        category: 'books',
        condition: 'like-new',
        university: 'NYU',
        seller: 'Sarah M.',
        sellerInitials: 'SM',
        time: '5 hours ago',
        location: 'Science Building',
        image: '📚',
        featured: true,
        sold: false
    },
    {
        id: 3,
        title: 'Gaming Console - PS5',
        description: 'Includes 2 controllers and 3 games. Barely used.',
        price: 350,
        category: 'electronics',
        condition: 'like-new',
        university: 'UT Austin',
        seller: 'Alex C.',
        sellerInitials: 'AC',
        time: '1 day ago',
        location: 'Dorm 4B',
        image: '🎮',
        featured: false,
        sold: false
    },
    {
        id: 4,
        title: 'Mountain Bike',
        description: 'New tires, great condition. Perfect for campus commuting.',
        price: 180,
        category: 'room-essentials',
        condition: 'good',
        university: 'Stanford',
        seller: 'Mike J.',
        sellerInitials: 'MJ',
        time: '2 days ago',
        location: 'Bike Rack',
        image: '🚲',
        featured: false,
        sold: false
    },
    {
        id: 5,
        title: 'Dorm Room Mini Fridge',
        description: 'Energy efficient, perfect for snacks and drinks.',
        price: 65,
        category: 'kitchen',
        condition: 'good',
        university: 'UC Berkeley',
        seller: 'Emily R.',
        sellerInitials: 'ER',
        time: '3 days ago',
        location: 'Dorm 2A',
        image: '🧊',
        featured: false,
        sold: false
    },
    {
        id: 6,
        title: 'Vintage Desk Lamp',
        description: 'Beautiful brass finish, Edison bulb included.',
        price: 25,
        category: 'room-essentials',
        condition: 'good',
        university: 'NYU',
        seller: 'David K.',
        sellerInitials: 'DK',
        time: '4 days ago',
        location: 'Main Campus',
        image: '💡',
        featured: false,
        sold: true
    },
    {
        id: 7,
        title: 'Coffee Table - Oak Finish',
        description: 'Solid wood, minor scratches but very sturdy.',
        price: 120,
        category: 'furniture',
        condition: 'fair',
        university: 'UT Austin',
        seller: 'Lisa W.',
        sellerInitials: 'LW',
        time: '5 days ago',
        location: 'Apartment 3C',
        image: '🪵',
        featured: false,
        sold: false
    },
    {
        id: 8,
        title: 'Graphic Design Service',
        description: 'Need a logo, poster, or presentation design?',
        price: 30,
        category: 'services',
        condition: 'any',
        university: 'Stanford',
        seller: 'Chris P.',
        sellerInitials: 'CP',
        time: '1 week ago',
        location: 'Online',
        image: '🎨',
        featured: false,
        sold: false
    },
    {
        id: 9,
        title: 'Microwave - 700W',
        description: 'Works perfectly, great for dorm cooking.',
        price: 40,
        category: 'kitchen',
        condition: 'good',
        university: 'UC Berkeley',
        seller: 'Anna T.',
        sellerInitials: 'AT',
        time: '1 week ago',
        location: 'Dorm 5C',
        image: '📱',
        featured: false,
        sold: false
    },
    {
        id: 10,
        title: 'Textbook - Organic Chemistry',
        description: 'Latest edition, like new. Highlighted notes included.',
        price: 55,
        category: 'books',
        condition: 'like-new',
        university: 'NYU',
        seller: 'James L.',
        sellerInitials: 'JL',
        time: '1 week ago',
        location: 'Science Library',
        image: '🔬',
        featured: false,
        sold: false
    },
    {
        id: 11,
        title: 'Wireless Headphones - Sony',
        description: 'Noise cancelling, great battery life.',
        price: 75,
        category: 'electronics',
        condition: 'like-new',
        university: 'UT Austin',
        seller: 'Maria G.',
        sellerInitials: 'MG',
        time: '2 weeks ago',
        location: 'Student Center',
        image: '🎧',
        featured: false,
        sold: false
    },
    {
        id: 12,
        title: 'Tutoring - Math & Physics',
        description: 'Experienced tutor for college level courses.',
        price: 40,
        category: 'services',
        condition: 'any',
        university: 'Stanford',
        seller: 'Tom H.',
        sellerInitials: 'TH',
        time: '2 weeks ago',
        location: 'Library',
        image: '🧮',
        featured: false,
        sold: false
    }
];

let currentPage = 0;
const itemsPerPage = 6;
let filteredProducts = [...products];
let currentView = 'grid';

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ Marketplace loaded with', products.length, 'products');
    
    // Initial render
    applyFilters();
    setupSearchListener();
});

/* ========================================
   RENDER PRODUCTS
   ======================================== */
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    const start = 0;
    const end = (currentPage + 1) * itemsPerPage;
    const paginatedProducts = productsToRender.slice(start, end);
    
    if (paginatedProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        document.querySelector('.load-more').style.display = 'none';
        return;
    }
    
    grid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-card-image" style="background: ${getCategoryColor(product.category)};">
                ${product.featured ? '<span class="product-card-badge-featured">Featured</span>' : ''}
                ${product.sold ? '<span class="product-card-badge-sold">Sold</span>' : ''}
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
                <p class="product-card-description">${product.description}</p>
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
    
    // Update results count
    document.getElementById('resultsCount').textContent = 
        `Showing ${paginatedProducts.length} of ${productsToRender.length} results`;
    
    // Show/hide load more
    const loadMoreBtn = document.querySelector('.load-more');
    if (end >= productsToRender.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

/* ========================================
   FILTERS
   ======================================== */
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Get selected categories
    const categoryCheckboxes = document.querySelectorAll('.filter-group:first-child input[type="checkbox"]');
    const selectedCategories = [];
    categoryCheckboxes.forEach(cb => {
        if (cb.checked) {
            selectedCategories.push(cb.value);
        }
    });
    
    // Get condition
    const conditionRadio = document.querySelector('input[name="condition"]:checked');
    const condition = conditionRadio ? conditionRadio.value : 'any';
    
    // Get price range
    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;
    
    // Get universities
    const uniCheckboxes = document.querySelectorAll('.filter-group:nth-child(4) input[type="checkbox"]');
    const selectedUniversities = [];
    uniCheckboxes.forEach(cb => {
        if (cb.checked && cb.value !== 'all') {
            selectedUniversities.push(cb.value);
        }
    });
    const allUniversities = uniCheckboxes[0]?.checked || selectedUniversities.length === 0;
    
    // Get sort
    const sortRadio = document.querySelector('input[name="sort"]:checked');
    const sort = sortRadio ? sortRadio.value : 'newest';
    
    // Apply filters
    filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = selectedCategories.length === 0 || 
            selectedCategories.includes(product.category);
        
        // Condition filter
        const matchesCondition = condition === 'any' || product.condition === condition;
        
        // Price filter
        const matchesPrice = product.price >= priceMin && product.price <= priceMax;
        
        // University filter
        const matchesUniversity = allUniversities || 
            selectedUniversities.includes(product.university.toLowerCase().replace(/ /g, '-'));
        
        return matchesSearch && matchesCategory && matchesCondition && 
               matchesPrice && matchesUniversity;
    });
    
    // Sort
    switch(sort) {
        case 'newest':
            // Keep as is (already in order)
            break;
        case 'popular':
            // Simulate popularity with random shuffle
            filteredProducts = filteredProducts.sort(() => Math.random() - 0.5);
            break;
        case 'price-low':
            filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
    
    // Reset page and render
    currentPage = 0;
    renderProducts(filteredProducts);
}

/* ========================================
   SEARCH
   ======================================== */
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

function performSearch() {
    applyFilters();
}

/* ========================================
   LOAD MORE
   ======================================== */
function loadMore() {
    currentPage++;
    renderProducts(filteredProducts);
}

/* ========================================
   VIEW PRODUCT
   ======================================== */
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

/* ========================================
   WISHLIST TOGGLE
   ======================================== */
function toggleWishlist(event, productId) {
    const heart = event.currentTarget;
    const icon = heart.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.className = 'fas fa-heart';
        heart.style.color = '#EF4444';
        showToast('Added to wishlist ❤️');
    } else {
        icon.className = 'far fa-heart';
        heart.style.color = '';
        showToast('Removed from wishlist');
    }
}

/* ========================================
   VIEW TOGGLE
   ======================================== */
function setView(view) {
    currentView = view;
    const grid = document.getElementById('productsGrid');
    grid.className = 'products-grid' + (view === 'list' ? ' list-view' : '');
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.view-btn:has(.fa-${view === 'grid' ? 'th' : 'list'})`).classList.add('active');
}

/* ========================================
   FILTER TOGGLE (Mobile)
   ======================================== */
function toggleFilters() {
    const content = document.getElementById('filtersContent');
    content.classList.toggle('active');
}

/* ========================================
   CLEAR FILTERS
   ======================================== */
function clearFilters() {
    // Clear search
    document.getElementById('searchInput').value = '';
    
    // Clear category checkboxes
    document.querySelectorAll('.filter-group:first-child input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset condition
    document.querySelector('input[name="condition"][value="any"]').checked = true;
    
    // Clear price
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    
    // Reset universities
    document.querySelectorAll('.filter-group:nth-child(4) input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    // Reset sort
    document.querySelector('input[name="sort"][value="newest"]').checked = true;
    
    // Apply filters
    applyFilters();
}

/* ========================================
   TOAST NOTIFICATION
   ======================================== */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--slate-900);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-full);
        font-size: 0.875rem;
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(1rem)';
        setTimeout(() => {
            document.body.removeChild(toast);
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

// Close mobile menu when clicking a link
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