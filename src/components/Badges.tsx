import type { Priority, ComplaintStatus } from '@/types';
import { priorityBadgeClass, statusBadgeClass, statusLabel, priorityLabel } from '@/lib/utils';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={priorityBadgeClass(priority)}>{priorityLabel(priority)}</span>;
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={statusBadgeClass(status)}>{statusLabel(status)}</span>;
}
