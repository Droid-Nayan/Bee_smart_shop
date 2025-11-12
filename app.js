//  Global Variable
let userBalance = 1000;
let cart = [];
let products = [];
let currentBannerIndex = 0;
let currentReviewIndex = 0;
let appliedDiscount = 0;
let couponApplied = false;

const DELIVERY_CHARGE = 50;
const SHIPPING_COST = 100;
const DISCOUNT_COUPON = "SMART10";
const DISCOUNT_PERCENTAGE = 10;
// Banner image
const bannerImages = [
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&w=1200&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&w=1200&q=80",
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&w=1200&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&w=1200&q=80"

  
];

// Reviews data
const reviewsData = [
    {
        name: "Mohammad hasan",
        comment: "Absolutely love this shop! The clothes are stylish, comfortable, and affordable. The quality is way better than I expected for the price.",
        rating: 5,
        date: "2025-04-15"
    },
    {
        name: "Aritra",
        comment: "Good quality items at reasonable prices. Will shop again.",
        rating: 4,
        date: "2025-03-10"
    },
    {
        name: "sejuti paul",
        comment: "Excellent customer service and user-friendly website.",
        rating: 5,
        date: "2025-03-08"
    },
    {
        name: "Nazim uddin",
        comment: "Absolutely love this shop! The clothes are stylish, comfortable, and affordable. The quality is way better than I expected for the price. I’ll definitely be coming back for more!.",
        rating: 5,
        date: "2024-03-05"
    }
];

// INITIALIZATION
// DOM API LOAD
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {

    loadBalance();
    initializeBanner();
    initializeReviews();
    fetchProducts();
    setupEventListeners();
    setupNavigation();
    setupSearchAndFilter();

}
// BANNER SLIDER
function initializeBanner() {
    // DOM API: getElementById() - Get banner container element
    const bannerContainer = document.getElementById('banner-container');
    const indicatorsContainer = document.getElementById('banner-indicators');
    
    // DOM API: createElement() & appendChild() - Create banner slides dynamically
    bannerImages.forEach((imageUrl, index) => {
        const slide = document.createElement('div');
        slide.className = `absolute w-full h-full transition-opacity duration-500 ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
        slide.style.backgroundImage = `url('${imageUrl}')`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        bannerContainer.appendChild(slide);
});
    setInterval(nextBanner, 5000);
}

function nextBanner() {
    currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
    updateBannerSlide();
}

function prevBanner() {
    currentBannerIndex = (currentBannerIndex - 1 + bannerImages.length) % bannerImages.length;
    updateBannerSlide();
}

function goToBannerSlide(index) {
    currentBannerIndex = index;
    updateBannerSlide();
}

function updateBannerSlide() {
    // QSA Get all banner slides
    const slides = document.querySelectorAll('#banner-container > div');
    const indicators = document.querySelectorAll('#banner-indicators > button');
    
    slides.forEach((slide, index) => {
        // visibility
        if (index === currentBannerIndex) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        }
    });
    
    indicators.forEach((indicator, index) => {
        if (index === currentBannerIndex) {
            indicator.classList.remove('bg-opacity-50');
        } else {
            indicator.classList.add('bg-opacity-50');
        }
    });// Setup navigation buttons
    document.getElementById('prev-banner').addEventListener('click', prevBanner);
    document.getElementById('next-banner').addEventListener('click', nextBanner);
}

// PRODUCTS
function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(products);
        populateCategories();
        hideLoadingSpinner();
        })
        
}
function displayProducts(productsToDisplay) {
// Get products container
    const productsGrid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    productsGrid.innerHTML = '';
        if (productsToDisplay.length === 0) {
            noProducts.classList.remove('hidden');
            return;
    }   else {
        noProducts.classList.add('hidden');
    }
 //Create product cards
    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}
function createProductCard(product) {
    //Create product card
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300';
    
    const stars = generateStars(product.rating.rate);
    //Set card content
    card.innerHTML = `
        <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain p-4">
        </div>
        <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">${product.title}</h3>
            <div class="flex items-center mb-2">
                ${stars}
                <span class="text-sm text-gray-600 ml-2">(${product.rating.count})</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-blue-600">${(product.price * 120).toFixed(0)} BDT</span>
            </div>
            <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold add-to-cart-btn" data-product-id="${product.id}">
                <i class="fas fa-cart-plus mr-2"></i>Add to Cart
            </button>
        </div>
    `;
//Add click event to button
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(product));
    
    return card;
}
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-yellow-400"></i>';
    }
    return stars;
}

function populateCategories() {
//category filter dropdown
    const categoryFilter = document.getElementById('category-filter');
    const categories = [...new Set(products.map(p => p.category))];
//Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}
// CART 
function addToCart(product) {
    const productPrice = product.price * 120;
    const totalCost = calculateTotalWithCharges();
    const newTotal = totalCost + productPrice;
    if (newTotal > userBalance) {
        showNotification(`Insufficient balance! Please add money to your account.`, 'error');
        return;
    }
// Check product already in cart
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: productPrice,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.title} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removed from cart', 'info');
}

function updateCart() {
    updateCartCount();
    updateCartSidebar();
    updateCartCalculations();
}

function updateCartCount() {
    //  Update cart 
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartSidebar() {
    //Get cart items container
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-600 text-center py-8">Your cart is empty</p>';
        return;
    }
    
    //Clear cart items
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        // Create cart item 
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center space-x-4 border-b pb-4';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain">
            <div class="flex-1">
                <h4 class="font-semibold text-sm">${item.title.substring(0, 40)}...</h4>
                <p class="text-sm text-gray-600">${item.price.toFixed(0)} BDT x ${item.quantity}</p>
            </div>
            <button class="text-red-600 hover:text-red-800" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add remove button
        const removeBtn = cartItem.querySelector('button');
        removeBtn.addEventListener('click', () => removeFromCart(item.id));
        
        cartItems.appendChild(cartItem);
    });
}

function updateCartCalculations() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = calculateTotalWithCharges();
    
    //  Update price
    document.getElementById('cart-subtotal').textContent = `${subtotal.toFixed(0)} BDT`;
    document.getElementById('cart-delivery').textContent = `${DELIVERY_CHARGE} BDT`;
    document.getElementById('cart-shipping').textContent = `${SHIPPING_COST} BDT`;
    document.getElementById('cart-discount').textContent = `${appliedDiscount.toFixed(0)} BDT`;
    document.getElementById('cart-total').textContent = `${total.toFixed(0)} BDT`;
}

function calculateTotalWithCharges() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal === 0) return 0;
    return subtotal + DELIVERY_CHARGE + SHIPPING_COST - appliedDiscount;
}

function applyCoupon() {
    // Get coupon
    const couponInput = document.getElementById('coupon-input');
    const couponMessage = document.getElementById('coupon-message');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (cart.length === 0) {
        couponMessage.innerHTML = '<p class="text-red-600">Cart is empty!</p>';
        return;
    }
    
    if (couponCode === DISCOUNT_COUPON && !couponApplied) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        appliedDiscount = subtotal * (DISCOUNT_PERCENTAGE / 100);
        couponApplied = true;
        couponMessage.innerHTML = '<p class="text-green-600"><i class="fas fa-check-circle"></i> Coupon applied! You saved ' + appliedDiscount.toFixed(0) + ' BDT</p>';
        updateCartCalculations();
        showNotification('Coupon applied successfully!', 'success');
    } else if (couponApplied) {
        couponMessage.innerHTML = '<p class="text-yellow-600">Coupon already applied!</p>';
    } else {
        couponMessage.innerHTML = '<p class="text-red-600">Invalid coupon code!</p>';
    }
}
// BALANCE SYSTEM
function loadBalance() {
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    const balanceElement = document.getElementById('user-balance');
    balanceElement.textContent = `${userBalance.toFixed(0)} BDT`;
}
function addMoney() {
    userBalance += 1000;
    updateBalanceDisplay();
    showNotification('1000 BDT added to your balance!', 'success');
}
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
const total = calculateTotalWithCharges();
    if (total > userBalance) {
        showNotification('Insufficient balance! Please add money to continue.', 'error');
        return;
    }
    userBalance -= total;
    updateBalanceDisplay();
// Clear cart
    cart = [];
    appliedDiscount = 0;
    couponApplied = false;
    updateCart();
//Close cart sidebar
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('translate-x-full');
    
    showNotification('Order placed successfully! Thank you for shopping with us.', 'success');
}
// REVIEW SLIDER
function initializeReviews() {
    const reviewsSlider = document.getElementById('reviews-slider');
//Create review cards
    reviewsData.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'min-w-full md:min-w-[50%] lg:min-w-[33.333%] px-4';
    const stars = generateStars(review.rating);
reviewCard.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg h-full">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        ${review.name.charAt(0)}
                    </div>
                    <div class="ml-4">
                        <h4 class="font-semibold text-gray-800">${review.name}</h4>
                        <p class="text-sm text-gray-600">${review.date}</p>
                    </div>
                </div>
                <div class="mb-3">
                    ${stars}
                </div>
                <p class="text-gray-700">${review.comment}</p>
            </div>`;
reviewsSlider.appendChild(reviewCard);
    });
//review navigation
    document.getElementById('prev-review').addEventListener('click', prevReview);
    document.getElementById('next-review').addEventListener('click', nextReview);
    setInterval(nextReview, 3000);
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % reviewsData.length;
    updateReviewSlide();
}

function prevReview() {
    currentReviewIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
    updateReviewSlide();
}

function updateReviewSlide() {
    //Update slider position
    const reviewsSlider = document.getElementById('reviews-slider');
    const slideWidth = 100 / window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const offset = -(currentReviewIndex * (100 / (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3)));
    reviewsSlider.style.transform = `translateX(${offset}%)`;
}
//SEARCH & FILTER
function setupSearchAndFilter() {
    // DOM API: getElementById() & addEventListener()
    const searchInput = document.getElementById('search-input');
    
    const sortFilter = document.getElementById('sort-filter');
    
    searchInput.addEventListener('input', filterProducts);
    
    sortFilter.addEventListener('change', filterProducts);
}

function filterProducts() {
    // DOM API: getElementById() - Get filter values
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    const sortBy = document.getElementById('sort-filter').value;
    
    let filtered = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);
       
        return matchesSearch ;
    });
    
    // Sort products
    if (sortBy === 'price-low') 
        { filtered.sort((a, b) => (a.price * 120) - (b.price * 120)); } 
    else if (sortBy === 'price-high')
        { filtered.sort((a, b) => (b.price * 120) - (a.price * 120)); }
    displayProducts(filtered);
}
//EVENT
function setupEventListeners() {
// Cart sidebar toggle
    document.getElementById('cart-btn').addEventListener('click', () => {
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.toggle('translate-x-full');
    });
    
    document.getElementById('close-cart-btn').addEventListener('click', () => {
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.add('translate-x-full');
    });
// Add money button
    document.getElementById('add-money-btn').addEventListener('click', addMoney);
// Apply coupon
    document.getElementById('apply-coupon-btn').addEventListener('click', applyCoupon);
// Checkout
    document.getElementById('checkout-btn').addEventListener('click', checkout);
 }

//NAVIGATION
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
//scroll
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
// Update active link
            navLinks.forEach(l => l.classList.remove('text-blue-600', 'font-bold'));
            this.classList.add('text-blue-600', 'font-bold');
        });
    });
}
//NOTIFICATION
function showNotification(message, type = 'info') {
    //Get notification elements
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
//Set message
    toastMessage.textContent = message;
//icon and color
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle text-green-600 text-2xl mr-3';
        toast.className = toast.className.replace('border-blue-600', 'border-green-600');
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle text-red-600 text-2xl mr-3';
        toast.className = toast.className.replace('border-blue-600', 'border-red-600');
    } else {
        toastIcon.className = 'fas fa-info-circle text-blue-600 text-2xl mr-3';
    }
//Show notification
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}