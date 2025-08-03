import { useState, useEffect } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold-out" | "hold-in" | "final-exhale" | "completed";
  cycleCount: number;
  totalCycles: number;
}

export const BreathingCircle = ({ phase, cycleCount, totalCycles }: BreathingCircleProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // Key for forcing animation resets
  const [lastPhase, setLastPhase] = useState<string | null>(null);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "exhale":
        return cycleCount === totalCycles ? "Final Exhale" : "Breathe Out";
      case "hold-out":
        return "Hold Empty";
      case "hold-in":
        return "Hold Full";
      case "final-exhale":
        return "Final Release";
      case "completed":
        return "Complete";
      default:
        return "Ready";
    }
  };

  // Reset animation key when phase changes to force re-render
  useEffect(() => {
    if (phase !== lastPhase) {
      setAnimationKey(prev => prev + 1);
      setLastPhase(phase);
    }
  }, [phase, lastPhase]);

  // Smooth text transitions with fade effect
  useEffect(() => {
    const newText = getPhaseText();
    if (newText !== displayText) {
      setIsTextVisible(false);
      setTimeout(() => {
        setDisplayText(newText);
        setIsTextVisible(true);
      }, 150);
    }
  }, [phase, cycleCount, totalCycles]);

  // Initialize display text
  useEffect(() => {
    setDisplayText(getPhaseText());
  }, []);

  // Get animation class based on phase
  const getAnimationClass = () => {
    switch (phase) {
      case "inhale":
        return "animate-breathe-in";
      case "exhale":
        return "animate-breathe-out";
      case "final-exhale":
        return "animate-breathe-out";
      case "hold-in":
        return "animate-hold-full";
      case "hold-out":
        return "animate-hold-empty";
      case "completed":
        return "animate-completed";
      default:
        return "";
    }
  };
  
  // Get gradient color class based on phase
  const getGradientClass = () => {
    switch (phase) {
      case "hold-in":
        return "from-amber-400 via-orange-500 to-amber-600";
      case "hold-out":
        return "from-orange-400 via-amber-500 to-orange-600";
      default:
        return "from-orange-400 via-orange-500 to-orange-600";
    }
  };

  const isFinalCycle = cycleCount === totalCycles;
  const progressPercentage = totalCycles > 0 ? (cycleCount / totalCycles) * 100 : 0;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] space-y-6">
      {/* Breathing Circle with key-based animation reset */}
      <div className="relative flex items-center justify-center w-52 h-52">
        <div 
          key={animationKey}
          className={`
            w-44 h-44 rounded-full bg-gradient-to-br ${getGradientClass()}
            shadow-2xl ${getAnimationClass()}
          `}
        >
          {/* Inner gradient ring - adapts to phase */}
          <div className={`absolute inset-3 rounded-full bg-gradient-to-br 
            ${phase.includes('hold') ? 'from-amber-300/20 via-transparent to-amber-700/20' : 'from-orange-300/20 via-transparent to-orange-700/20'}`} />
          
          {/* Center focus point */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 shadow-sm" />
          
          {/* Subtle glow effect - adapts to phase */}
          <div className={`absolute inset-0 rounded-full blur-md 
            ${phase.includes('hold') ? 'bg-amber-500/10' : 'bg-orange-500/10'}`} />
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex flex-col items-center space-y-3">
        {cycleCount > 0 && totalCycles > 0 && (
          <div className="w-36 h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ease-out shadow-sm" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Phase Text with Smooth Transitions */}
        <div className="text-center space-y-2">
          <div className="relative h-7 flex items-center justify-center">
            <h2 className={`
              text-lg font-semibold transition-all duration-300 ease-in-out
              ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
              ${isFinalCycle && phase === "exhale" ? "text-orange-400" : "text-white"}
            `}>
              {displayText}
            </h2>
          </div>
          
          {cycleCount > 0 && cycleCount <= totalCycles && (
            <div className="h-5 flex items-center justify-center">
              <p className="text-gray-400 text-xs font-medium transition-opacity duration-300">
                Cycle {cycleCount} of {totalCycles}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
