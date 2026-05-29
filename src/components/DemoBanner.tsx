import { TriangleAlert as AlertTriangle } from 'lucide-react';

export default function DemoBanner() {
  // Always show until user adds API keys to Supabase Edge Function secrets
  // The Edge Function returns demoMode: true when no AI keys are configured

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Demo mode is active.</strong> Add ANTHROPIC_API_KEY, OPENAI_API_KEY, or NVIDIA_API_KEY to your Supabase Edge Function secrets to enable live AI.
          </span>
        </div>
      </div>
    </div>
  );
}
