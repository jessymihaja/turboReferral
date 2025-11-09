const { turnstileSecretKey } = require('../config/env');

async function validateTurnstileToken(token, remoteip) {
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Format de token invalide' };
  }

  if (token.length > 2048) {
    return { success: false, error: 'Token trop long' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', turnstileSecretKey);
    formData.append('response', token);
    
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur de validation Turnstile:', error);
    return { success: false, error: 'Erreur interne' };
  }
}

module.exports = { validateTurnstileToken };
