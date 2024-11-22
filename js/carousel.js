document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let initialX = 0;
    let moveX = 0;
    let autoAdvance = null;
    let lastAutoAdvanceTime = Date.now();

    // Create certificate modal
    const modal = document.createElement('div');
    modal.classList.add('certificate-modal');
    modal.innerHTML = `
        <div class="certificate-modal-content">
            <span class="certificate-modal-close">&times;</span>
            <img src="" alt="Certificate" class="certificate-modal-image">
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = modal.querySelector('.certificate-modal-image');
    const closeButton = modal.querySelector('.certificate-modal-close');

    // Add click event to close modal
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
        resumeAutoAdvance(); // Resume slideshow when modal is closed
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            resumeAutoAdvance(); // Resume slideshow when modal is closed
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            resumeAutoAdvance(); // Resume slideshow when modal is closed
        }
    });

    // Add click events to certificate images
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragging && Math.abs(moveX) < 5) {
                    modalImage.src = this.src;
                    modal.classList.add('show');
                    pauseAutoAdvance();
                }
            });
        }
    });

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Update dots
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateSlidePosition();
        updateDots();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlidePosition();
        updateDots();
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlidePosition();
        updateDots();
        lastAutoAdvanceTime = Date.now();
    }

    // Update slide position
    function updateSlidePosition() {
        const slideWidth = slides[0].offsetWidth;
        currentTranslate = -currentSlide * slideWidth;
        prevTranslate = currentTranslate;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        initialX = startPos;
        carousel.style.cursor = 'grabbing';
        carousel.style.transition = 'none';
        pauseAutoAdvance();
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        moveX = currentPosition - initialX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        isDragging = false;
        carousel.style.cursor = 'grab';
        carousel.style.transition = 'transform 0.5s ease-in-out';

        if (Math.abs(moveX) < 5) {
            return; // Allow click if barely moved
        }

        const slideWidth = slides[0].offsetWidth;
        const movedBy = currentTranslate - prevTranslate;

        if (Math.abs(movedBy) > slideWidth / 3) {
            if (movedBy > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            goToSlide(currentSlide);
        }
        resumeAutoAdvance();
    }

    function pauseAutoAdvance() {
        clearInterval(autoAdvance);
        autoAdvance = null;
        lastAutoAdvanceTime = Date.now();
    }

    function resumeAutoAdvance() {
        if (!modal.classList.contains('show')) {
            clearInterval(autoAdvance);
            // Start a new interval from the current position
            autoAdvance = setInterval(nextSlide, 5000);
            // Reset the last advance time to now
            lastAutoAdvanceTime = Date.now();
        }
    }

    // Event listeners for buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Touch events for mobile
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('touchmove', touchMove);
    carousel.addEventListener('touchend', touchEnd);

    // Mouse events for desktop
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);

    // Handle window resize
    window.addEventListener('resize', () => {
        updateSlidePosition();
    });

    // Initialize
    updateSlidePosition();
    resumeAutoAdvance();
});
