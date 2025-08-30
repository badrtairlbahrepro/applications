// Gestion du menu hamburger mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});

// Gestion du formulaire de contact
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validation simple
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (name === '' || email === '' || message === '') {
    formMessage.textContent = 'Veuillez remplir tous les champs.';
    formMessage.style.color = 'red';
    return;
  }

  // Format email simple
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formMessage.textContent = 'Veuillez entrer un email valide.';
    formMessage.style.color = 'red';
    return;
  }

  // Simulation envoi
  formMessage.textContent = 'Envoi en cours...';
  formMessage.style.color = 'var(--color-primary-dark)';

  setTimeout(() => {
    formMessage.textContent = 'Merci pour votre message, nous vous répondrons rapidement !';
    form.reset();
  }, 1500);
});