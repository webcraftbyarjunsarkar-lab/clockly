// ================================================
// CLOCKLY - CONTACT FORM HANDLER (Frontend)
// ================================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

// ================================================
// HANDLE FORM SUBMISSION
// ================================================

async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();
  
  // Get submit button
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  try {
    // Send to backend
    const response = await fetch('https://formspree.io/f/mpwgjnjr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      // Success!
      showSuccessMessage(name, email, result.submission_id);
      contactForm.reset();
      submitBtn.textContent = 'Message Sent! ✓';
      submitBtn.style.background = '#10b981';
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    } else {
      // Error from server
      showErrorMessage(result.errors || [result.message]);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage(['Network error. Please try again later.']);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// ================================================
// SHOW SUCCESS MESSAGE
// ================================================

function showSuccessMessage(name, email, submissionId) {
  // Remove any existing alerts
  removeExistingAlerts();
  
  const alertHTML = `
    <div class="alert alert-success" id="successAlert">
      <div class="alert-content">
        <h3>✓ Message Sent Successfully!</h3>
        <p>Thank you for contacting Clockly, <strong>${escapeHtml(name)}</strong>!</p>
        <p>We've sent a confirmation email to <strong>${escapeHtml(email)}</strong></p>
        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
          <strong>Submission ID:</strong> #${submissionId}<br>
          We'll get back to you within 24-48 hours.
        </p>
      </div>
      <button onclick="this.parentElement.remove()" class="alert-close">×</button>
    </div>
  `;
  
  const alertDiv = document.createElement('div');
  alertDiv.innerHTML = alertHTML;
  
  const formWrapper = document.querySelector('.contact-form-wrapper');
  formWrapper.insertBefore(alertDiv.firstElementChild, formWrapper.firstChild);
  
  // Scroll to alert
  document.getElementById('successAlert').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ================================================
// SHOW ERROR MESSAGE
// ================================================

function showErrorMessage(errors) {
  // Remove any existing alerts
  removeExistingAlerts();
  
  const errorList = errors.map(err => `<li>${escapeHtml(err)}</li>`).join('');
  
  const alertHTML = `
    <div class="alert alert-error" id="errorAlert">
      <div class="alert-content">
        <h3>✗ Error Sending Message</h3>
        <ul class="error-list">
          ${errorList}
        </ul>
      </div>
      <button onclick="this.parentElement.remove()" class="alert-close">×</button>
    </div>
  `;
  
  const alertDiv = document.createElement('div');
  alertDiv.innerHTML = alertHTML;
  
  const formWrapper = document.querySelector('.contact-form-wrapper');
  formWrapper.insertBefore(alertDiv.firstElementChild, formWrapper.firstChild);
  
  // Scroll to alert
  document.getElementById('errorAlert').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ================================================
// REMOVE EXISTING ALERTS
// ================================================

function removeExistingAlerts() {
  const successAlert = document.getElementById('successAlert');
  const errorAlert = document.getElementById('errorAlert');
  
  if (successAlert) successAlert.remove();
  if (errorAlert) errorAlert.remove();
}

// ================================================
// ESCAPE HTML (Security)
// ================================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
// Add to contact-form.js start:

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update handleFormSubmit:

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  try {
    const docRef = await addDoc(collection(db, "contact_submissions"), {
      name: name,
      email: email,
      subject: subject,
      message: message,
      timestamp: new Date()
    });
    
    showSuccessMessage(name, email, docRef.id);
    contactForm.reset();
    
  } catch (error) {
    showErrorMessage(['Error saving message']);
    console.error(error);
  }
  
  submitBtn.disabled = false;
}
