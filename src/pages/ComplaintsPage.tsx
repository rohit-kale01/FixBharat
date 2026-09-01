import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { formatTimeAgo } from '@/lib/utils';
import type { Priority, ComplaintStatus, IssueCategory, Department } from '@/types';
import { departments, issueCategories } from '@/data/demoData';

export default function ComplaintsPage() {
  const { complaints } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [issueFilter, setIssueFilter] = useState<IssueCategory | 'ALL'>('ALL');
  const [deptFilter, setDeptFilter] = useState<Department | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.issue.toLowerCase().includes(search.toLowerCase()) && !c.location.area.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
      if (issueFilter !== 'ALL' && c.issue !== issueFilter) return false;
      if (deptFilter !== 'ALL' && c.department !== deptFilter) return false;
      return true;
    });
  }, [complaints, search, statusFilter, priorityFilter, issueFilter, deptFilter]);

  const selectClass = "px-3 py-2 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-saffron-400";

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">All Complaints</h1>
        <p className="text-sm text-navy-500">Browse and manage all civic complaints processed by the AI workforce</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              placeholder="Search by ID, issue, or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'ALL')} className={selectClass}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="AI_VERIFIED">AI Verified</option>
              <option value="PRIORITY_ASSIGNED">Priority Assigned</option>
              <option value="DEPARTMENT_ASSIGNED">Department Assigned</option>
              <option value="WORK_INITIATED">Work Initiated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')} className={selectClass}>
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select value={issueFilter} onChange={(e) => setIssueFilter(e.target.value as IssueCategory | 'ALL')} className={selectClass}>
              <option value="ALL">All Issues</option>
              {issueCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value as Department | 'ALL')} className={selectClass}>
              <option value="ALL">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-navy-500 mb-4">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Table on desktop, cards on mobile */}
      <div className="card overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">SLA</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-navy-700">{c.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-navy-900">{c.issue}</td>
                  <td className="px-4 py-3 text-sm text-navy-600">{c.location.area}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3 text-sm text-navy-600">{c.department.replace(' Department', '')}</td>
                  <td className="px-4 py-3 text-sm text-navy-500">{formatTimeAgo(c.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    {c.slaRemaining > 0 ? (
                      <span className={c.slaRemaining < 6 ? 'text-red-600 font-medium' : 'text-navy-600'}>{c.slaRemaining}h left</span>
                    ) : (
                      <span className="text-red-600 font-medium">Expired</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/complaint/${c.id}`} className="text-saffron-600 hover:text-saffron-700">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((c) => (
          <Link key={c.id} to={`/complaint/${c.id}`} className="card p-4 block">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-navy-400">{c.id}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="font-semibold text-navy-900">{c.issue}</p>
            <p className="text-xs text-navy-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location.nearbyRoad}, {c.location.area}</p>
            <div className="flex items-center justify-between mt-3">
              <PriorityBadge priority={c.priority} />
              <span className="text-xs text-navy-500">{c.department.replace(' Department', '')}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Filter className="w-10 h-10 text-navy-300 mx-auto mb-3" />
          <p className="text-navy-500">No complaints match your filters.</p>
        </div>
      )}
    </div>
  );
}
