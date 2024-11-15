// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll Progress Bar
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// Dark Mode Toggle
const createDarkModeToggle = () => {
    const toggle = document.createElement('button');
    toggle.innerHTML = '🌓';
    toggle.className = 'dark-mode-toggle';
    toggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px;
        border-radius: 50%;
        border: none;
        background: var(--light-bg);
        color: var(--text-color);
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(toggle);
    
    toggle.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
    });
};

createDarkModeToggle();

// Loading Animation
const createLoadingAnimation = () => {
    const loading = document.createElement('div');
    loading.className = 'loading-animation';
    document.body.appendChild(loading);
    
    window.addEventListener('load', () => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.remove();
        }, 500);
    });
};

createLoadingAnimation();

// Image Lazy Loading
const lazyLoadImages = () => {
    const images = document.querySelectorAll('.gallery-item img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.dataset.src = img.src;
        img.src = '';
        imageObserver.observe(img);
    });
};

lazyLoadImages();

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData);
    
    try {
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formObject);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        successMessage.style.cssText = `
            background-color: var(--secondary-color);
            color: white;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            text-align: center;
        `;
        
        contactForm.appendChild(successMessage);
        contactForm.reset();
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading animation to gallery images
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Impact Counter Animation
const animateCounter = (counter, target) => {
    const count = +counter.innerText;
    const increment = target / 200; // Adjust speed here

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter, target), 1);
    } else {
        counter.innerText = target;
    }
};

const startCountAnimation = () => {
    const counters = document.querySelectorAll('.count');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.dataset.target;
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
};

startCountAnimation();

// Lightbox Functionality
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentImageIndex = 0;
let galleryImages = [];

// Initialize gallery images
const initGallery = () => {
    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            showLightbox(img.src);
        });
    });
};

const showLightbox = (src) => {
    lightbox.classList.add('active');
    lightboxImage.src = src;
    document.body.style.overflow = 'hidden';
};

const hideLightbox = () => {
    lightbox.classList.remove('active');
    lightboxImage.src = '';
    document.body.style.overflow = '';
};

const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
};

const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
};

// Lightbox event listeners
lightboxClose.addEventListener('click', hideLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

initGallery();

// Social Media Feed
const createSocialPost = (post) => {
    return `
        <div class="social-item">
            <img src="${post.image}" alt="${post.description}">
            <div class="social-item-overlay">
                <p>${post.description}</p>
                <span class="social-date">${post.date}</span>
            </div>
        </div>
    `;
};

// Example social media posts (replace with actual API data)
const socialPosts = [
    {
        image: 'images/social1.jpg',
        description: 'Leading a tree planting initiative with local volunteers! 🌱 #Environmental',
        date: '2 days ago'
    },
    {
        image: 'images/social2.jpg',
        description: 'Workshop on sustainable living practices 🌍 #Sustainability',
        date: '4 days ago'
    },
    {
        image: 'images/social3.jpg',
        description: 'Beach cleanup campaign success! 🌊 #CleanOceans',
        date: '1 week ago'
    }
];

const loadSocialFeed = () => {
    const socialGrid = document.querySelector('.social-grid');
    socialGrid.innerHTML = socialPosts.map(post => createSocialPost(post)).join('');
};

loadSocialFeed();

// Blog Post Hover Effect
document.querySelectorAll('.blog-post').forEach(post => {
    post.addEventListener('mouseenter', () => {
        post.style.transform = 'translateY(-10px)';
    });
    
    post.addEventListener('mouseleave', () => {
        post.style.transform = 'translateY(0)';
    });
});
