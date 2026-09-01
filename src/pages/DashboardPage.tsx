import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart, RadialBarChart, RadialBar,
} from 'recharts';
import {
  FileText, AlertCircle, CheckCircle2, Clock, ShieldCheck, TrendingUp,
  ArrowRight, Activity, Zap, AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { dashboardStats, trendData, categoryData, priorityData } from '@/data/demoData';
import SectionHeader from '@/components/SectionHeader';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { formatTimeAgo, getColorClasses } from '@/lib/utils';

const PIE_COLORS = ['#1c2c52', '#f98c0a', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#3b82f6' };

export default function DashboardPage() {
  const { complaints, activity } = useApp();

  const stats = [
    { label: 'Total Reports', value: dashboardStats.totalReports.toLocaleString(), icon: FileText, color: 'blue' },
    { label: 'Active Reports', value: dashboardStats.activeReports, icon: AlertCircle, color: 'amber' },
    { label: 'High Priority', value: dashboardStats.highPriority, icon: AlertTriangle, color: 'red' },
    { label: 'Resolved', value: dashboardStats.resolved, icon: CheckCircle2, color: 'green' },
    { label: 'Avg Resolution', value: dashboardStats.avgResolutionTime, icon: Clock, color: 'navy' },
    { label: 'AI Verification', value: `${dashboardStats.aiVerificationRate}%`, icon: ShieldCheck, color: 'saffron' },
  ];

  const recentComplaints = complaints.slice(0, 5);
  const recentActivity = activity.slice(0, 8);

  return (
    <div className="section-container py-8">
      <SectionHeader
        eyebrow="Command Center"
        title="BharatFix AI Workforce Dashboard"
        subtitle="Real-time overview of civic complaints, AI agent activity, and resolution performance."
      />

      {/* Status bar */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-green2-50 border border-green2-200">
        <div className="w-2.5 h-2.5 rounded-full bg-green2-500 animate-pulse" />
        <span className="text-sm font-medium text-green2-800">All Systems Operational</span>
        <span className="text-xs text-green2-600 ml-auto">8 AI Agents Online</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`w-10 h-10 rounded-xl ${getColorClasses(stat.color).bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${getColorClasses(stat.color).text}`} />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-xs text-navy-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Trend chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900">Complaint Trend</h3>
            <TrendingUp className="w-4 h-4 text-navy-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1c2c52" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1c2c52" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #dae3f2', fontSize: '0.875rem' }}
              />
              <Area type="monotone" dataKey="reports" stroke="#1c2c52" strokeWidth={2} fill="url(#colorReports)" name="Reports" />
              <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900">Issue Categories</h3>
            <Activity className="w-4 h-4 text-navy-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                nameKey="category"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #dae3f2', fontSize: '0.875rem' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryData.map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-navy-600">{cat.category}</span>
                <span className="text-navy-400 ml-auto">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority + Recent complaints */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Priority distribution */}
        <div className="card p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" data={priorityData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="count" cornerRadius={6} background>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS]} />
                ))}
              </RadialBar>
              <Tooltip
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #dae3f2', fontSize: '0.875rem' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {priorityData.map((p) => (
              <div key={p.priority} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: PRIORITY_COLORS[p.priority as keyof typeof PRIORITY_COLORS] }} />
                  <span className="text-navy-600">{p.priority}</span>
                </div>
                <span className="font-semibold text-navy-900">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent complaints */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900">Recent Complaints</h3>
            <Link to="/complaints" className="text-sm text-saffron-600 font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentComplaints.map((c) => (
              <Link
                key={c.id}
                to={`/complaint/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-navy-400">{c.id}</span>
                    <span className="text-sm font-medium text-navy-900">{c.issue}</span>
                  </div>
                  <p className="text-xs text-navy-400 mt-0.5">{c.location.area} · {formatTimeAgo(c.createdAt)}</p>
                </div>
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Live activity feed */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-saffron-500" />
            Live Agent Activity
          </h3>
          <Link to="/agents" className="text-sm text-saffron-600 font-medium hover:underline">
            View All Agents
          </Link>
        </div>
        <div className="space-y-1">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-navy-50 transition-colors">
              <span className="text-xs font-mono text-navy-400 shrink-0 w-16">{formatTimeAgo(item.timestamp)}</span>
              <div className="w-2 h-2 rounded-full bg-saffron-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-navy-800">{item.agent}</span>
                <span className="text-sm text-navy-500"> — {item.action}</span>
              </div>
              {item.complaintId && (
                <Link to={`/complaint/${item.complaintId}`} className="text-xs text-saffron-600 font-mono hover:underline shrink-0">
                  {item.complaintId}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
