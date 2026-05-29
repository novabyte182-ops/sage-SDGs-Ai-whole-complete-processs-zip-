import { Sparkles, Heart, GraduationCap, Leaf, ChartBar as BarChart3, CircleAlert as AlertCircle, Shield } from 'lucide-react';
import { agents } from '../lib/utils';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            About Sage SDGs AI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            An AI-powered assistant designed to help you learn about, engage with,
            and take action on the United Nations Sustainable Development Goals.
          </p>
        </div>

        {/* Mission */}
        <section className="glass-card p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Sage SDGs AI is built to democratize knowledge about the Sustainable Development Goals.
            We believe that understanding these global goals is the first step toward taking meaningful
            action. Our AI agents provide accessible, personalized guidance to help you learn, ask questions,
            and discover practical ways to contribute to a more sustainable world.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The project focuses particularly on SDG 3 (Good Health and Well-being), SDG 4 (Quality Education),
            and SDG 13 (Climate Action) — three interconnected goals that are especially relevant for
            developing countries like Pakistan and communities around the world.
          </p>
        </section>

        {/* Multi-Agent Architecture */}
        <section className="glass-card p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Multi-Agent Design</h2>
          <p className="text-slate-600 mb-6">
            Each AI agent in Sage SDGs AI is specialized for a specific domain, providing expert guidance
            while maintaining a consistent, helpful personality.
          </p>

          <div className="grid gap-4">
            {agents.map((agent) => {
              const icons: Record<string, React.ElementType> = {
                Sparkles,
                Heart,
                GraduationCap,
                Leaf,
                BarChart3,
              };
              const Icon = icons[agent.icon] || Sparkles;

              return (
                <div
                  key={agent.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                >
                  <div className={`w-10 h-10 rounded-xl ${agent.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                      <span className="text-xs text-slate-500">{agent.sdg.join(', ')}</span>
                    </div>
                    <p className="text-sm text-slate-600">{agent.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Focus SDGs */}
        <section className="glass-card p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Focus SDGs</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">SDG 3</span>
              </div>
              <p className="text-sm text-green-800">Good Health and Well-being for all ages</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">SDG 4</span>
              </div>
              <p className="text-sm text-red-800">Quality Education for everyone</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">SDG 13</span>
              </div>
              <p className="text-sm text-emerald-800">Climate Action for our planet</p>
            </div>
          </div>
        </section>

        {/* Important Disclaimers */}
        <section className="glass-card p-6 sm:p-8 border-l-4 border-amber-400">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Important Disclaimers</h2>
              <p className="text-slate-600 text-sm">
                Please read these important notices before using Sage SDGs AI.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl">
              <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Educational Purpose Only
              </h3>
              <p className="text-sm text-amber-800">
                Sage SDGs AI is designed for educational and awareness purposes. While we strive
                for accuracy, AI-generated content may contain errors. Always verify important
                information with official sources.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl">
              <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Not Medical Advice
              </h3>
              <p className="text-sm text-amber-800">
                MindCare and any health-related responses are NOT professional medical advice,
                diagnosis, or treatment. Never disregard professional medical advice or delay
                in seeking it because of something you read in this application.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl">
              <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Emergency Situations
              </h3>
              <p className="text-sm text-amber-800">
                If you or someone you know is in danger, experiencing a medical emergency, or
                having thoughts of self-harm, please contact emergency services immediately.
                Call 15 (Pakistan), 112 (EU), 911 (US), or your local emergency number.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mt-8 text-center text-sm text-slate-500">
          <p className="mb-2">Built with React, TypeScript, Tailwind CSS, Vite, and Supabase</p>
          <p>Powered by AI (Anthropic Claude, OpenAI GPT, or NVIDIA NIM)</p>
        </section>
      </div>
    </div>
  );
}
