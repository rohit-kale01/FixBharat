import { Link } from 'react-router-dom';
import {
  Shield, Eye, Route, Bell, ShieldCheck, ArrowRight, Zap, MapPin,
  Copy, Gauge, Activity, CheckCircle2, AlertCircle, Sparkles, TrendingUp,
  Clock, FileText, Layers, Cpu, Globe, Lock,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import SectionHeader from '@/components/SectionHeader';
import { dashboardStats } from '@/data/demoData';
import { getColorClasses } from '@/lib/utils';

const workflowSteps = [
  { label: 'REPORT', icon: FileText, color: 'text-blue-500' },
  { label: 'UNDERSTAND', icon: Eye, color: 'text-cyan-500' },
  { label: 'VERIFY', icon: ShieldCheck, color: 'text-emerald-500' },
  { label: 'ROUTE', icon: Route, color: 'text-amber-500' },
  { label: 'ACT', icon: Zap, color: 'text-saffron-500' },
  { label: 'FOLLOW UP', icon: Bell, color: 'text-pink-500' },
  { label: 'RESOLVE', icon: CheckCircle2, color: 'text-green2-500' },
];

const whyCards = [
  { icon: Eye, title: 'AI Understands', desc: 'Automatically analyzes images, descriptions, and locations to identify the civic issue.', color: 'blue' },
  { icon: Route, title: 'AI Routes', desc: 'Determines the right department and priority level without human intervention.', color: 'amber' },
  { icon: Bell, title: 'AI Follows Up', desc: 'Tracks SLA deadlines and escalates unresolved complaints automatically.', color: 'pink' },
  { icon: ShieldCheck, title: 'AI Verifies', desc: 'Uses before-and-after evidence to verify whether the issue was actually resolved.', color: 'emerald' },
];

const lifecycleSteps = [
  { num: '01', label: 'Citizen Report', desc: 'Citizen uploads photo and shares location' },
  { num: '02', label: 'AI Issue Detection', desc: 'Vision Agent identifies the problem' },
  { num: '03', label: 'Location Identification', desc: 'Location Agent reverse-geocodes coordinates' },
  { num: '04', label: 'Duplicate Detection', desc: 'Duplicate Agent finds similar nearby reports' },
  { num: '05', label: 'Severity Analysis', desc: 'Priority Agent calculates risk score' },
  { num: '06', label: 'Department Routing', desc: 'Routing Agent selects the right department' },
  { num: '07', label: 'Complaint Creation', desc: 'Action Agent creates ticket with SLA' },
  { num: '08', label: 'SLA Monitoring', desc: 'Follow-up Agent tracks deadlines' },
  { num: '09', label: 'Resolution Verification', desc: 'Verification Agent compares before/after' },
  { num: '10', label: 'Complaint Closure', desc: 'Verified complaint is automatically closed' },
];

type CellValue = boolean | 'partial';
const competitors: { feature: string; traditional: CellValue; manual: CellValue; chatbot: CellValue; bharatfix: CellValue }[] = [
  { feature: 'Report a problem', traditional: true, manual: true, chatbot: true, bharatfix: true },
  { feature: 'AI image understanding', traditional: false, manual: false, chatbot: 'partial', bharatfix: true },
  { feature: 'Automatic prioritization', traditional: false, manual: false, chatbot: false, bharatfix: true },
  { feature: 'Automatic department routing', traditional: false, manual: false, chatbot: false, bharatfix: true },
  { feature: 'SLA monitoring', traditional: 'partial', manual: false, chatbot: false, bharatfix: true },
  { feature: 'Autonomous follow-up', traditional: false, manual: false, chatbot: false, bharatfix: true },
  { feature: 'Resolution verification', traditional: false, manual: false, chatbot: false, bharatfix: true },
];

const scalabilityLevels = [
  { label: 'Single Citizen', desc: 'One person reports one problem', icon: FileText },
  { label: 'Single City', desc: 'City-wide deployment across departments', icon: MapPin },
  { label: 'Multiple Cities', desc: 'Multi-city rollout with shared AI models', icon: Layers },
  { label: 'State-Level', desc: 'State-wide civic AI infrastructure', icon: Globe },
  { label: 'National AI Workforce', desc: 'National civic resolution network', icon: Cpu },
];

function Check() {
  return <CheckCircle2 className="w-5 h-5 text-green2-500" />;
}
function Cross() {
  return <AlertCircle className="w-5 h-5 text-red-400" />;
}
function Partial() {
  return <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /></div>;
}

function Cell({ value }: { value: boolean | 'partial' }) {
  if (value === true) return <Check />;
  if (value === 'partial') return <Partial />;
  return <Cross />;
}

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-12 pb-20 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-saffron-400" />
                <span className="text-sm font-medium text-saffron-300">Autonomous AI Workforce for Civic Resolution</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 font-display tracking-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl sm:text-2xl text-saffron-400 font-semibold mb-4">
                {t('hero.tagline')}
              </p>
              <p className="text-navy-300 text-lg mb-8 max-w-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/report" className="btn-primary">
                  {t('hero.cta.report')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/agents" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                  {t('hero.cta.workforce')}
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-navy-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green2-400 animate-pulse" />
                  <span>AI Workforce Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure & Encrypted</span>
                </div>
              </div>
            </div>

            {/* Hero Dashboard Preview */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="card p-5 shadow-2xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-saffron-400" />
                    </div>
                    <span className="font-semibold text-navy-900 text-sm">BharatFix Command Center</span>
                  </div>
                  <span className="badge-resolved">
                    <div className="w-1.5 h-1.5 rounded-full bg-green2-500 animate-pulse" />
                    Operational
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Total', value: '1,248', color: 'text-navy-900' },
                    { label: 'Active', value: '342', color: 'text-amber-600' },
                    { label: 'Resolved', value: '286', color: 'text-green2-600' },
                  ].map((s) => (
                    <div key={s.label} className="bg-navy-50 rounded-xl p-3">
                      <p className="text-xs text-navy-500 mb-1">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { agent: 'Vision Agent', status: 'Detected pothole — 96% confidence', icon: Eye, color: 'text-blue-500' },
                    { agent: 'Priority Agent', status: 'Risk score: 87/100 — HIGH', icon: Gauge, color: 'text-amber-500' },
                    { agent: 'Routing Agent', status: 'Road Maintenance Dept.', icon: Route, color: 'text-cyan-500' },
                    { agent: 'Action Agent', status: 'Complaint BF-1024 created', icon: Zap, color: 'text-saffron-500' },
                  ].map((a, i) => (
                    <div key={a.agent} className="flex items-center gap-3 p-2.5 rounded-lg bg-navy-50/50 animate-fade-in" style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                      <a.icon className={`w-4 h-4 ${a.color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-navy-800">{a.agent}</p>
                        <p className="text-xs text-navy-500 truncate">{a.status}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green2-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-3 -right-3 w-20 h-20 bg-saffron-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-navy-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW STRIP */}
      <section className="bg-white border-b border-navy-100 py-6">
        <div className="section-container">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {workflowSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-navy-600 tracking-wider">{step.label}</span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-navy-300 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BHARATFIX */}
      <section className="py-20 bg-navy-50">
        <div className="section-container">
          <SectionHeader
            center
            eyebrow="Why BharatFix?"
            title="Four AI agents. One autonomous workflow."
            subtitle="Each agent specializes in one step of the resolution process, working together to move complaints from report to verified fix."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((card, i) => (
              <div key={card.title} className="card-hover p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-12 h-12 rounded-xl ${getColorClasses(card.color).bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${getColorClasses(card.color).text}`} />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{card.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP SECTION */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <SectionHeader
            eyebrow="The Difference"
            title="Existing systems help citizens report problems. BharatFix helps move those problems toward resolution."
            subtitle="Traditional portals stop at filing. BharatFix takes the complaint all the way to a verified fix."
          />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-navy-900">Traditional Systems</h3>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 mb-3">
                <span className="text-2xl font-bold text-red-600">Report</span>
                <ArrowRight className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold text-red-600">Wait</span>
              </div>
              <p className="text-sm text-navy-500">Citizens file a complaint and then wait. No visibility, no follow-up, no verification.</p>
            </div>

            <div className="card p-8 border-green2-100 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-green2-600" />
                <h3 className="text-lg font-bold text-navy-900">BharatFix</h3>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 p-4 rounded-xl bg-green2-50 mb-3">
                {['Report', 'Understand', 'Verify', 'Prioritize', 'Route', 'Act', 'Follow Up', 'Verify Resolution'].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-green2-700">{step}</span>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-green2-400" />}
                  </div>
                ))}
              </div>
              <p className="text-sm text-navy-500">AI agents handle every step autonomously — from understanding the issue to verifying the repair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="py-20 bg-navy-950 text-white">
        <div className="section-container">
          <SectionHeader
            center
            eyebrow="One Complaint. One Autonomous Workflow."
            title="The complete lifecycle of a BharatFix complaint"
            subtitle="From the moment a citizen reports to the moment the issue is verified and closed — every step is handled by specialized AI agents."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {lifecycleSteps.map((step, i) => (
              <div key={step.num} className="relative p-5 rounded-xl bg-navy-800/50 border border-navy-700 hover:border-saffron-500/50 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="text-3xl font-bold text-saffron-500/30 font-display">{step.num}</span>
                <h4 className="text-sm font-semibold text-white mt-2 mb-1">{step.label}</h4>
                <p className="text-xs text-navy-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <SectionHeader
            center
            eyebrow="Prototype Simulation Metrics"
            title="What the AI workforce has processed"
            subtitle="These are simulated metrics from the BharatFix prototype — not real-world deployment statistics."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, label: 'Reports Processed', value: '1,248', color: 'blue' },
              { icon: Eye, label: 'AI Classification Accuracy', value: '83%', color: 'cyan' },
              { icon: AlertCircle, label: 'Active Issues', value: '342', color: 'amber' },
              { icon: CheckCircle2, label: 'Issues Resolved', value: '286', color: 'green' },
            ].map((stat, i) => (
              <div key={stat.label} className="card p-6 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-14 h-14 rounded-2xl ${getColorClasses(stat.color).bg} flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-7 h-7 ${getColorClasses(stat.color).text}`} />
                </div>
                <p className="text-3xl font-bold text-navy-900 mb-1">{stat.value}</p>
                <p className="text-sm text-navy-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-navy-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Prototype Simulation — Demo data, not real deployment statistics</span>
          </div>
        </div>
      </section>

      {/* COMPETITOR COMPARISON */}
      <section className="py-20 bg-navy-50">
        <div className="section-container">
          <SectionHeader
            eyebrow="How BharatFix Compares"
            title="Not just another complaint portal"
            subtitle="BharatFix goes beyond reporting — it moves complaints toward resolution autonomously."
          />
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50 border-b border-navy-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-navy-700">Capability</th>
                    <th className="text-center px-4 py-4 text-sm font-semibold text-navy-700">Traditional Portals</th>
                    <th className="text-center px-4 py-4 text-sm font-semibold text-navy-700">Manual Handling</th>
                    <th className="text-center px-4 py-4 text-sm font-semibold text-navy-700">Generic AI Chatbots</th>
                    <th className="text-center px-4 py-4 text-sm font-semibold text-saffron-600 bg-saffron-50">BharatFix</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/30'}>
                      <td className="px-6 py-4 text-sm font-medium text-navy-800">{row.feature}</td>
                      <td className="text-center px-4 py-4"><Cell value={row.traditional} /></td>
                      <td className="text-center px-4 py-4"><Cell value={row.manual} /></td>
                      <td className="text-center px-4 py-4"><Cell value={row.chatbot} /></td>
                      <td className="text-center px-4 py-4 bg-saffron-50/50"><Cell value={row.bharatfix} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SCALABILITY */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <SectionHeader
            center
            eyebrow="Built to Scale"
            title="From one citizen to a national AI workforce"
            subtitle="The architecture supports everything from a single complaint to a national civic resolution network."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {scalabilityLevels.map((level, i) => (
              <div key={level.label} className="relative">
                <div className="card p-5 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mx-auto mb-3">
                    <level.icon className="w-6 h-6 text-navy-600" />
                  </div>
                  <h4 className="text-sm font-bold text-navy-900 mb-1">{level.label}</h4>
                  <p className="text-xs text-navy-500">{level.desc}</p>
                </div>
                {i < scalabilityLevels.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-navy-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AI */}
      <section className="py-16 bg-navy-50">
        <div className="section-container">
          <div className="card p-8 border-l-4 border-l-saffron-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-saffron-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Responsible AI</h3>
                <p className="text-navy-600 leading-relaxed">
                  AI assists decisions; humans remain accountable. BharatFix recommends classification, priority, routing,
                  and resolution verification — but authorities retain final control for real-world actions.
                  The AI does not guarantee correct decisions; it augments human judgment with speed and consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-950 text-white">
        <div className="section-container text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to see it in action?</h2>
          <p className="text-navy-300 text-lg mb-8 max-w-2xl mx-auto">
            Watch the complete journey — from citizen report to AI-verified resolution — in under 3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo" className="btn-primary">
              <Zap className="w-4 h-4" />
              {t('demo.start')}
            </Link>
            <Link to="/report" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-all active:scale-95">
              {t('hero.cta.report')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
