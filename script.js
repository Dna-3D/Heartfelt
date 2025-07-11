// Navigation functionality
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Admin page password check
  if (pageId === 'admin' && !adminAuthenticated) {
    const input = prompt('Enter admin password:');
    if (input !== ADMIN_PASSWORD) {
      alert('Incorrect password.');
      showPage('home');
      return;
    } else {
      adminAuthenticated = true;
    }
  }
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
  const phoneNumber = '+2349017665262';
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

// --- Fetch and Render Product Cards from Firestore ---
async function fetchAndRenderProductCards() {
  const container = document.getElementById('firebase-lodge-cards');
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading lodges...</div>';
  try {
    const snapshot = await firebase.firestore()
      .collection('products')
      .orderBy('uploadedAt', 'desc')
      .get();
    if (snapshot.empty) {
      container.innerHTML = '<div class="no-lodges">No lodges uploaded yet.</div>';
      return;
    }
    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `
        <div class="lodge-card">
          <div class="lodge-image">
            <video src="${data.videoUrl}" controls poster="img.jpg" width="100%" height="180"></video>
            <div class="price-tag">₦${data.price}/year</div>
          </div>
          <div class="lodge-info">
            <h3 class="lodge-title">${data.title}</h3>
            <p class="lodge-description">${data.description}</p>
            <button class="btn-primary" onclick="contactWhatsApp('${data.title}', '₦${data.price}/year')">Contact via WhatsApp</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<div class="error">Failed to load lodges: ' + err.message + '</div>';
  }
}

// Show product cards when lodges page is shown
const originalShowPage = showPage;
showPage = function(pageId) {
  originalShowPage(pageId);
  if (pageId === 'lodges') {
    fetchAndRenderProductCards();
  }
};

// Also fetch on initial load if lodges page is active
if (window.location.hash.substring(1) === 'lodges') {
  fetchAndRenderProductCards();
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
  
  // Hamburger menu functionality
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinksMenu = document.querySelector('.nav-links');
  if (hamburgerBtn && navLinksMenu) {
    hamburgerBtn.addEventListener('click', function() {
      navLinksMenu.classList.toggle('open');
    });
    // Optional: close menu when a link is clicked (for better UX)
    navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
      });
    });
  }
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

// --- Admin Video Upload, Edit, Delete ---
document.addEventListener('DOMContentLoaded', function() {
  const uploadForm = document.getElementById('video-upload-form');
  const adminLodgeList = document.getElementById('admin-lodge-list');
  const uploadBtn = document.getElementById('upload-btn');
  const updateBtn = document.getElementById('update-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const videoIdInput = document.getElementById('video-id');
  const statusDiv = document.getElementById('upload-status');

  // Fetch and render all lodge cards for admin management
  async function fetchAdminLodgeCards() {
    if (!adminLodgeList) return;
    adminLodgeList.innerHTML = '<div class="loading">Loading...</div>';
    try {
      const snapshot = await firebase.firestore().collection('products').orderBy('uploadedAt', 'desc').get();
      if (snapshot.empty) {
        adminLodgeList.innerHTML = '<div class="no-lodges">No lodge cards found.</div>';
        return;
      }
      let html = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `
          <div class="lodge-card" data-id="${doc.id}">
            <div class="lodge-image">
              <video src="${data.videoUrl}" controls poster="img.jpg" width="100%" height="120"></video>
              <div class="price-tag">₦${data.price}/year</div>
            </div>
            <div class="lodge-info">
              <h3 class="lodge-title">${data.title}</h3>
              <p class="lodge-description">${data.description}</p>
              <button class="edit-btn" data-id="${doc.id}">Edit</button>
              <button class="delete-btn" data-id="${doc.id}">Delete</button>
            </div>
          </div>
        `;
      });
      adminLodgeList.innerHTML = html;

      // Add event listeners for edit and delete
      adminLodgeList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          const doc = await firebase.firestore().collection('products').doc(id).get();
          if (doc.exists) {
            const data = doc.data();
            videoIdInput.value = id;
            document.getElementById('video-title').value = data.title;
            document.getElementById('video-description').value = data.description;
            document.getElementById('video-price').value = data.price;
            document.getElementById('video-url').value = data.videoUrl;
            uploadBtn.style.display = 'none';
            updateBtn.style.display = 'inline-block';
            cancelEditBtn.style.display = 'inline-block';
            statusDiv.textContent = 'Editing mode: make changes and click Update.';
          }
        });
      });
      adminLodgeList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this lodge card?')) {
            try {
              await firebase.firestore().collection('products').doc(id).delete();
              statusDiv.textContent = 'Lodge card deleted.';
              fetchAdminLodgeCards();
            } catch (err) {
              statusDiv.textContent = 'Delete failed: ' + err.message;
            }
          }
        });
      });
    } catch (err) {
      adminLodgeList.innerHTML = '<div class="error">Failed to load lodge cards: ' + err.message + '</div>';
    }
  }

  // Initial fetch when admin page is shown
  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-page="admin"]')) {
      fetchAdminLodgeCards();
    }
  });
  // Also fetch if admin page is loaded directly
  if (window.location.hash.substring(1) === 'admin') {
    fetchAdminLodgeCards();
  }

  // Handle upload (add new)
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const title = document.getElementById('video-title').value;
      const description = document.getElementById('video-description').value;
      const price = document.getElementById('video-price').value;
      const videoUrl = document.getElementById('video-url').value;
      if (!videoUrl) {
        statusDiv.textContent = 'Please enter a video URL.';
        return;
      }
      statusDiv.textContent = 'Uploading...';
      try {
        await firebase.firestore().collection('products').add({
          title: title,
          description: description,
          price: price,
          videoUrl: videoUrl,
          uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        statusDiv.textContent = 'Product card upload successful!';
        uploadForm.reset();
        fetchAdminLodgeCards();
      } catch (err) {
        statusDiv.textContent = 'Upload failed: ' + err.message;
      }
    });
  }

  // Handle update (edit existing)
  if (updateBtn) {
    updateBtn.addEventListener('click', async function() {
      const id = videoIdInput.value;
      const title = document.getElementById('video-title').value;
      const description = document.getElementById('video-description').value;
      const price = document.getElementById('video-price').value;
      const videoUrl = document.getElementById('video-url').value;
      if (!id) {
        statusDiv.textContent = 'No lodge card selected for update.';
        return;
      }
      statusDiv.textContent = 'Updating...';
      try {
        await firebase.firestore().collection('products').doc(id).update({
          title: title,
          description: description,
          price: price,
          videoUrl: videoUrl
        });
        statusDiv.textContent = 'Lodge card updated!';
        uploadForm.reset();
        videoIdInput.value = '';
        uploadBtn.style.display = 'inline-block';
        updateBtn.style.display = 'none';
        cancelEditBtn.style.display = 'none';
        fetchAdminLodgeCards();
      } catch (err) {
        statusDiv.textContent = 'Update failed: ' + err.message;
      }
    });
  }

  // Handle cancel edit
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function() {
      uploadForm.reset();
      videoIdInput.value = '';
      uploadBtn.style.display = 'inline-block';
      updateBtn.style.display = 'none';
      cancelEditBtn.style.display = 'none';
      statusDiv.textContent = '';
    });
  }
});

// --- Admin Page Password Protection ---
const ADMIN_PASSWORD = 'Blueverse@DNA';
let adminAuthenticated = false;
