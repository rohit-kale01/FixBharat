import type { Priority, ComplaintStatus, IssueCategory } from '@/types';

export function priorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case 'HIGH':
      return 'badge-high';
    case 'MEDIUM':
      return 'badge-medium';
    case 'LOW':
      return 'badge-low';
    default:
      return 'badge-pending';
  }
}

export function statusBadgeClass(status: ComplaintStatus): string {
  switch (status) {
    case 'RESOLVED':
      return 'badge-resolved';
    case 'WORK_INITIATED':
    case 'DEPARTMENT_ASSIGNED':
    case 'PRIORITY_ASSIGNED':
    case 'AI_VERIFIED':
      return 'badge-progress';
    default:
      return 'badge-pending';
  }
}

export function statusLabel(status: ComplaintStatus): string {
  const labels: Record<ComplaintStatus, string> = {
    PENDING: 'Pending',
    AI_VERIFIED: 'AI Verified',
    PRIORITY_ASSIGNED: 'Priority Assigned',
    DEPARTMENT_ASSIGNED: 'Department Assigned',
    WORK_INITIATED: 'Work Initiated',
    RESOLUTION_PENDING: 'Resolution Pending',
    AI_VERIFICATION: 'AI Verification',
    RESOLVED: 'Resolved',
  };
  return labels[status] ?? status;
}

export function priorityLabel(priority: Priority): string {
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}

export function formatTimeAgo(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatTime(isoString: string): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function formatDate(isoString: string): string {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  navy: { bg: 'bg-navy-50', text: 'text-navy-600' },
  saffron: { bg: 'bg-saffron-50', text: 'text-saffron-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

export function getColorClasses(color: string): { bg: string; text: string } {
  return colorClasses[color] ?? colorClasses.navy;
}

export function issueIconName(issue: IssueCategory): string {
  const map: Record<IssueCategory, string> = {
    Pothole: 'Construction',
    Garbage: 'Trash2',
    'Broken Streetlight': 'Lightbulb',
    'Water Leakage': 'Droplets',
    'Road Damage': 'Construction',
    'Fallen Tree': 'TreePine',
    Other: 'AlertTriangle',
  };
  return map[issue] ?? 'AlertTriangle';
}
