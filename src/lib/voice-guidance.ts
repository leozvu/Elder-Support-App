// Voice guidance utility for accessibility

// Store voice settings in localStorage
const STORAGE_KEY = 'voice_guidance_settings';

// Default settings
const DEFAULT_SETTINGS = {
  enabled: false,
  volume: 1,
  rate: 1,
  pitch: 1,
  voice: null
};

// Current utterance being spoken
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Queue for managing speech
const speechQueue: { text: string; priority: boolean }[] = [];
let isSpeaking = false;

/**
 * Get the current voice guidance status
 */
export function getVoiceGuidanceStatus() {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      return {
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
        // Voice object can't be serialized properly, so we need to find it again
        voice: parsedSettings.voiceURI ? 
          findVoiceByURI(parsedSettings.voiceURI) : 
          null
      };
    }
  } catch (error) {
    console.error('Failed to get voice guidance settings:', error);
  }
  
  return DEFAULT_SETTINGS;
}

/**
 * Update voice settings
 */
export function updateVoiceSettings(settings: {
  enabled?: boolean;
  volume?: number;
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice | null;
}) {
  try {
    const currentSettings = getVoiceGuidanceStatus();
    const newSettings = {
      ...currentSettings,
      ...settings
    };
    
    // Store voice URI instead of the voice object
    const settingsToStore = {
      ...newSettings,
      voiceURI: newSettings.voice?.voiceURI || null,
      voice: null // Don't store the voice object
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToStore));
    return newSettings;
  } catch (error) {
    console.error('Failed to update voice settings:', error);
    return getVoiceGuidanceStatus();
  }
}

/**
 * Toggle voice guidance on/off
 */
export function toggleVoiceGuidance() {
  const currentSettings = getVoiceGuidanceStatus();
  const newEnabled = !currentSettings.enabled;
  
  updateVoiceSettings({ enabled: newEnabled });
  
  // Announce the change if enabling
  if (newEnabled) {
    speak('Voice guidance enabled', true);
  } else {
    stopSpeaking();
  }
  
  return newEnabled;
}

/**
 * Get available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  
  return window.speechSynthesis.getVoices();
}

/**
 * Find a voice by its URI
 */
function findVoiceByURI(uri: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  return voices.find(voice => voice.voiceURI === uri) || null;
}

/**
 * Process the speech queue
 */
function processSpeechQueue() {
  if (isSpeaking || speechQueue.length === 0) {
    return;
  }
  
  const settings = getVoiceGuidanceStatus();
  if (!settings.enabled) {
    speechQueue.length = 0; // Clear the queue if voice guidance is disabled
    return;
  }
  
  const nextSpeech = speechQueue.shift();
  if (!nextSpeech) return;
  
  isSpeaking = true;
  
  const utterance = new SpeechSynthesisUtterance(nextSpeech.text);
  utterance.volume = settings.volume;
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  
  if (settings.voice) {
    utterance.voice = settings.voice;
  }
  
  utterance.onend = () => {
    isSpeaking = false;
    currentUtterance = null;
    processSpeechQueue(); // Process the next item in the queue
  };
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    isSpeaking = false;
    currentUtterance = null;
    processSpeechQueue(); // Try the next item
  };
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Speak text
 */
export function speak(text: string, priority = false): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  
  const settings = getVoiceGuidanceStatus();
  if (!settings.enabled) {
    return false;
  }
  
  // If priority, clear the queue and stop current speech
  if (priority) {
    stopSpeaking();
    speechQueue.length = 0;
  }
  
  // Add to queue
  if (priority) {
    speechQueue.unshift({ text, priority });
  } else {
    speechQueue.push({ text, priority });
  }
  
  processSpeechQueue();
  return true;
}

/**
 * Stop speaking
 */
export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  
  window.speechSynthesis.cancel();
  isSpeaking = false;
  currentUtterance = null;
}

/**
 * Announce page change
 */
export function announcePageChange(pageName: string) {
  speak(`Page changed to ${pageName}`, true);
}

/**
 * Announce action
 */
export function announceAction(action: string) {
  speak(action, false);
}

/**
 * Announce notification
 */
export function announceNotification(title: string, description?: string) {
  const text = description ? `${title}. ${description}` : title;
  speak(`New notification: ${text}`, true);
}

/**
 * Read form field
 */
export function readFormField(label: string, value?: string) {
  const text = value ? `${label}: ${value}` : label;
  speak(text, false);
}