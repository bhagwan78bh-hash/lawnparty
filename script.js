/**
 * Lawnparty - Interactive Guide Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Interactive Lawnparty Checklist
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.checklist-progress-text');
  const resetBtn = document.querySelector('#reset-checklist');
  const checkAllBtn = document.querySelector('#check-all-checklist');

  if (checklistItems.length > 0) {
    const STORAGE_KEY = 'lawnparty_guide_checklist_v1';

    // Load saved checklist state
    const loadChecklistState = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        checklistItems.forEach((checkbox, index) => {
          if (saved[index]) {
            checkbox.checked = true;
            checkbox.closest('.checklist-item').classList.add('completed');
          } else {
            checkbox.checked = false;
            checkbox.closest('.checklist-item').classList.remove('completed');
          }
        });
      } catch (e) {
        console.warn('Could not load checklist state from localStorage:', e);
      }
      updateProgress();
    };

    // Save checklist state
    const saveChecklistState = () => {
      const state = {};
      checklistItems.forEach((checkbox, index) => {
        if (checkbox.checked) {
          state[index] = true;
        }
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Could not save checklist state to localStorage:', e);
      }
    };

    // Update progress bar and text
    const updateProgress = () => {
      let checkedCount = 0;
      checklistItems.forEach(cb => {
        if (cb.checked) checkedCount++;
      });

      const total = checklistItems.length;
      const percentage = Math.round((checkedCount / total) * 100);

      if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
      }
      if (progressText) {
        progressText.textContent = `${checkedCount} of ${total} tasks completed (${percentage}%)`;
      }
    };

    checklistItems.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const parent = e.target.closest('.checklist-item');
        if (e.target.checked) {
          parent.classList.add('completed');
        } else {
          parent.classList.remove('completed');
        }
        saveChecklistState();
        updateProgress();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your party checklist progress?')) {
          checklistItems.forEach(cb => {
            cb.checked = false;
            cb.closest('.checklist-item').classList.remove('completed');
          });
          localStorage.removeItem(STORAGE_KEY);
          updateProgress();
        }
      });
    }

    if (checkAllBtn) {
      checkAllBtn.addEventListener('click', () => {
        checklistItems.forEach(cb => {
          cb.checked = true;
          cb.closest('.checklist-item').classList.add('completed');
        });
        saveChecklistState();
        updateProgress();
      });
    }

    // Initial load
    loadChecklistState();
  }

  // Newsletter Form Handler
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        const originalText = newsletterForm.querySelector('button').textContent;
        newsletterForm.querySelector('button').textContent = 'Subscribed! 🥂';
        input.value = '';
        setTimeout(() => {
          newsletterForm.querySelector('button').textContent = originalText;
        }, 3500);
      }
    });
  }
});

