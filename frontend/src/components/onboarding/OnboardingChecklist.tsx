import React from 'react';
import { Building2, Users, DollarSign, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StepProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const ChecklistStep: React.FC<StepProps> = ({ icon: Icon, title, description, isCompleted, isCurrent, onClick }) => {
  return (
    <div 
      className={cn(
        "flex flex-col relative p-4 rounded-xl transition-all",
        isCurrent ? "bg-white shadow-sm border border-brand-100" : "hover:bg-neutral-50 cursor-pointer border border-transparent",
        isCompleted && "opacity-75"
      )}
      onClick={onClick}
    >
      <div className="flex items-center mb-2 gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isCompleted ? "bg-success-100 text-success-600" : isCurrent ? "bg-brand-100 text-brand-600" : "bg-neutral-100 text-neutral-400"
        )}>
          {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
        </div>
        <h4 className={cn("text-sm font-semibold", isCompleted ? "text-neutral-500 line-through" : "text-neutral-900")}>
          {title}
        </h4>
      </div>
      <p className="text-xs text-neutral-500 pl-11">{description}</p>
    </div>
  );
};

export const OnboardingChecklist: React.FC<{
  steps: { id: string; title: string; description: string; completed: boolean; path: string }[];
  onNavigate: (path: string) => void;
}> = ({ steps, onNavigate }) => {
  const icons = [Building2, Users, DollarSign];
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4 relative">
      {steps.map((step, i) => {
        const isCurrent = !step.completed && (i === 0 || steps[i - 1].completed);
        return (
          <div key={step.id} className="flex-1">
            <ChecklistStep
              icon={icons[i]}
              title={step.title}
              description={step.description}
              isCompleted={step.completed}
              isCurrent={isCurrent}
              onClick={() => onNavigate(step.path)}
            />
          </div>
        );
      })}
    </div>
  );
};
