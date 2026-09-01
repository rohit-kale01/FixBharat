import { Link } from 'react-router-dom';
import {
  Eye, MapPin, Copy, Gauge, Route, Zap, Bell, ShieldCheck,
  CheckCircle2, Loader2, Activity, Cpu, ArrowRight, Clock,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { agents as agentData } from '@/data/demoData';
import { formatTimeAgo, formatTime } from '@/lib/utils';
import type { AgentName } from '@/types';
import SectionHeader from '@/components/SectionHeader';

const agentIcons: Record<string, typeof Eye> = {
  'Vision Agent': Eye,
  'Location Agent': MapPin,
  'Duplicate Detection Agent': Copy,
  'Priority Agent': Gauge,
  'Routing Agent': Route,
  'Action Agent': Zap,
  'Follow-up Agent': Bell,
  'Resolution Verification Agent': ShieldCheck,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

export default function AgentsPage() {
  const { activity } = useApp();

  return (
    <div className="section-container py-8">
      <SectionHeader
        eyebrow="AI Workforce"
        title="Autonomous AI Agent Command Center"
        subtitle="Eight specialized AI agents work together to move every complaint from report to verified resolution — without human intervention."
      />

      {/* Status bar */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-green2-50 border border-green2-200">
        <div className="w-2.5 h-2.5 rounded-full bg-green2-500 animate-pulse" />
        <span className="text-sm font-medium text-green2-800">All 8 Agents Operational</span>
        <span className="text-xs text-green2-600 ml-auto flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> System Load: Normal</span>
      </div>

      {/* Agent cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {agentData.map((agent, i) => {
          const Icon = agentIcons[agent.name] || Eye;
          const colors = colorMap[agent.color] || colorMap.blue;
          const isProcessing = agent.status === 'PROCESSING';

          return (
            <div key={agent.name} className={`card p-5 border-l-4 ${colors.border} animate-fade-in-up`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-5.5 h-5.5 ${colors.text}`} />
                </div>
                <span className={`badge ${isProcessing ? 'badge-progress' : 'badge-resolved'}`}>
                  {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                  {agent.status === 'ONLINE' ? 'Online' : agent.status === 'PROCESSING' ? 'Processing' : 'Idle'}
                </span>
              </div>
              <h3 className="font-bold text-navy-900 text-sm mb-1">{agent.name}</h3>
              <p className="text-xs text-navy-500 mb-3 leading-relaxed">{agent.purpose}</p>

              <div className="space-y-1.5 pt-3 border-t border-navy-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-navy-400">Tasks Completed</span>
                  <span className="font-semibold text-navy-900">{agent.tasksCompleted.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-navy-400">Current Task</span>
                  <span className={`font-medium ${isProcessing ? 'text-saffron-600' : 'text-navy-600'} truncate ml-2`}>{agent.currentTask}</span>
                </div>
              </div>

              <div className={`mt-3 p-2 rounded-lg ${colors.bg} text-xs`}>
                <p className={`${colors.text} font-medium truncate`}>{agent.lastAction}</p>
                <p className="text-navy-400 mt-0.5">{formatTimeAgo(agent.lastActionTime)}</p>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-navy-400 font-mono">
                <Zap className="w-3 h-3" />
                <span>{agent.tool}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live activity feed */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-saffron-500" />
              Live Agent Activity Feed
            </h3>
            <span className="text-xs text-navy-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green2-500 animate-pulse" /> Real-time</span>
          </div>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {activity.map((item) => {
              const Icon = agentIcons[item.agent as AgentName] || Eye;
              return (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-navy-50 transition-colors">
                  <span className="text-xs font-mono text-navy-400 shrink-0 w-16 mt-0.5">{formatTime(item.timestamp)}</span>
                  <div className={`w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-navy-900">{item.agent}</span>
                      <span className="text-navy-500"> — {item.action}</span>
                    </p>
                    <p className="text-xs text-navy-400 mt-0.5">{item.detail}</p>
                  </div>
                  {item.complaintId && (
                    <Link to={`/complaint/${item.complaintId}`} className="text-xs text-saffron-600 font-mono hover:underline shrink-0 mt-1">
                      {item.complaintId}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Autonomous actions panel */}
        <div className="card p-6">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-saffron-500" />
            Autonomous Actions
          </h3>
          <p className="text-xs text-navy-500 mb-4">Actions the AI workforce performs without human intervention:</p>
          <div className="space-y-2.5">
            {[
              'Classified issue from image',
              'Retrieved location coordinates',
              'Searched duplicate reports',
              'Calculated risk score',
              'Selected responsible department',
              'Created complaint ticket',
              'Scheduled SLA follow-up',
              'Sent citizen notification',
              'Requested resolution evidence',
              'Verified resolution with AI',
            ].map((action, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-5 h-5 rounded-full bg-green2-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green2-500" />
                </div>
                <span className="text-navy-700">{action}</span>
              </div>
            ))}
          </div>
          <Link to="/demo" className="mt-6 btn-primary w-full">
            Watch Full Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tool call visualization */}
      <div className="card p-6 mt-6">
        <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-navy-500" />
          AI Tool Call Visualization
        </h3>
        <p className="text-xs text-navy-500 mb-4">Each agent calls specialized tools to perform its work autonomously:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentData.slice(0, 6).map((agent) => {
            const Icon = agentIcons[agent.name] || Eye;
            const colors = colorMap[agent.color] || colorMap.blue;
            return (
              <div key={agent.name} className="rounded-xl border border-navy-100 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-navy-50">
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                  <span className="text-xs font-semibold text-navy-800">{agent.name}</span>
                </div>
                <div className="p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex gap-2"><span className="text-navy-400 shrink-0">Tool:</span><span className="text-saffron-600 font-semibold">{agent.tool}</span></div>
                  <div className="flex gap-2"><span className="text-navy-400 shrink-0">Output:</span><span className="text-green2-600">{agent.lastAction}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
