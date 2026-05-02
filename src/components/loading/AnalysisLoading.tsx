import { loadingSteps, witCopies } from './loadingCopies';

interface AnalysisLoadingProps {
  role: 'leader' | 'member';
  currentStep?: number;
}

export default function AnalysisLoading({ role, currentStep = 1 }: AnalysisLoadingProps) {
  const copies = witCopies[role];
  const step = loadingSteps.find((s) => s.step === currentStep) ?? loadingSteps[0];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
      <div className="text-4xl">{step.icon}</div>
      <p className="text-base font-medium text-gray-700">{step.label}</p>
      <p className="text-sm text-gray-400">{copies[currentStep % copies.length]}</p>
    </div>
  );
}
