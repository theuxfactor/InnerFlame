import { TummoTimer } from "@/components/TummoTimer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex flex-col justify-between p-4">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <TummoTimer />
        </div>
      </div>
      
      <footer className="w-full text-center py-4 text-sm text-muted-foreground mt-auto">
        <p>
          Created by ArunG, 2025. Version 1.0.
        </p>
      </footer>
    </div>
  );
};

export default Index;
