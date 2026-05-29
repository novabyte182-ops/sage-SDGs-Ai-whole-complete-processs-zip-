import { TriangleAlert as AlertTriangle } from 'lucide-react';
import { isDemoMode } from '../lib/aiProvider';

export default function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Demo mode is active.</strong> Add your API key in environment variables to enable live AI.
          </span>
        </div>
      </div>
    </div>
  );
}
