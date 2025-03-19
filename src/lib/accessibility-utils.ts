/**
 * Utility functions for accessibility features
 */

// Initialize text-to-speech with user preferences
export const initTextToSpeech = () => {
  // Check if browser supports speech synthesis
  if (!("speechSynthesis" in window)) {
    console.warn("Text-to-speech is not supported in this browser");
    return false;
  }

  // Get user preferences from localStorage
  const voiceEnabled = localStorage.getItem("voiceEnabled") !== "false";
  const voiceRate = parseFloat(localStorage.getItem("voiceRate") || "0.9");
  const voicePitch = parseFloat(localStorage.getItem("voicePitch") || "1.0");

  // Store in session for quick access
  sessionStorage.setItem("voiceEnabled", String(voiceEnabled));
  sessionStorage.setItem("voiceRate", String(voiceRate));
  sessionStorage.setItem("voicePitch", String(voicePitch));

  return true;
};

// Speak text using the browser's speech synthesis API
export const speakText = (text: string) => {
  if (!("speechSynthesis" in window)) return;

  // Check if voice is enabled
  const voiceEnabled = sessionStorage.getItem("voiceEnabled") !== "false";
  if (!voiceEnabled) return;

  // Get user preferences
  const rate = parseFloat(sessionStorage.getItem("voiceRate") || "0.9");
  const pitch = parseFloat(sessionStorage.getItem("voicePitch") || "1.0");

  // Create and configure utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Use preferred voice if available
  const preferredVoice = sessionStorage.getItem("preferredVoice");
  if (preferredVoice) {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name === preferredVoice);
    if (voice) utterance.voice = voice;
  }

  // Speak the text
  speechSynthesis.cancel(); // Cancel any ongoing speech
  speechSynthesis.speak(utterance);
};

// Increase font size throughout the application
export const increaseFontSize = () => {
  const html = document.documentElement;
  const currentSize = parseFloat(getComputedStyle(html).fontSize);
  const newSize = currentSize * 1.1; // Increase by 10%
  html.style.fontSize = `${newSize}px`;
  localStorage.setItem("fontSize", `${newSize}px`);
};

// Decrease font size throughout the application
export const decreaseFontSize = () => {
  const html = document.documentElement;
  const currentSize = parseFloat(getComputedStyle(html).fontSize);
  const newSize = currentSize * 0.9; // Decrease by 10%
  html.style.fontSize = `${newSize}px`;
  localStorage.setItem("fontSize", `${newSize}px`);
};

// Reset font size to default
export const resetFontSize = () => {
  document.documentElement.style.fontSize = "";
  localStorage.removeItem("fontSize");
};

// Toggle high contrast mode
export const toggleHighContrast = () => {
  const html = document.documentElement;
  const highContrastEnabled = html.classList.toggle("high-contrast");
  localStorage.setItem("highContrast", String(highContrastEnabled));
};

// Apply saved accessibility settings on page load
export const applyAccessibilitySettings = () => {
  // Apply font size
  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize;
  }

  // Apply high contrast if enabled
  const highContrast = localStorage.getItem("highContrast") === "true";
  if (highContrast) {
    document.documentElement.classList.add("high-contrast");
  }

  // Initialize text-to-speech
  initTextToSpeech();
};
