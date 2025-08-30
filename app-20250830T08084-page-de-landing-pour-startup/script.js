// JavaScript pour la page de landing startup

// Gestion souple de la soumission du formulaire de contact
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Validation simple côté client
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = 'Veuillez remplir tous les champs.';
    formMessage.style.color = '#e63946';
    return;
  }

  // Simulation d'envoi (on pourrait appeler une API ici)
  formMessage.textContent = 'Envoi en cours...';
  formMessage.style.color = '#3a86ff';

  setTimeout(() => {
    formMessage.textContent = 'Merci pour votre message, nous vous contacterons bientôt !';
    form.reset();
  }, 1500);
});
