import { Progress } from "./ui/progress";
import { CheckCircle } from "lucide-react";

interface ProgressBarProps {
  percentage: number;
  completedSteps?: string[];
  totalSteps?: number;
}

export function ProgressBar({ 
  percentage, 
  completedSteps = ["Company Info", "Logo Upload"],
  totalSteps = 5 
}: ProgressBarProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium">Profile Completion</h3>
          <p className="text-sm text-muted-foreground">
            {completedSteps.length} of {totalSteps} steps completed
          </p>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
      </div>
      
      <Progress value={percentage} className="h-2 mb-3" />
      
      <div className="space-y-1">
        {completedSteps.slice(0, 2).map((step) => (
          <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600" />
            {step}
          </div>
        ))}
        {completedSteps.length > 2 && (
          <p className="text-sm text-muted-foreground pl-5">
            +{completedSteps.length - 2} more completed
          </p>
        )}
      </div>
    </div>
  );
}