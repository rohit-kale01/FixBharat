import { Link } from 'react-router-dom';
import {
  AlertTriangle, Clock, Building2, Activity, CheckCircle2, TrendingUp,
  ArrowRight, Bell, ShieldCheck, Zap, AlertCircle,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { departmentWorkload, slaBreaches, dashboardStats } from '@/data/demoData';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { formatTimeAgo, getColorClasses } from '@/lib/utils';
import SectionHeader from '@/components/SectionHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function AdminPage() {
  const { complaints, activity } = useApp();

  const activeComplaints = complaints.filter((c) => c.status !== 'RESOLVED');
  const highPriority = complaints.filter((c) => c.priority === 'HIGH' && c.status !== 'RESOLVED');
  const resolved = complaints.filter((c) => c.status === 'RESOLVED');

  const workloadData = departmentWorkload.map((d) => ({
    name: d.department.replace(' Department', '').replace(' & Horticulture', ''),
    Active: d.active,
    Resolved: d.resolved,
  }));

  return (
    <div className="section-container py-8">
      <SectionHeader
        eyebrow="Authority View"
        title="Admin Dashboard"
        subtitle="City-wide overview of civic complaints, department workload, SLA breaches, and AI workforce activity."
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Complaints', value: dashboardStats.activeReports, icon: AlertCircle, color: 'amber' },
          { label: 'High Priority', value: dashboardStats.highPriority, icon: AlertTriangle, color: 'red' },
          { label: 'SLA Breaches', value: slaBreaches.length, icon: Clock, color: 'orange' },
          { label: 'Resolved', value: dashboardStats.resolved, icon: CheckCircle2, color: 'green' },
        ].map((stat, i) => (
          <div key={stat.label} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`w-10 h-10 rounded-xl ${getColorClasses(stat.color).bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${getColorClasses(stat.color).text}`} />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-xs text-navy-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* SLA Breaches */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              SLA Breach Alerts
            </h3>
            <span className="badge-high">{slaBreaches.length} overdue</span>
          </div>
          <div className="space-y-3">
            {slaBreaches.map((breach) => (
              <Link
                key={breach.complaintId}
                to={`/complaint/${breach.complaintId}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-navy-900">{breach.complaintId}</span>
                    <PriorityBadge priority={breach.priority} />
                  </div>
                  <p className="text-xs text-navy-500 mt-0.5">{breach.issue} · {breach.department}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-red-600">{breach.overdue}h</p>
                  <p className="text-xs text-navy-400">overdue</p>
                </div>
                <ArrowRight className="w-4 h-4 text-navy-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* AI Activity summary */}
        <div className="card p-6">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-saffron-500" />
            Recent AI Activity
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activity.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-xs">
                <span className="font-mono text-navy-400 shrink-0 w-12">{formatTimeAgo(item.timestamp)}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-navy-800">{item.agent}</span>
                  <p className="text-navy-500 truncate">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department workload chart */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-navy-500" />
            Department Workload
          </h3>
          <TrendingUp className="w-4 h-4 text-navy-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workloadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #dae3f2', fontSize: '0.875rem' }} />
            <Bar dataKey="Active" fill="#f98c0a" radius={[4, 4, 0, 0]} name="Active" />
            <Bar dataKey="Resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department workload table */}
      <div className="card overflow-hidden mb-8">
        <div className="p-4 border-b border-navy-50">
          <h3 className="font-semibold text-navy-900">Department Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase">Department</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-navy-600 uppercase">Active</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-navy-600 uppercase">Resolved</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-navy-600 uppercase">SLA Breaches</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-navy-600 uppercase">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {departmentWorkload.map((d, i) => {
                const rate = d.resolved + d.active > 0 ? Math.round((d.resolved / (d.resolved + d.active)) * 100) : 0;
                return (
                  <tr key={d.department} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/30'}>
                    <td className="px-4 py-3 text-sm font-medium text-navy-900">{d.department}</td>
                    <td className="px-4 py-3 text-center text-sm text-amber-600 font-semibold">{d.active}</td>
                    <td className="px-4 py-3 text-center text-sm text-green2-600 font-semibold">{d.resolved}</td>
                    <td className="px-4 py-3 text-center">
                      {d.slaBreaches > 0 ? (
                        <span className="badge-high">{d.slaBreaches}</span>
                      ) : (
                        <span className="text-sm text-navy-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-20 h-2 rounded-full bg-navy-100 overflow-hidden">
                          <div className="h-full bg-green2-500 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-sm font-medium text-navy-700">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active high priority complaints */}
      <div className="card p-6">
        <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          High Priority Active Complaints
        </h3>
        <div className="space-y-2">
          {highPriority.map((c) => (
            <Link key={c.id} to={`/complaint/${c.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-sm font-mono text-navy-400 shrink-0">{c.id}</span>
              <span className="text-sm font-medium text-navy-900 flex-1 min-w-0 truncate">{c.issue} — {c.location.area}</span>
              <span className="text-xs text-navy-500 shrink-0">{c.department.replace(' Department', '')}</span>
              <StatusBadge status={c.status} />
              <ArrowRight className="w-4 h-4 text-navy-400 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
