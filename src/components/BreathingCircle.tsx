import { useEffect, useState } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold-out" | "hold-in" | "completed";
  cycleCount: number;
}

export const BreathingCircle = ({ phase, cycleCount }: BreathingCircleProps) => {
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    console.log("BreathingCircle phase changed to:", phase);
    // Force re-render of animation by changing key
    setKey(prev => prev + 1);
  }, [phase]);
  
  const getCircleClass = () => {
    switch (phase) {
      case "inhale":
        return "animate-breathe-in";
      case "exhale":
        return "animate-breathe-out";
      case "hold-out":
        return "scale-75 opacity-60 transition-all duration-1000 ease-in-out";
      case "hold-in":
        return "scale-125 opacity-100 transition-all duration-1000 ease-in-out";
      case "completed":
        return "scale-100 opacity-90 transition-all duration-1000 ease-in-out";
      default:
        return "scale-100 opacity-80 transition-all duration-500 ease-in-out";
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "exhale":
        return "Breathe Out";
      case "hold-out":
        return "Hold (Empty)";
      case "hold-in":
        return "Hold (Full)";
      case "completed":
        return "Complete";
      default:
        return "Prepare";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Breathing Circle */}
      <div className="relative">
        <div
          key={key}
          className={`w-64 h-64 rounded-full bg-gradient-to-br from-primary via-accent to-primary 
            ${getCircleClass()} shadow-lg`}
        />
        
        {/* Inner circle with flame effect */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        
        {/* Center dot */}
        <div className="absolute inset-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/80" />
      </div>

      {/* Phase instruction */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{getPhaseText()}</h2>
        {cycleCount > 0 && cycleCount <= 10 && (
          <p className="text-muted-foreground">Cycle {cycleCount} of 10</p>
        )}
      </div>
    </div>
  );
};
