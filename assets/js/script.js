// MR Cobblers - Custom JavaScript
// Interactive Features & Animations
// ==========================================

// ==========================================
// Initialize AOS (Animate On Scroll)
// ==========================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ==========================================
// Navbar Scroll Effect
// ==========================================
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// Smooth Scrolling for Navigation Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// ==========================================
// Active Navigation Link on Scroll
// ==========================================
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// Counter Animation for Statistics
// ==========================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + (element.getAttribute('data-target') == '98' ? '%' : '+');
        }
    };

    updateCounter();
}

// Trigger counter animation when stats section is in view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });
        }
    });
}, observerOptions);

// Observe stats section
const statsSection = document.querySelector('.why-choose-section');
if (statsSection) {
    observer.observe(statsSection);
}

// ==========================================
// Scroll to Top Button
// ==========================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// Contact Form Submission
// ==========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycby5cwseS2CGO6tYg-1eSEJEibN54WZv-hdlwDmc9gRH3udu6PNqxfBRfNW48p2DOdE/exec';

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';
    submitBtn.disabled = true;

    // Get form data
    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());

    // 1. Submit to Google Sheets (Backend)
    const requestBody = new URLSearchParams(formData);

    fetch(scriptURL, { method: 'POST', body: requestBody })
        .then(response => {
            console.log('Success!', response);

            // 2. Prepare WhatsApp Message
            const phoneNumber = "918801091101";
            const text = `Hello *Mr Cobblers*,%0a%0aI would like to book a service via your website: https://mrcobblers.com/%0a%0aReference No: ${Date.now().toString().slice(-4)}%0a---------------------------%0a*Name*: ${formObject.name}%0a*Service*: ${formObject.service}%0a*Phone*: ${formObject.phone}%0a*Address*: ${formObject.address}%0a*Note*: ${formObject.message}%0a---------------------------%0aPlease confirm my booking.`;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;

            // Show success and redirect
            alert('🎉 Booking Submitted Successfully!\n\nWe have sent you a confirmation email.\nClick OK to open WhatsApp and send your order details.');

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');

            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Something went wrong. Please try again or call us directly.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
});

// ==========================================
// Prevent form fields from being auto-filled 
// with previous scroll position colors
// ==========================================
window.addEventListener('load', function () {
    // Force repaint to ensure proper styling
    setTimeout(() => {
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = 'block';
    }, 0);
});

// ==========================================
// Add hover effect to service cards
// ==========================================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s ease';
    });
});

// ==========================================
// Add parallax effect to hero section
// ==========================================
window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==========================================
// Typing effect for hero title (optional)
// ==========================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment the following lines to enable typing effect
// window.addEventListener('load', function() {
//     const heroTitle = document.querySelector('.text-gradient');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         typeWriter(heroTitle, originalText, 100);
//     }
// });

// ==========================================
// Add ripple effect to buttons
// ==========================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);
}

// Add ripple effect to all buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// ==========================================
// Add CSS for ripple effect dynamically
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
            display: none;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Lazy loading images (if any are added later)
// ==========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// Console Message
// ==========================================
console.log('%c🎉 Welcome to MR Cobblers! 👞', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cTrusted Shoe Repair at your doorStep', 'color: #94a3b8; font-size: 14px;');
