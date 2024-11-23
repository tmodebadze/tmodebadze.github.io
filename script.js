// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Navbar background change on scroll
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Modal functionality
const modal = document.getElementById("thank-you-modal");
const closeModal = document.querySelector(".close-modal");

function showModal() {
  modal.classList.add("show");
}

function hideModal() {
  modal.classList.remove("show");
}

closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// Form submission handling
const contactForm = document.getElementById("contact-form");
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Disable submit button during submission
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch(this.action, {
      method: "POST",
      body: new FormData(this),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      // Show success message
      showModal();
      this.reset();
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    alert("Oops! There was a problem submitting your form. Please try again.");
    console.error("Form submission error:", error);
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.2,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  section.classList.add("fade-out");
  observer.observe(section);
});

// Add loading animation to gallery images
document.querySelectorAll(".gallery-item img").forEach((img) => {
  img.addEventListener("load", function () {
    this.classList.add("loaded");
  });
});

// Project Category Filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const projectCards = document.querySelectorAll('.project-card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter projects
            const category = tab.dataset.category;
            projectCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Translation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const translateToggle = document.getElementById('translateToggle');
  const enLabel = document.querySelector('.lang-label.en');
  const kaLabel = document.querySelector('.lang-label.ka');

  // Function to wait for Google Translate to initialize
  const waitForGoogleTranslate = (callback) => {
    if (document.querySelector('.goog-te-combo')) {
      callback();
    } else {
      setTimeout(() => waitForGoogleTranslate(callback), 100);
    }
  };

  translateToggle.addEventListener('change', function() {
    waitForGoogleTranslate(() => {
      const googleCombo = document.querySelector('.goog-te-combo');
      if (googleCombo) {
        if (this.checked) {
          // Switch to Georgian
          googleCombo.value = 'ka';
          enLabel.classList.remove('active');
          kaLabel.classList.add('active');
        } else {
          // Switch to English
          googleCombo.value = '';  // Reset to original language
          kaLabel.classList.remove('active');
          enLabel.classList.add('active');
        }
        // Trigger the change event
        googleCombo.dispatchEvent(new Event('change'));
        // Force the translation
        const event = new Event('change', { bubbles: true });
        googleCombo.dispatchEvent(event);
      }
    });
  });

  // Initialize Google Translate
  const googleTranslateElementInit = () => {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ka',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  };

  // Load Google Translate script
  const loadGoogleTranslate = () => {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  };

  // Make googleTranslateElementInit global
  window.googleTranslateElementInit = googleTranslateElementInit;
  
  // Load Google Translate
  loadGoogleTranslate();
});
