/**
 * ST. THOMAS HIGHER SECONDARY SCHOOL, KILIYANTHARA
 * Main Script - Vanilla JavaScript
 * Works seamlessly via file:/// protocol in Chrome and on static hosts.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- 2. Gallery Lightbox Functionality ---
  const lightboxModal = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-card');

  if (lightboxModal && lightboxImg) {
    galleryItems.forEach(function (card) {
      card.addEventListener('click', function () {
        const img = card.querySelector('img');
        const title = card.getAttribute('data-title') || (img ? img.alt : '');
        const desc = card.getAttribute('data-desc') || '';
        const fullSrc = card.getAttribute('data-full') || (img ? img.src : '');

        if (fullSrc) {
          lightboxImg.src = fullSrc;
          lightboxImg.alt = title;
          if (lightboxTitle) lightboxTitle.textContent = title;
          if (lightboxDesc) lightboxDesc.textContent = desc;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 3. Gallery Category Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 4. Announcements Filter (if present) ---
  const noticeFilters = document.querySelectorAll('.notice-filter-btn');
  const noticeItems = document.querySelectorAll('.notice-item');

  if (noticeFilters.length > 0 && noticeItems.length > 0) {
    noticeFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        noticeFilters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        noticeItems.forEach(function (notice) {
          const itemCat = notice.getAttribute('data-category');
          if (cat === 'all' || itemCat === cat) {
            notice.style.display = 'flex';
          } else {
            notice.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 5. Admin Portal Tab Navigation (admin.html) ---
  const adminTabBtns = document.querySelectorAll('.admin-nav-item button');
  const adminPanes = document.querySelectorAll('.admin-tab-pane');

  if (adminTabBtns.length > 0 && adminPanes.length > 0) {
    adminTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetTab = btn.getAttribute('data-tab');

        adminTabBtns.forEach(function (b) { b.classList.remove('active'); });
        adminPanes.forEach(function (pane) { pane.classList.remove('active'); });

        btn.classList.add('active');
        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  // --- 6. Form Handlers & Submission Feedback ---
  const contactForm = document.getElementById('schoolContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const subject = document.getElementById('contactSubject')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !message) {
        formStatus.innerHTML = '<div style="color: #c0392b; padding: 0.75rem; background: #fdf2f2; border: 1px solid #f8b4b4; margin-top: 1rem;">Please complete all required fields.</div>';
        return;
      }

      // Check if running on static host with configured action (like Formspree or Netlify)
      const action = contactForm.getAttribute('action');
      if (action && action.startsWith('http')) {
        contactForm.submit();
      } else {
        formStatus.innerHTML = `
          <div style="color: #0f5132; background-color: #d1e7dd; border: 1px solid #badbcc; padding: 1rem; margin-top: 1rem; border-radius: 4px;">
            <strong>Thank you, ${escapeHtml(name)}!</strong><br>
            Your inquiry regarding "${escapeHtml(subject || 'General Admission / Information')}" has been recorded for review.<br>
            <small style="color: #0f5132;">Note: To transmit inquiries directly to <em>kilistthomashss@gmail.com</em>, connect this form to Netlify Forms or Formspree as described in the documentation.</small>
          </div>
        `;
        contactForm.reset();
      }
    });
  }

  // Helper function to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
