import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BreathingCircle } from "./BreathingCircle";
import { Play, Square, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactConfetti from "react-confetti";

type MeditationPhase = "ready" | "breathing" | "hold-out" | "hold-in" | "final-exhale" | "completed";
type BreathingPhase = "inhale" | "exhale" | "hold-out" | "hold-in" | "final-exhale" | "completed";

export const TummoTimer = () => {
  const [phase, setPhase] = useState<MeditationPhase>("ready");
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>("inhale");
  const [cycleCount, setCycleCount] = useState(0);
  const [selectedCycles, setSelectedCycles] = useState(15); // Default to 15 cycles
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  
  // Update window dimensions when window resizes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

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
    setNotificationMessage(`Begin your Tummo practice - ${selectedCycles} cycles with ${selectedCycles}-second holds`);
  };
  
  // Calculate hold time based on selected cycles
  const getHoldTime = () => {
    return selectedCycles * 1000; // Convert to milliseconds
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
          if (cycleCount < selectedCycles) {
            // Continue to next cycle
            setCycleCount(prev => prev + 1);
            setBreathingPhase("inhale");
            setTimeRemaining(2000); // 2 seconds for inhale
            
            // Special notification for the last cycle
            if (cycleCount === selectedCycles - 1) {
              setNotificationMessage("Final breathing cycle - prepare for hold phase");
            }
          } else {
            // After final exhale, start hold-out phase
            setPhase("hold-out");
            setBreathingPhase("hold-out");
            const holdTime = getHoldTime();
            setTimeRemaining(holdTime);
            setNotificationMessage(`Now hold your breath out (empty lungs) for ${holdTime/1000} seconds`);
          }
        }
      } else if (phase === "hold-out") {
        // Add a brief transition for breathing in
        setPhase("breathing");
        setBreathingPhase("inhale");
        setTimeRemaining(3000); // 3 seconds to breathe in
        setNotificationMessage("Take a deep breath in");
        
        // Set up a timeout to move to hold-in phase after the breath
        setTimeout(() => {
          if (isActive) { // Only proceed if still active
            setPhase("hold-in");
            setBreathingPhase("hold-in");
            const holdTime = getHoldTime();
            setTimeRemaining(holdTime);
            setNotificationMessage(`Hold your breath (full lungs) for ${holdTime/1000} seconds`);
          }
        }, 3000);
      } else if (phase === "hold-in") {
        // Move to final exhale phase
        setPhase("final-exhale");
        setBreathingPhase("final-exhale");
        setTimeRemaining(3000); // 3 seconds for final exhale
        setNotificationMessage("Now release your breath completely and relax.");
      } else if (phase === "final-exhale") {
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
    const holdSeconds = selectedCycles;
    
    switch (phase) {
      case "ready":
        return "Prepare yourself for the Tummo breathing practice. Select your cycle count below.";
      case "breathing":
        return `Follow the breathing pattern: 2 seconds in, 2 seconds out, for ${selectedCycles} cycles.`;
      case "hold-out":
        return `Hold your breath out (empty lungs) for ${holdSeconds} seconds.`;
      case "hold-in":
        return `Take a deep breath and hold it in (full lungs) for ${holdSeconds} seconds.`;
      case "final-exhale":
        return "Now release your breath completely and relax.";
      case "completed":
        return "Well done! Your inner flame has been completed. Take a moment to feel the warmth within.";
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
        <CardContent className="space-y-8 card-content-fixed">
          {/* Fixed height container for all UI elements */}
          <div className="flex flex-col min-h-[180px] relative">
            {/* Phase description with fixed height */}
            <div className="text-center h-16 flex items-center justify-center">
              <p className="text-muted-foreground">{getPhaseDescription()}</p>
            </div>
            
            {/* Confetti Explosion for completion */}
            {phase === "completed" && (
              <div className="fixed inset-0 z-50 pointer-events-none">
                <ReactConfetti
                  width={windowDimensions.width}
                  height={windowDimensions.height}
                  recycle={true}
                  run={true}
                  numberOfPieces={500}
                  gravity={0.2}
                  initialVelocityX={10}
                  initialVelocityY={10}
                  tweenDuration={5000}
                  colors={["#FF5252", "#FFD740", "#40C4FF", "#69F0AE", "#FF4081", "#7C4DFF"]}
                />
              </div>
            )}
            
            {/* Configuration UI container with absolute positioning */}
            <div className="relative h-[120px]">
              {/* Cycle Selection UI - Absolute positioned to prevent layout shifts */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-start pt-2
                  transition-all duration-300 ${phase === "ready" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <div className="flex justify-center space-x-4 mb-4">
                  {[5, 10, 15].map((cycles) => (
                    <Button 
                      key={cycles}
                      onClick={() => setSelectedCycles(cycles)}
                      className={cn(
                        "px-6 py-2 min-w-[80px]",
                        selectedCycles === cycles 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                      )}
                      disabled={phase !== "ready"}
                    >
                      {cycles} Cycles
                    </Button>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">{selectedCycles === 5 ? "Beginner" : selectedCycles === 10 ? "Intermediate" : "Advanced"}</span> - 
                    {selectedCycles}-second hold phases
                  </p>
                  <p className="text-xs">
                    {selectedCycles === 5 
                      ? "Shorter practice for beginners" 
                      : selectedCycles === 10 
                        ? "Balanced practice for regular meditators" 
                        : "Full practice for experienced practitioners"}
                  </p>
                </div>
              </div>
              
              {/* Practice information - Absolute positioned to overlay in the same space */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center
                  transition-all duration-300 ${phase !== "ready" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {notificationMessage && phase !== "ready" && (
                  <p className="text-primary font-medium mb-4 fade-in-up">{notificationMessage}</p>
                )}
                
                {/* Timer display */}
                {(phase === "hold-out" || phase === "hold-in") && timeRemaining > 0 && (
                  <div className="text-2xl font-bold text-primary fade-in-up">
                    {formatTime(timeRemaining)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Breathing Circle - Fixed size container */}
          <div className="flex justify-center items-center h-[320px]">
            <BreathingCircle 
              phase={breathingPhase} 
              cycleCount={cycleCount} 
              totalCycles={selectedCycles} 
            />
          </div>

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
