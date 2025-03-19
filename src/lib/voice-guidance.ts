// Simple voice guidance system

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize speech synthesis
let speechSynthesis: SpeechSynthesis | null = null;

if (isBrowser && 'speechSynthesis' in window) {
  speechSynthesis = window.speechSynthesis;
}

/**
 * Speak text using the speech synthesis API
 */
export function speak(text: string, priority = false) {
  if (!isBrowser || !speechSynthesis) return false;
  
  // Cancel current speech if this is a priority message
  if (priority && speechSynthesis.speaking) {
    speechSynthesis.cancel();
  } else if (speechSynthesis.speaking && !priority) {
    // Don't interrupt current speech with non-priority messages
    return false;
  }
  
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('Error speaking text:', error);
    return false;
  }
}

/**
 * Stop speaking
 */
export function stopSpeaking() {
  if (!isBrowser || !speechSynthesis) return;
  speechSynthesis.cancel();
}

/**
 * Announce page change
 */
export function announcePageChange(pageName: string) {
  speak(`Navigated to ${pageName} page`, true);
}

/**
 * Initialize the voice guidance system
 */
export function initVoiceGuidance() {
  if (!isBrowser || !speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser');
    return false;
  }
  
  return true;
}