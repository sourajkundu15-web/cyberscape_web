/* =====================================================
   CyberScape v8 - JavaScript
   Navigation, Star Rating, Animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initSmoothScroll();
    initStarRating();
    initFeedbackForm();
    initScrollAnimations();
    initNavbarScroll();
});

/* =====================================================
   Navigation
   ===================================================== */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* =====================================================
   Smooth Scroll
   ===================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   Navbar Scroll Effect
   ===================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* =====================================================
   Star Rating System
   ===================================================== */
function initStarRating() {
    const starRating = document.getElementById('star-rating');
    const stars = starRating.querySelectorAll('.star');
    const ratingText = document.getElementById('rating-text');
    let currentRating = 0;

    const ratingMessages = {
        0: 'Select a rating',
        1: 'Poor - Needs improvement',
        2: 'Fair - Could be better',
        3: 'Good - Nice exhibition!',
        4: 'Great - Really impressed!',
        5: 'Excellent - Outstanding work!'
    };

    // Hover effect
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });

        star.addEventListener('mouseleave', () => {
            highlightStars(currentRating);
        });

        star.addEventListener('click', () => {
            currentRating = index + 1;
            highlightStars(currentRating);
            updateRatingText(currentRating);
            
            // Add a subtle animation
            star.style.transform = 'scale(1.3)';
            setTimeout(() => {
                star.style.transform = 'scale(1.1)';
            }, 150);
        });
    });

    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function updateRatingText(rating) {
        ratingText.textContent = ratingMessages[rating];
        ratingText.style.color = rating >= 4 ? '#00f0ff' : rating >= 2 ? '#fbbf24' : '#ef4444';
    }

    // Expose current rating for form submission
    window.getCurrentRating = () => currentRating;
}

/* =====================================================
   Feedback Form
   ===================================================== */
function initFeedbackForm() {
    const submitBtn = document.getElementById('submit-feedback');
    const feedbackInput = document.getElementById('feedback-input');

    submitBtn.addEventListener('click', () => {
        const rating = window.getCurrentRating();
        const feedback = feedbackInput.value.trim();

        if (rating === 0) {
            showNotification('Please select a star rating', 'warning');
            return;
        }

        if (feedback === '') {
            showNotification('Please enter your feedback', 'warning');
            return;
        }

        // Show success message (in a real app, this would send data to a server)
        showNotification('Thank you for your feedback!', 'success');
        
        // Reset form
        feedbackInput.value = '';
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        document.getElementById('rating-text').textContent = 'Select a rating';
        document.getElementById('rating-text').style.color = '';
        
        console.log('Feedback submitted:', { rating, feedback });
    });
}

/* =====================================================
   Notification System
   ===================================================== */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(245, 158, 11, 0.95)'};
        color: #fff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

/* =====================================================
   Scroll Animations
   ===================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.section-title, .section-subtitle, .about-text, .about-stats, .project-card, .feedback-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Special handling for project cards - they have staggered animation
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}
