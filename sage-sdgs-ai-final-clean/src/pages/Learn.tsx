import { useState } from 'react';
import { Heart, GraduationCap, Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import { sdgData } from '../data/sdg';
import { SDGInfo } from '../types';

const sdgIcons: Record<string, React.ElementType> = {
  Heart,
  GraduationCap,
  Leaf,
};

function SDGCard({ sdg }: { sdg: SDGInfo }) {
  const [expanded, setExpanded] = useState<string | null>('meaning');

  const sections = [
    { id: 'meaning', title: 'Meaning', content: sdg.description },
    { id: 'why', title: 'Why It Matters', content: sdg.whyItMatters },
    { id: 'problems', title: 'Common Problems', content: sdg.commonProblems },
    { id: 'actions', title: 'Practical Actions', content: sdg.practicalActions },
  ];

  const Icon = sdgIcons[sdg.icon] || Heart;

  return (
    <div className="glass-card overflow-hidden">
      <div className={`${sdg.color} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium opacity-90">SDG {sdg.number}</div>
            <h3 className="text-xl font-bold">{sdg.name}</h3>
          </div>
        </div>
      </div>

      <div className="p-4">
        {sections.map((section) => {
          const isExpanded = expanded === section.id;
          const isArray = Array.isArray(section.content);

          return (
            <div key={section.id} className="border-b border-slate-100 last:border-0">
              <button
                onClick={() => setExpanded(isExpanded ? null : section.id)}
                className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="font-medium text-slate-900">{section.title}</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="pb-4 px-2 animate-fade-in">
                  {isArray ? (
                    <ul className="space-y-2">
                      {(section.content as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className={`w-1.5 h-1.5 rounded-full ${sdg.color} mt-2 flex-shrink-0`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed">{section.content as string}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Learn() {
  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            SDG Learning Center
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore the Sustainable Development Goals we focus on. Learn what each goal means,
            why it matters, the challenges we face, and practical actions you can take.
          </p>
        </div>

        {/* SDG Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {sdgData.map((sdg) => (
            <SDGCard key={sdg.number} sdg={sdg} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Want to Learn More?
          </h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Chat with our specialized AI agents to dive deeper into any SDG topic,
            ask questions, and get personalized guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/chat/sage-core" className="btn-secondary">
              Explore All SDGs
            </a>
            <a href="/chat/quality-education" className="btn-secondary">
              Learn About Education
            </a>
            <a href="/chat/climate-action" className="btn-secondary">
              Climate Action
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
