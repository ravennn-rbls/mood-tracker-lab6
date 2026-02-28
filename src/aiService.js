import { fallbackMessages } from './fallbackMessages.js';

export async function getAiMessage(prompt) {
  // Bypasses the restricted API to provide a local message
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      resolve(random);
    }, 800); 
  });
}