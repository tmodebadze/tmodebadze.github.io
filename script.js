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

// Form submission handling
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(this);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  // Here you would typically send the form data to a server
  console.log("Form submitted:", formObject);

  // Show success message
  alert("Thank you for your message! I will get back to you soon.");
  this.reset();
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
