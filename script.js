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
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    player.playVideo();
  }
}

// Background video transition
document.addEventListener('DOMContentLoaded', () => {
  const heroBg = document.querySelector('.hero-bg');
  const videoContainer = document.getElementById('fb-video-container');

  // Function to handle Facebook video
  const initFacebookVideo = () => {
    // Wait for FB SDK to be ready
    if (window.FB) {
      // After 10 seconds, fade out the hero background and fade in the video
      setTimeout(() => {
        heroBg.style.opacity = '0';
        videoContainer.style.opacity = '1';
      }, 10000);
    } else {
      // If FB SDK is not ready yet, try again in 1 second
      setTimeout(initFacebookVideo, 1000);
    }
  };

  // Initialize Facebook video handling
  initFacebookVideo();
});
