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
    let isPaused = false;
    let autoAdvanceInterval = 5000; // 5 seconds
    let lastAutoAdvanceTime = Date.now();
    let autoAdvanceTimer = null;
    let animationFrame = null;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;

    // Create certificate modal
    const modal = document.createElement('div');
    modal.classList.add('certificate-modal');
    modal.innerHTML = `
        <div class="certificate-modal-content">
            <span class="certificate-modal-close">&times;</span>
            <img src="" alt="Certificate" class="certificate-modal-image">
            <div class="certificate-modal-description">
                <h3></h3>
                <p></p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = modal.querySelector('.certificate-modal-image');
    const modalTitle = modal.querySelector('.certificate-modal-description h3');
    const modalDesc = modal.querySelector('.certificate-modal-description p');
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
        const description = slide.querySelector('.certificate-description');
        if (img && description) {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragging && Math.abs(moveX) < 5) {
                    modalImage.src = this.src;
                    modalTitle.textContent = description.querySelector('h3').textContent;
                    modalDesc.textContent = description.querySelector('p').textContent;
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
        lastX = startPos;
        lastTime = Date.now();
        velocity = 0;
        
        carousel.style.cursor = 'grabbing';
        carousel.style.transition = 'none';
        
        cancelAnimationFrame(animationFrame);
        pauseAutoAdvance();

        // Show touch feedback
        const currentSlideElement = slides[currentSlide];
        currentSlideElement.style.transform = 'scale(0.98)';
    }

    function touchMove(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTime;
        
        moveX = currentPosition - initialX;
        const diff = currentPosition - startPos;
        
        // Calculate velocity
        if (timeDiff > 0) {
            velocity = (currentPosition - lastX) / timeDiff;
        }
        
        currentTranslate = prevTranslate + diff;
        
        // Add resistance at the edges
        if (currentSlide === 0 && diff > 0 || 
            currentSlide === slides.length - 1 && diff < 0) {
            currentTranslate = prevTranslate + (diff * 0.3);
        }
        
        carousel.style.transform = `translateX(${currentTranslate}px)`;
        
        lastX = currentPosition;
        lastTime = currentTime;
    }

    function touchEnd() {
        isDragging = false;
        const currentTime = Date.now();
        
        // Reset touch feedback
        slides[currentSlide].style.transform = '';
        
        carousel.style.cursor = 'grab';
        carousel.style.transition = 'transform 0.5s ease-in-out';

        if (Math.abs(moveX) < 5) {
            return; // Allow click if barely moved
        }

        const slideWidth = slides[0].offsetWidth;
        const movedBy = currentTranslate - prevTranslate;
        
        // Use velocity to determine if we should move to next/prev slide
        const velocityThreshold = 0.5;
        if (Math.abs(velocity) > velocityThreshold) {
            if (velocity > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else if (Math.abs(movedBy) > slideWidth / 3) {
            if (movedBy > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            goToSlide(currentSlide);
        }
        
        velocity = 0;
        resumeAutoAdvance();
    }

    function autoAdvance() {
        if (!isPaused) {
            const currentTime = Date.now();
            if (currentTime - lastAutoAdvanceTime >= autoAdvanceInterval) {
                if (currentSlide === slides.length - 1) {
                    // Smooth transition from last to first
                    carousel.style.transition = 'none';
                    currentSlide = -1;
                    const offset = -currentSlide * 100;
                    carousel.style.transform = `translateX(${offset}%)`;
                    
                    // Force a reflow
                    carousel.offsetHeight;
                    
                    // Move to first slide with animation
                    setTimeout(() => {
                        carousel.style.transition = 'transform 0.5s ease-in-out';
                        moveToSlide(0);
                    }, 10);
                } else {
                    moveToSlide(currentSlide + 1);
                }
                lastAutoAdvanceTime = currentTime;
            }
        }
    }

    function moveToSlide(index) {
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        const offset = -currentSlide * 100;
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(${offset}%)`;

        updateDots();
    }

    // Handle transition end for manual navigation
    carousel.addEventListener('transitionend', () => {
        if (currentSlide === slides.length - 1 && !isPaused) {
            // Reset the timer when reaching the last slide
            lastAutoAdvanceTime = Date.now();
        }
    });

    function pauseAutoAdvance() {
        isPaused = true;
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }

    function resumeAutoAdvance() {
        isPaused = false;
        lastAutoAdvanceTime = Date.now(); // Reset the timer when resuming
        if (!autoAdvanceTimer) {
            autoAdvanceTimer = setInterval(autoAdvance, 100);
        }
    }

    // Event listeners for buttons
    nextButton.addEventListener('click', () => {
        if (currentSlide === slides.length - 1) {
            // Smooth transition for manual navigation to first slide
            carousel.style.transition = 'none';
            currentSlide = -1;
            const offset = -currentSlide * 100;
            carousel.style.transform = `translateX(${offset}%)`;
            
            carousel.offsetHeight;
            
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-in-out';
                moveToSlide(0);
            }, 10);
        } else {
            moveToSlide(currentSlide + 1);
        }
        lastAutoAdvanceTime = Date.now();
    });
    
    prevButton.addEventListener('click', () => {
        if (currentSlide === 0) {
            // Smooth transition for manual navigation to last slide
            carousel.style.transition = 'none';
            currentSlide = slides.length;
            const offset = -currentSlide * 100;
            carousel.style.transform = `translateX(${offset}%)`;
            
            carousel.offsetHeight;
            
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-in-out';
                moveToSlide(slides.length - 1);
            }, 10);
        } else {
            moveToSlide(currentSlide - 1);
        }
        lastAutoAdvanceTime = Date.now();
    });

    // Add touch event listeners with passive option for better performance
    carousel.addEventListener('touchstart', touchStart, { passive: true });
    carousel.addEventListener('touchmove', touchMove, { passive: true });
    carousel.addEventListener('touchend', touchEnd);
    carousel.addEventListener('touchcancel', touchEnd);

    // Mouse events
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);

    // Prevent context menu on long press
    carousel.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.carousel-slide')) {
            e.preventDefault();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        updateSlidePosition();
    });

    // Initialize
    updateSlidePosition();
    resumeAutoAdvance();
});
