// Voice guidance utility for the Senior Assistance Platform

// Check if the browser supports speech synthesis and recognition
const isSpeechSynthesisSupported =
  typeof window !== "undefined" && "speechSynthesis" in window;

const isSpeechRecognitionSupported =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

// Voice guidance settings
let voiceGuidanceEnabled = true;
let voiceRate = 0.8; // Slower than default (1.0) for elderly users
let voicePitch = 1.0;
let voiceVolume = 1.0;
let preferredVoice: SpeechSynthesisVoice | null = null;

// Queue to manage speech synthesis
let speechQueue: string[] = [];
let isSpeaking = false;

// Tutorial state tracking
let tutorialMode = false;
let tutorialSteps: string[] = [];
let currentTutorialStep = 0;

// Initialize voice guidance
export const initVoiceGuidance = () => {
  if (!isSpeechSynthesisSupported) {
    console.warn("Speech synthesis is not supported in this browser");
    return;
  }

  // Try to find a good voice for elderly users (preferably a clear, slower voice)
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer a female voice in the user's language if available
    const userLang = navigator.language || "en-US";

    // First try to find a female voice in user's language
    preferredVoice =
      voices.find(
        (voice) =>
          voice.lang.includes(userLang.split("-")[0]) &&
          voice.name.includes("Female"),
      ) ||
      // Then try any voice in user's language
      voices.find((voice) => voice.lang.includes(userLang.split("-")[0])) ||
      // Fall back to any English female voice
      voices.find(
        (voice) => voice.lang.includes("en") && voice.name.includes("Female"),
      ) ||
      // Finally, just use the first available voice
      voices[0];

    // Load user preferences from localStorage if available
    loadVoicePreferences();
  };

  // Initialize voices
  if (window.speechSynthesis.getVoices().length > 0) {
    const voices = window.speechSynthesis.getVoices();
    preferredVoice = voices[0];
  }

  // Load user preferences
  loadVoicePreferences();
};

// Load voice preferences from localStorage
const loadVoicePreferences = () => {
  try {
    const savedPreferences = localStorage.getItem("voiceGuidancePreferences");
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      voiceGuidanceEnabled = preferences.enabled ?? true;
      voiceRate = preferences.rate ?? 0.8;
      voicePitch = preferences.pitch ?? 1.0;
      voiceVolume = preferences.volume ?? 1.0;

      // If a specific voice name was saved, try to find it
      if (preferences.voiceName && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const savedVoice = voices.find((v) => v.name === preferences.voiceName);
        if (savedVoice) {
          preferredVoice = savedVoice;
        }
      }
    }
  } catch (error) {
    console.error("Error loading voice preferences:", error);
  }
};

// Save voice preferences to localStorage
const saveVoicePreferences = () => {
  try {
    const preferences = {
      enabled: voiceGuidanceEnabled,
      rate: voiceRate,
      pitch: voicePitch,
      volume: voiceVolume,
      voiceName: preferredVoice?.name,
    };
    localStorage.setItem(
      "voiceGuidancePreferences",
      JSON.stringify(preferences),
    );
  } catch (error) {
    console.error("Error saving voice preferences:", error);
  }
};

// Speak text
export const speak = (text: string, priority = false) => {
  if (!voiceGuidanceEnabled || !isSpeechSynthesisSupported) return;

  // Add to queue
  if (priority) {
    // Clear current speech and put this at the front of the queue
    window.speechSynthesis.cancel();
    speechQueue = [text, ...speechQueue];
  } else {
    speechQueue.push(text);
  }

  // Start processing the queue if not already speaking
  if (!isSpeaking) {
    processQueue();
  }
};

// Process the speech queue
const processQueue = () => {
  if (speechQueue.length === 0) {
    isSpeaking = false;
    return;
  }

  isSpeaking = true;
  const text = speechQueue.shift() as string;
  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice properties
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  utterance.rate = voiceRate;
  utterance.pitch = voicePitch;
  utterance.volume = voiceVolume;

  utterance.onend = () => {
    // Continue with the next item in the queue
    processQueue();
  };

  utterance.onerror = (event) => {
    console.error("Speech synthesis error:", event);
    // Continue with the next item despite the error
    processQueue();
  };

  window.speechSynthesis.speak(utterance);
};

// Stop all speech
export const stopSpeaking = () => {
  if (!isSpeechSynthesisSupported) return;

  window.speechSynthesis.cancel();
  speechQueue = [];
  isSpeaking = false;
};

// Toggle voice guidance on/off
export const toggleVoiceGuidance = () => {
  voiceGuidanceEnabled = !voiceGuidanceEnabled;
  if (!voiceGuidanceEnabled) {
    stopSpeaking();
  } else {
    speak("Voice guidance is now enabled", true);
  }
  saveVoicePreferences();
  return voiceGuidanceEnabled;
};

// Update voice settings
export const updateVoiceSettings = (settings: {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}) => {
  if (settings.rate !== undefined) voiceRate = settings.rate;
  if (settings.pitch !== undefined) voicePitch = settings.pitch;
  if (settings.volume !== undefined) voiceVolume = settings.volume;
  if (settings.voice !== undefined) preferredVoice = settings.voice;

  // Save the updated preferences
  saveVoicePreferences();

  // Provide audio feedback with new settings
  speak("Voice settings updated. This is how the voice sounds now.", true);
};

// Get current voice guidance status
export const getVoiceGuidanceStatus = () => {
  return {
    enabled: voiceGuidanceEnabled,
    supported: isSpeechSynthesisSupported,
    speechRecognitionSupported: isSpeechRecognitionSupported,
    rate: voiceRate,
    pitch: voicePitch,
    volume: voiceVolume,
    currentVoice: preferredVoice,
    isSpeaking: isSpeaking,
  };
};

// Get available voices
export const getAvailableVoices = () => {
  if (!isSpeechSynthesisSupported) return [];
  return window.speechSynthesis.getVoices();
};

// Helper function to announce page changes
export const announcePageChange = (pageName: string) => {
  speak(`Navigated to ${pageName} page`, true);
};

// Helper function to announce actions
export const announceAction = (action: string) => {
  speak(action, true);
};

// Helper function to read form fields
export const readFormField = (label: string, value?: string) => {
  if (value) {
    speak(`${label}: ${value}`);
  } else {
    speak(label);
  }
};

// Helper function to announce notifications
export const announceNotification = (title: string, description?: string) => {
  if (description) {
    speak(`Notification: ${title}. ${description}`, true);
  } else {
    speak(`Notification: ${title}`, true);
  }
};

// Start a guided tutorial
export const startTutorial = (steps: string[]) => {
  tutorialMode = true;
  tutorialSteps = steps;
  currentTutorialStep = 0;

  // Announce the start of the tutorial
  speak("Starting guided tutorial. I'll walk you through each step.", true);

  // Start the first step after a brief pause
  setTimeout(() => {
    if (tutorialSteps.length > 0) {
      speak(tutorialSteps[0], true);
    }
  }, 1500);

  return true;
};

// Move to the next tutorial step
export const nextTutorialStep = () => {
  if (!tutorialMode || tutorialSteps.length === 0) return false;

  currentTutorialStep++;

  if (currentTutorialStep >= tutorialSteps.length) {
    // End of tutorial
    speak("You've completed all the steps. Tutorial finished.", true);
    tutorialMode = false;
    return false;
  }

  // Speak the next step
  speak(tutorialSteps[currentTutorialStep], true);
  return true;
};

// Repeat the current tutorial step
export const repeatTutorialStep = () => {
  if (!tutorialMode || tutorialSteps.length === 0) return false;

  speak("Repeating the current step.", true);
  setTimeout(() => {
    speak(tutorialSteps[currentTutorialStep], true);
  }, 1000);

  return true;
};

// End the tutorial
export const endTutorial = () => {
  if (!tutorialMode) return false;

  speak("Tutorial ended. You can restart it anytime from the help menu.", true);
  tutorialMode = false;
  return true;
};

// Get tutorial status
export const getTutorialStatus = () => {
  return {
    active: tutorialMode,
    currentStep: currentTutorialStep,
    totalSteps: tutorialSteps.length,
  };
};

// Provide step-by-step guidance for a specific feature
export const provideFeatureGuidance = (featureName: string) => {
  switch (featureName.toLowerCase()) {
    case "service request":
      startTutorial([
        "Let's create a service request together.",
        "First, select the type of service you need from the options provided.",
        "Next, fill in the details like date, time, and location.",
        "You can use the voice input button next to each field to speak instead of typing.",
        "Review your request details before submitting.",
        "Finally, click the submit button to send your request.",
      ]);
      break;

    case "medication reminder":
      startTutorial([
        "Let's set up a medication reminder.",
        "First, enter the name of your medication.",
        "Next, select how often you need to take it.",
        "Set the times of day for your medication.",
        "You can add notes or special instructions if needed.",
        "Review the details and save your reminder.",
      ]);
      break;

    case "emergency contacts":
      startTutorial([
        "Let's add an emergency contact.",
        "Enter the name of your emergency contact.",
        "Add their phone number.",
        "Select their relationship to you.",
        "Add any additional information if needed.",
        "Review the details and save your emergency contact.",
      ]);
      break;

    default:
      speak(
        "I don't have specific guidance for that feature yet. Please try another feature or ask for general help.",
        true,
      );
      return false;
  }

  return true;
};

// Provide contextual help based on the current screen
export const provideContextualHelp = (screenName: string) => {
  switch (screenName.toLowerCase()) {
    case "dashboard":
      speak(
        "You're on the dashboard. Here you can see your upcoming services, active requests, and quick access to common features. Tap any card to get more details or take action.",
        true,
      );
      break;

    case "service request":
      speak(
        "This is the service request page. You can request assistance by selecting a service type, filling in the details, and submitting your request. Voice input is available for all fields.",
        true,
      );
      break;

    case "profile":
      speak(
        "This is your profile page. You can update your personal information, preferences, and accessibility settings here.",
        true,
      );
      break;

    case "settings":
      speak(
        "This is the settings page. You can adjust voice guidance, text size, contrast, and other accessibility features to make the app easier to use.",
        true,
      );
      break;

    default:
      speak(
        "You're currently on the " +
          screenName +
          " screen. If you need help with a specific feature, please ask.",
        true,
      );
  }

  return true;
};
