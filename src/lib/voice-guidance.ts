// Voice guidance system for accessibility

let speechSynthesis: SpeechSynthesis | null = null;
let availableVoices: SpeechSynthesisVoice[] = [];
let currentSettings = {
  enabled: false,
  volume: 1,
  rate: 1,
  pitch: 1,
  voice: null as SpeechSynthesisVoice | null,
  autoReadPageContent: false,
};

export function initVoiceGuidance() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
    
    // Load available voices
    const loadVoices = () => {
      availableVoices = speechSynthesis?.getVoices() || [];
      console.log('Available voices loaded:', availableVoices.length);
    };

    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
    return true;
  }
  
  console.warn('Speech synthesis not supported in this browser');
  return false;
}

export function updateVoiceSettings(settings: Partial<typeof currentSettings>) {
  currentSettings = { ...currentSettings, ...settings };
  return currentSettings;
}

export function getAvailableVoices() {
  return availableVoices;
}

export function speak(text: string, priority = false) {
  if (!speechSynthesis || !currentSettings.enabled) return false;
  
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

export function stopSpeaking() {
  if (!speechSynthesis) return;
  speechSynthesis.cancel();
}

export function announcePageChange(pageName: string) {
  speak(`Navigated to ${pageName} page`, true);
}

export function readElement(element: HTMLElement) {
  if (!element) return;
  
  const text = element.textContent || '';
  if (text.trim()) {
    speak(text);
  }
}

export function isVoiceGuidanceEnabled() {
  return currentSettings.enabled;
}