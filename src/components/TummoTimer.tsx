import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BreathingCircle } from "./BreathingCircle";
import { Play, Square, RotateCcw } from "lucide-react";

type MeditationPhase = "ready" | "breathing" | "hold-out" | "hold-in" | "completed";
type BreathingPhase = "inhale" | "exhale" | "hold-out" | "hold-in" | "completed";

export const TummoTimer = () => {
  const [phase, setPhase] = useState<MeditationPhase>("ready");
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>("inhale");
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Reset function
  const resetMeditation = () => {
    setPhase("ready");
    setBreathingPhase("inhale");
    setCycleCount(0);
    setTimeRemaining(0);
    setIsActive(false);
    setNotificationMessage("");
  };

  // Start meditation
  const startMeditation = () => {
    setIsActive(true);
    setPhase("breathing");
    setBreathingPhase("inhale");
    setCycleCount(1);
    setTimeRemaining(2000); // 2 seconds for inhale
    setNotificationMessage("Begin your Tummo practice - breathe deeply and mindfully");
  };

  // Stop meditation
  const stopMeditation = () => {
    setIsActive(false);
    resetMeditation();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 100);
      }, 100);
    } else if (isActive && timeRemaining <= 0) {
      // Handle phase transitions
      if (phase === "breathing") {
        if (breathingPhase === "inhale") {
          // Always go to exhale after inhale
          setBreathingPhase("exhale");
          setTimeRemaining(2000); // 2 seconds for exhale
        } else if (breathingPhase === "exhale") {
          if (cycleCount < 10) {
            // Continue to next cycle
            setCycleCount(prev => prev + 1);
            setBreathingPhase("inhale");
            setTimeRemaining(2000); // 2 seconds for inhale
          } else {
            // After 10th exhale, start hold-out phase
            setPhase("hold-out");
            setBreathingPhase("hold-out");
            setTimeRemaining(30000); // 30 seconds hold-out
            setNotificationMessage("Now hold your breath out (empty lungs) for 30 seconds");
          }
        }
      } else if (phase === "hold-out") {
        // Move to hold-in phase - take a breath first
        setPhase("hold-in");
        setBreathingPhase("hold-in");
        setTimeRemaining(30000); // 30 seconds hold-in
        setNotificationMessage("Take a deep breath in and hold (full lungs) for 30 seconds");
      } else if (phase === "hold-in") {
        // Complete the meditation
        setPhase("completed");
        setBreathingPhase("completed");
        setIsActive(false);
        setNotificationMessage("Congratulations! You've completed your Tummo meditation practice.");
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, phase, breathingPhase, cycleCount]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case "ready":
        return "Prepare yourself for the Tummo breathing practice. Find a comfortable seated position.";
      case "breathing":
        return "Follow the breathing pattern: 2 seconds in, 2 seconds out, for 10 cycles.";
      case "hold-out":
        return "Hold your breath out (empty lungs) for 30 seconds.";
      case "hold-in":
        return "Take a deep breath and hold it in (full lungs) for 30 seconds.";
      case "completed":
        return "Well done! Your inner flame has been kindled. Take a moment to feel the warmth within.";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Inner Flame
          </CardTitle>
          <CardDescription className="text-lg">
            Tummo Breathing Meditation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{getPhaseDescription()}</p>
            
            {notificationMessage && (
              <p className="text-primary font-medium mb-4">{notificationMessage}</p>
            )}
            
            {(phase === "hold-out" || phase === "hold-in") && timeRemaining > 0 && (
              <div className="text-2xl font-bold text-primary">
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <BreathingCircle phase={breathingPhase} cycleCount={cycleCount} />

          <div className="flex justify-center space-x-4">
            {!isActive && phase !== "completed" && (
              <Button 
                onClick={startMeditation}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Practice
              </Button>
            )}
            
            {isActive && (
              <Button 
                onClick={stopMeditation}
                variant="destructive"
                className="px-8 py-3"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            )}
            
            <Button 
              onClick={resetMeditation}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
