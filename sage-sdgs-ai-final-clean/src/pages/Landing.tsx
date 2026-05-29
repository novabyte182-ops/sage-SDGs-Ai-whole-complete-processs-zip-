import { Link } from 'react-router-dom';
import { Heart, GraduationCap, Leaf, Sparkles, ArrowRight, Shield } from 'lucide-react';

const features = [
  {
    title: 'MindCare',
    subtitle: 'SDG 3',
    description: 'Safe, empathetic mental health support for stress, anxiety, and well-being. Not a replacement for professional care.',
    icon: Heart,
    color: 'bg-green-500',
    link: '/chat/mindcare',
  },
  {
    title: 'Quality Education',
    subtitle: 'SDG 4',
    description: 'Learn about education access, literacy, girls\' education, and practical improvement plans with Pakistan context.',
    icon: GraduationCap,
    color: 'bg-red-500',
    link: '/chat/quality-education',
  },
  {
    title: 'Climate Action',
    subtitle: 'SDG 13',
    description: 'Understand climate change, sustainability, and practical actions for students and communities.',
    icon: Leaf,
    color: 'bg-emerald-500',
    link: '/chat/climate-action',
  },
  {
    title: 'Sage Core',
    subtitle: 'All SDGs',
    description: 'General SDG assistant that explains all 17 goals and routes questions to the right specialist.',
    icon: Sparkles,
    color: 'bg-sage-500',
    link: '/chat/sage-core',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered SDG Guidance
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 text-balance">
              Sage SDGs AI
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 mb-8 text-balance">
              AI-powered guidance for Sustainable Development Goals
            </p>

            <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
              Learn, ask questions, and get guidance on SDG 3 (Good Health), SDG 4 (Quality Education),
              and SDG 13 (Climate Action) from specialized AI agents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Start Chat
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/learn"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Learn SDGs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Focus Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Focus SDGs
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Sage SDGs AI specializes in three interconnected Sustainable Development Goals
              that are crucial for Pakistan and the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="glass-card p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                SDG 3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Good Health and Well-being
              </h3>
              <p className="text-slate-600 text-sm">
                Ensuring healthy lives and promoting well-being for all at all ages.
                Includes mental health support, disease prevention, and healthcare access.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
                SDG 4
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Quality Education
              </h3>
              <p className="text-slate-600 text-sm">
                Ensuring inclusive and equitable quality education and promoting
                lifelong learning opportunities for all.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                SDG 13
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Climate Action
              </h3>
              <p className="text-slate-600 text-sm">
                Taking urgent action to combat climate change and its impacts.
                Building resilience against climate-related hazards and disasters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Meet Your AI Agents
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Each specialized agent is designed to help you learn and take action on specific SDG topics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {feature.subtitle}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sage-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Start chatting
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MindCare Disclaimer */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                MindCare Safety Notice
              </h3>
              <p className="text-amber-800 text-sm">
                MindCare provides general well-being support and is not a substitute for professional mental health care.
                It cannot diagnose conditions or replace emergency services. If you or someone you know is in crisis or
                danger, please contact emergency services immediately: call 15 (Pakistan), 112 (EU), 911 (US), or your
                local emergency number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to Learn and Take Action?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Start a conversation with Sage SDGs AI and explore how you can contribute to
            sustainable development goals.
          </p>
          <Link
            to="/chat"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
