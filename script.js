// Navigation functionality
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Update URL hash
  window.location.hash = pageId;
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// WhatsApp contact functionality
function contactWhatsApp(lodgeName, price) {
  const phoneNumber = '08082610560';
  const message = encodeURIComponent(`Hi! I'm interested in the ${lodgeName} lodge listed for ${price}. Can you provide more details?`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');
  
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
}

// Initialize theme on page load
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.querySelector('.theme-icon');
  
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }
}

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initializeTheme();
  
  // Add click event listeners to navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
    });
  });
  
  // Handle initial page load
  const hash = window.location.hash.substring(1);
  if (hash && ['home', 'lodges', 'about'].includes(hash)) {
    showPage(hash);
  } else {
    showPage('home');
  }
  
  // Handle browser back/forward buttons
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'lodges', 'about'].includes(hash)) {
      showPage(hash);
    }
  });
  
  // Add smooth scrolling for better UX
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeIn 0.6s ease-out';
      }
    });
  }, observerOptions);
  
  // Observe lodge cards for animation
  const lodgeCards = document.querySelectorAll('.lodge-card');
  lodgeCards.forEach(card => {
    observer.observe(card);
  });
});

// Logo click handler
document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.nav-logo');
  logo.addEventListener('click', function(e) {
    e.preventDefault();
    showPage('home');
  });
});

// Responsive navigation for mobile
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('mobile-open');
}

// Add mobile menu styles when needed
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 480px) {
    .nav-links.mobile-open {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 1rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  }
`;
document.head.appendChild(style);
