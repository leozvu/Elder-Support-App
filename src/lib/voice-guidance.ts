// Voice guidance system for accessibility

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize speech synthesis
let speechSynthesis: SpeechSynthesis | null = null;
let availableVoices: SpeechSynthesisVoice[] = [];

if (isBrowser && 'speechSynthesis' in window) {
  speechSynthesis = window.speechSynthesis;
}

// Current voice settings
const currentSettings = {
  enabled: false,
  volume: 1,
  rate: 1,
  pitch: 1,
  voice: null as SpeechSynthesisVoice | null,
  autoReadPageContent: false,
};

/**
 * Initialize the voice guidance system
 */
export function initVoiceGuidance() {
  if (!isBrowser || !speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser');
    return false;
  }
  
  // Load available voices
  const loadVoices = () => {
    availableVoices = speechSynthesis.getVoices();
    console.log('Available voices loaded:', availableVoices.length);
  };

  // Chrome loads voices asynchronously
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  loadVoices();
  return true;
}

/**
 * Update voice settings
 */
export function updateVoiceSettings(settings: Partial<typeof currentSettings>) {
  Object.assign(currentSettings, settings);
  return currentSettings;
}

/**
 * Get available voices
 */
export function getAvailableVoices() {
  return availableVoices;
}

/**
 * Speak text using the speech synthesis API
 */
export function speak(text: string, priority = false) {
  if (!isBrowser || !speechSynthesis || !currentSettings.enabled) return false;
  
  // Cancel current speech if this is a priority message
  if (priority && speechSynthesis.speaking) {
    speechSynthesis.cancel();
  } else if (speechSynthesis.speaking && !priority) {
    // Don't interrupt current speech with non-priority messages
    return false;
  }
  
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.volume = currentSettings.volume;
    utterance.rate = currentSettings.rate;
    utterance.pitch = currentSettings.pitch;
    
    if (currentSettings.voice) {
      utterance.voice = currentSettings.voice;
    }
    
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
 * Check if voice guidance is enabled
 */
export function isVoiceGuidanceEnabled() {
  return currentSettings.enabled;
}

/**
 * Toggle voice guidance
 */
export function toggleVoiceGuidance() {
  currentSettings.enabled = !currentSettings.enabled;
  if (currentSettings.enabled) {
    speak('Voice guidance enabled', true);
  }
  return currentSettings.enabled;
}