// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(this.getAttribute("href"));
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Navbar background change on scroll
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  });
}

// Modal functionality
const modal = document.getElementById("thank-you-modal");
const closeModal = document.querySelector(".close-modal");
const contactForm = document.getElementById("contact-form");

function showModal() {
  if (modal) {
    modal.classList.add("show");
  }
}

function hideModal() {
  if (modal) {
    modal.classList.remove("show");
  }
}

if (closeModal && modal) {
  closeModal.addEventListener("click", hideModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
}

// Form submission handling
if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    
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
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
    }
  });
}

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
document.addEventListener("DOMContentLoaded", function () {
  const categoryTabs = document.querySelectorAll(".category-tab");
  const projectCards = document.querySelectorAll(".project-card");

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active tab
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Filter projects
      const category = tab.dataset.category;
      projectCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
          card.style.animation = "fadeIn 0.5s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

// Add fade-in animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
