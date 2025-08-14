// Landing Page JavaScript Functions

// Load external HTML files
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initCountdown();
    initForms();
    initScrollAnimations();
});

// Load Header
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.log('Error loading header:', error));
}

// Load Footer
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.log('Error loading footer:', error));
}

// Smooth scroll functions
function scrollToOrder() {
    document.getElementById('order').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Track conversion event (for analytics)
    trackEvent('scroll_to_order', 'engagement', 'cta_click');
}

function scrollToConsult() {
    document.getElementById('consultation').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Track conversion event
    trackEvent('scroll_to_consultation', 'engagement', 'cta_click');
}

// Countdown Timer
function initCountdown() {
    // Set countdown end time (24 hours from now for demo)
    const countdownEnd = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownEnd - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            // Reset countdown or show expired message
            document.getElementById('countdown').innerHTML = '<div class="countdown-expired">Ưu đãi đã kết thúc!</div>';
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update countdown display
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        
    }, 1000);
}

// FAQ Toggle Function
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.faq-question i').forEach(item => {
        if (item !== icon) {
            item.className = 'fas fa-plus';
        }
    });
    
    // Toggle current FAQ item
    answer.classList.toggle('active');
    icon.className = answer.classList.contains('active') ? 'fas fa-minus' : 'fas fa-plus';
}

// Form Initialization
function initForms() {
    // Order Form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // Consultation Form  
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleConsultationSubmit);
    }
    
    // Quantity change handler
    const quantitySelect = document.getElementById('quantity');
    if (quantitySelect) {
        quantitySelect.addEventListener('change', updatePrice);
    }
}

// Handle Order Form Submission
function handleOrderSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        quantity: formData.get('quantity'),
        payment: formData.get('payment'),
        note: formData.get('note') || '',
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Đang xử lý...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Send to Google Sheets
    sendToGoogleSheets(orderData, submitButton, originalText, event.target);
    
    // Log order data (for debugging)
    console.log('Order submitted:', orderData);
}

// Handle Consultation Form Submission
function handleConsultationSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const consultData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        note: formData.get('note') || 'Yêu cầu tư vấn',
        address: 'Không yêu cầu',
        quantity: '',
        payment: '',
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Đang gửi yêu cầu...';
    submitButton.disabled = true;
    
    // Send to Google Sheets
    sendToGoogleSheets(consultData, submitButton, originalText, event.target);
    
    // Log consultation data (for debugging)
    console.log('Consultation request:', consultData);
}

// Update Price Based on Quantity
function updatePrice() {
    const quantity = document.getElementById('quantity').value;
    const priceInfo = document.querySelector('.price-info');
    
    const prices = {
        '1': { original: '1.000.000đ', sale: '499.000đ', savings: '501.000đ' },
        '2': { original: '2.000.000đ', sale: '899.000đ', savings: '1.101.000đ' },
        '3': { original: '3.000.000đ', sale: '1.199.000đ', savings: '1.801.000đ' }
    };
    
    if (prices[quantity]) {
        const originalPriceElement = priceInfo.querySelector('.original-price');
        const salePriceElement = priceInfo.querySelector('.sale-price');
        const savingsElement = priceInfo.querySelector('.savings');
        
        originalPriceElement.textContent = `Giá gốc: ${prices[quantity].original}`;
        salePriceElement.textContent = prices[quantity].sale;
        savingsElement.textContent = `🎉 Tiết kiệm ngay ${prices[quantity].savings}`;
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Analytics Tracking Function
function trackEvent(eventName, category, action, value = null) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category,
            event_label: action,
            value: value
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        if (eventName === 'purchase') {
            fbq('track', 'Purchase', {
                value: value * 499000, // Assuming base price
                currency: 'VND'
            });
        } else if (eventName === 'generate_lead') {
            fbq('track', 'Lead');
        } else {
            fbq('track', 'ViewContent');
        }
    }
    
    // Console log for debugging
    console.log('Event tracked:', eventName, category, action, value);
}

// Mobile Menu Toggle (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function validatePhone(phone) {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Lazy loading for images (modern browsers)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth scrolling for all anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Page visibility API for pausing/resuming animations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// ===========================================
// DATA HANDLING FUNCTIONS
// ===========================================

// Option 1: EmailJS - Send form data via email (FREE)
// Setup: Register at emailjs.com and get your service ID, template ID, and public key
function sendOrderEmail(orderData, submitButton, originalText, form) {
    // Add EmailJS CDN to your HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded. Please add EmailJS CDN to your HTML.');
        fallbackFormSubmission(orderData, submitButton, originalText, form);
        return;
    }
    
    const templateParams = {
        customer_name: orderData.name,
        customer_phone: orderData.phone,
        customer_address: orderData.address,
        quantity: orderData.quantity,
        payment_method: orderData.payment,
        customer_note: orderData.note || 'Không có ghi chú',
        order_time: new Date(orderData.timestamp).toLocaleString('vi-VN'),
        total_price: calculateTotalPrice(orderData.quantity)
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
        .then(function(response) {
            console.log('Order email sent successfully:', response);
            showSuccessMessage('✅ Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 15 phút để xác nhận đơn hàng.');
            trackEvent('purchase', 'conversion', 'order_completed', parseInt(orderData.quantity));
            resetForm(form, submitButton, originalText);
        })
        .catch(function(error) {
            console.error('Failed to send order email:', error);
            showErrorMessage('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại hoặc liên hệ hotline.');
            resetButton(submitButton, originalText);
        });
}

function sendConsultationEmail(consultData, submitButton, originalText, form) {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded.');
        fallbackConsultationSubmission(consultData, submitButton, originalText, form);
        return;
    }
    
    const templateParams = {
        customer_name: consultData.name,
        customer_phone: consultData.phone,
        customer_note: consultData.note || 'Không có ghi chú',
        request_time: new Date(consultData.timestamp).toLocaleString('vi-VN')
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_CONSULTATION_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
        .then(function(response) {
            console.log('Consultation email sent successfully:', response);
            showSuccessMessage('✅ Yêu cầu tư vấn đã được gửi! Chuyên gia sẽ liên hệ với bạn trong vòng 30 phút.');
            trackEvent('generate_lead', 'conversion', 'consultation_request');
            resetForm(form, submitButton, originalText);
        })
        .catch(function(error) {
            console.error('Failed to send consultation email:', error);
            showErrorMessage('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
            resetButton(submitButton, originalText);
        });
}

// Option 2: Send to Backend API
function sendToBackend(orderData, submitButton, originalText, form) {
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Order sent to backend successfully:', data);
        showSuccessMessage('✅ Đặt hàng thành công! Mã đơn hàng: ' + data.orderId);
        trackEvent('purchase', 'conversion', 'order_completed', parseInt(orderData.quantity));
        resetForm(form, submitButton, originalText);
    })
    .catch(error => {
        console.error('Failed to send order to backend:', error);
        showErrorMessage('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại.');
        resetButton(submitButton, originalText);
    });
}

function sendConsultationToBackend(consultData, submitButton, originalText, form) {
    fetch('/api/consultations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Consultation sent successfully:', data);
        showSuccessMessage('✅ Yêu cầu tư vấn đã được gửi! ID: ' + data.consultationId);
        trackEvent('generate_lead', 'conversion', 'consultation_request');
        resetForm(form, submitButton, originalText);
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        resetButton(submitButton, originalText);
    });
}

// Option 3: Send to Google Sheets (using Google Apps Script)
function sendToGoogleSheets(orderData, submitButton, originalText, form) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyras5xU9iTyIotyfY_B5lP8WYB3eK5GV4TueMH-QoLr_C_P2sbS1i-zZf1us-tRBKPuQ/exec';
    
    console.log('Sending data to Google Sheets:', orderData);
    
    // Prepare data for Google Sheets
    const dataToSend = {
        name: orderData.name || '',
        phone: orderData.phone || '',
        address: orderData.address || 'Không yêu cầu',
        quantity: orderData.quantity || 'Tư vấn',
        payment: orderData.payment || 'Không áp dụng',
        note: orderData.note || '',
        formType: orderData.quantity ? 'Đặt hàng' : 'Tư vấn',
        timestamp: orderData.timestamp || new Date().toISOString()
    };
    
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(() => {
        console.log('Data sent to Google Sheets successfully');
        
        // Show success message based on form type
        const successMessage = orderData.quantity ? 
            '✅ Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 15 phút để xác nhận đơn hàng.' :
            '✅ Yêu cầu tư vấn đã được gửi! Chuyên gia sẽ liên hệ với bạn trong vòng 30 phút.';
        
        showSuccessMessage(successMessage);
        
        // Track event based on form type
        if (orderData.quantity) {
            trackEvent('purchase', 'conversion', 'order_completed', parseInt(orderData.quantity));
        } else {
            trackEvent('generate_lead', 'conversion', 'consultation_request');
        }
        
        resetForm(form, submitButton, originalText);
    })
    .catch(error => {
        console.error('Error sending to Google Sheets:', error);
        showErrorMessage('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hotline: 0123-456-789');
        resetButton(submitButton, originalText);
    });
}

// ===========================================
// UTILITY FUNCTIONS FOR FORM HANDLING
// ===========================================

function calculateTotalPrice(quantity) {
    const prices = {
        '1': '499.000đ',
        '2': '899.000đ', 
        '3': '1.199.000đ'
    };
    return prices[quantity] || '499.000đ';
}

function showSuccessMessage(message) {
    // Create custom success modal
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">✅</div>
            <div class="success-message">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="modal-close">Đóng</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (modal.parentElement) modal.remove();
    }, 5000);
}

function showErrorMessage(message) {
    // Create custom error modal
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="error-icon">❌</div>
            <div class="error-message">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="modal-close">Đóng</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (modal.parentElement) modal.remove();
    }, 5000);
}

function resetForm(form, submitButton, originalText) {
    form.reset();
    resetButton(submitButton, originalText);
}

function resetButton(submitButton, originalText) {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
}
// ...existing code...

// ===========================================
// BLINKING EFFECTS CONTROL
// ===========================================

// Add blinking effects based on context
function initBlinkingEffects() {
    // Add urgent blinking to order buttons
    const orderButtons = document.querySelectorAll('.order-section .btn-primary');
    orderButtons.forEach(btn => {
        btn.classList.add('btn-urgent');
    });
    
    // Add rainbow effect to header buttons
    const headerButtons = document.querySelectorAll('.header .btn-primary');
    headerButtons.forEach(btn => {
        btn.classList.add('rainbow');
    });
    
    // Add flash effect to countdown buttons
    const countdownButtons = document.querySelectorAll('.urgency-section .btn-primary');
    countdownButtons.forEach(btn => {
        btn.classList.add('flash');
    });
    
    // Add gentle blink to consultation buttons
    const consultButtons = document.querySelectorAll('.consultation-section .btn-primary');
    consultButtons.forEach(btn => {
        btn.classList.add('gentle-blink');
    });
}

// Dynamic blinking based on time/urgency
function initUrgencyBlinking() {
    const orderButtons = document.querySelectorAll('.btn-primary');
    
    // Increase blinking speed as countdown gets lower
    function updateBlinkingSpeed() {
        const countdownElement = document.querySelector('.countdown-number');
        if (countdownElement) {
            const timeLeft = parseInt(countdownElement.textContent);
            
            orderButtons.forEach(btn => {
                if (timeLeft < 10) {
                    btn.style.animationDuration = '0.3s';
                    btn.classList.add('maximum-attention');
                } else if (timeLeft < 30) {
                    btn.style.animationDuration = '0.6s';
                    btn.classList.add('btn-urgent');
                } else {
                    btn.style.animationDuration = '2s';
                    btn.classList.add('blink-smooth');
                }
            });
        }
    }
    
    // Update every second
    setInterval(updateBlinkingSpeed, 1000);
}

// Control blinking on scroll
function initScrollBlinking() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const buttons = entry.target.querySelectorAll('.btn-primary, .btn-secondary');
            
            if (entry.isIntersecting) {
                // Start blinking when section is visible
                buttons.forEach(btn => {
                    btn.style.animationPlayState = 'running';
                });
            } else {
                // Pause blinking when section is not visible
                buttons.forEach(btn => {
                    btn.style.animationPlayState = 'paused';
                });
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Add blinking to important elements
function addContextualBlinking() {
    // Price elements
    const priceElements = document.querySelectorAll('.sale-price');
    priceElements.forEach(price => {
        price.classList.add('blink-glow');
    });
    
    // Savings text
    const savingsElements = document.querySelectorAll('.savings');
    savingsElements.forEach(saving => {
        saving.classList.add('blink-smooth');
    });
    
    // Urgent text
    const urgentTexts = document.querySelectorAll('.urgency-section h2, .urgency-section h3');
    urgentTexts.forEach(text => {
        text.classList.add('urgent-text');
    });
    
    // Trust badges
    const badges = document.querySelectorAll('.trust-badges .badge i');
    badges.forEach(badge => {
        badge.classList.add('blink-glow');
    });
}

// Button interaction effects
function initButtonInteractions() {
    const allButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-zalo');
    
    allButtons.forEach(button => {
        // Stop blinking on hover
        button.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        // Resume blinking on mouse leave
        button.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Flash effect on click
        button.addEventListener('click', function() {
            this.classList.add('flash');
            
            setTimeout(() => {
                this.classList.remove('flash');
            }, 2000);
        });
    });
}

// Dynamic blinking patterns
function initDynamicBlinking() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    // Randomly change blinking patterns
    setInterval(() => {
        buttons.forEach(button => {
            const patterns = ['blink-smooth', 'blink-glow', 'blink-scale', 'subtle-attention'];
            const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
            
            // Remove old patterns
            patterns.forEach(pattern => button.classList.remove(pattern));
            
            // Add new pattern
            button.classList.add(randomPattern);
        });
    }, 10000); // Change every 10 seconds
}

// Special effects for different times of day
function initTimeBasedBlinking() {
    const hour = new Date().getHours();
    const allButtons = document.querySelectorAll('.btn-primary');
    
    if (hour >= 18 || hour <= 6) {
        // Evening/Night - more urgent blinking
        allButtons.forEach(btn => {
            btn.classList.add('urgent-blink');
        });
    } else if (hour >= 12 && hour <= 14) {
        // Lunch time - gentle blinking
        allButtons.forEach(btn => {
            btn.classList.add('gentle-blink');
        });
    } else {
        // Normal hours - standard blinking
        allButtons.forEach(btn => {
            btn.classList.add('blink-smooth');
        });
    }
}

// Initialize all blinking effects
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize blinking effects
    initBlinkingEffects();
    initUrgencyBlinking();
    initScrollBlinking();
    addContextualBlinking();
    initButtonInteractions();
    initTimeBasedBlinking();
    
    // Delay dynamic blinking to avoid overwhelming users
    setTimeout(initDynamicBlinking, 5000);
});

// Performance monitoring for animations
function monitorBlinkingPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function countFrames() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // If FPS is too low, reduce blinking effects
            if (fps < 30) {
                document.body.classList.add('low-performance');
                
                // Simplify animations
                const complexButtons = document.querySelectorAll('.maximum-attention, .rainbow');
                complexButtons.forEach(btn => {
                    btn.className = btn.className.replace(/maximum-attention|rainbow/g, 'blink-smooth');
                });
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    requestAnimationFrame(countFrames);
}

// Start performance monitoring
monitorBlinkingPerformance();

