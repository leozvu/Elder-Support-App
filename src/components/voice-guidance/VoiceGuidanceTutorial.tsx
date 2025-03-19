import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, SkipForward, Repeat, X } from "lucide-react";
import {
  startTutorial,
  nextTutorialStep,
  repeatTutorialStep,
  endTutorial,
  getTutorialStatus,
  provideFeatureGuidance,
} from "@/lib/voice-guidance";

interface VoiceGuidanceTutorialProps {
  featureName?: string;
  onComplete?: () => void;
  onClose?: () => void;
  className?: string;
}

const VoiceGuidanceTutorial: React.FC<VoiceGuidanceTutorialProps> = ({
  featureName,
  onComplete,
  onClose,
  className = "",
}) => {
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [progress, setProgress] = useState(0);

  // Start tutorial when component mounts if featureName is provided
  useEffect(() => {
    if (featureName) {
      startFeatureTutorial();
    }

    // Check tutorial status periodically
    const intervalId = setInterval(() => {
      const status = getTutorialStatus();
      setTutorialActive(status.active);
      setCurrentStep(status.currentStep);
      setTotalSteps(status.totalSteps);

      if (status.totalSteps > 0) {
        setProgress((status.currentStep / (status.totalSteps - 1)) * 100);
      }

      // If tutorial ended, call onComplete
      if (!status.active && tutorialActive && onComplete) {
        onComplete();
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [featureName, tutorialActive, onComplete]);

  const startFeatureTutorial = () => {
    if (featureName) {
      const started = provideFeatureGuidance(featureName);
      setTutorialActive(started);
    }
  };

  const handleNext = () => {
    const hasMoreSteps = nextTutorialStep();
    if (!hasMoreSteps && onComplete) {
      onComplete();
    }
  };

  const handleRepeat = () => {
    repeatTutorialStep();
  };

  const handleClose = () => {
    endTutorial();
    if (onClose) {
      onClose();
    }
  };

  if (!tutorialActive) {
    return null;
  }

  return (
    <Card className={`shadow-lg border-primary/20 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Volume2 className="h-5 w-5 mr-2 text-primary" />
            Voice Guidance
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleClose}
            aria-label="Close tutorial"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 min-h-[80px] flex items-center justify-center">
            <div className="flex items-center">
              <Mic className="h-5 w-5 mr-3 text-primary animate-pulse" />
              <p className="text-center font-medium">
                {featureName
                  ? `${featureName} Tutorial`
                  : "Voice Guidance Tutorial"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRepeat}
          className="flex items-center"
        >
          <Repeat className="h-4 w-4 mr-1" /> Repeat
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleNext}
          className="flex items-center"
        >
          {currentStep + 1 >= totalSteps ? "Finish" : "Next"}{" "}
          <SkipForward className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceGuidanceTutorial;
