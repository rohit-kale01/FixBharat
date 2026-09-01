export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type ComplaintStatus =
  | 'PENDING'
  | 'AI_VERIFIED'
  | 'PRIORITY_ASSIGNED'
  | 'DEPARTMENT_ASSIGNED'
  | 'WORK_INITIATED'
  | 'RESOLUTION_PENDING'
  | 'AI_VERIFICATION'
  | 'RESOLVED';

export type IssueCategory =
  | 'Pothole'
  | 'Garbage'
  | 'Broken Streetlight'
  | 'Water Leakage'
  | 'Road Damage'
  | 'Fallen Tree'
  | 'Other';

export type Department =
  | 'Road Maintenance Department'
  | 'Waste Management Department'
  | 'Water Department'
  | 'Electrical Department'
  | 'Parks & Horticulture Department'
  | 'General Municipal Services';

export type AgentName =
  | 'Vision Agent'
  | 'Location Agent'
  | 'Duplicate Detection Agent'
  | 'Priority Agent'
  | 'Routing Agent'
  | 'Action Agent'
  | 'Follow-up Agent'
  | 'Resolution Verification Agent';

export type AgentStatus = 'ONLINE' | 'PROCESSING' | 'IDLE';

export interface Location {
  latitude: number;
  longitude: number;
  nearbyRoad: string;
  area: string;
  city: string;
}

export interface IssueAnalysis {
  issue: IssueCategory;
  category: string;
  confidence: number;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface DuplicateMatch {
  complaintId: string;
  distance: number;
  similarity: number;
  issue: IssueCategory;
  status: ComplaintStatus;
}

export interface TimelineEvent {
  id: string;
  step: number;
  label: string;
  agent?: AgentName;
  timestamp: string;
  status: 'completed' | 'active' | 'pending';
  description: string;
}

export interface AgentAction {
  id: string;
  agent: AgentName;
  tool: string;
  input: string;
  output: string;
  timestamp: string;
}

export interface ResolutionEvidence {
  beforeImage: string;
  afterImage: string;
  beforeAnalysis: string;
  afterAnalysis: string;
  confidence: number;
  result: 'VERIFIED' | 'PENDING' | 'REJECTED';
  verifiedAt: string;
}

export interface Complaint {
  id: string;
  issue: IssueCategory;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  riskScore: number;
  aiConfidence: number;
  location: Location;
  department: Department;
  slaHours: number;
  slaRemaining: number;
  createdAt: string;
  image: string;
  description: string;
  duplicateCount: number;
  duplicates: DuplicateMatch[];
  timeline: TimelineEvent[];
  agentActions: AgentAction[];
  resolutionEvidence?: ResolutionEvidence;
  assignedTo?: string;
}

export interface Agent {
  name: AgentName;
  status: AgentStatus;
  purpose: string;
  tasksCompleted: number;
  currentTask: string;
  lastAction: string;
  lastActionTime: string;
  icon: string;
  tool: string;
  color: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  agent: AgentName;
  action: string;
  detail: string;
  complaintId?: string;
}

export interface Notification {
  id: string;
  complaintId: string;
  message: string;
  timestamp: string;
  type: 'assignment' | 'update' | 'resolution' | 'verification' | 'sla';
  read: boolean;
}

export interface DepartmentWorkload {
  department: Department;
  active: number;
  resolved: number;
  slaBreaches: number;
}

export interface DashboardStats {
  totalReports: number;
  activeReports: number;
  highPriority: number;
  resolved: number;
  avgResolutionTime: string;
  aiVerificationRate: number;
}

export interface TrendDataPoint {
  day: string;
  reports: number;
  resolved: number;
}

export interface CategoryDataPoint {
  category: string;
  count: number;
}

export interface PriorityDataPoint {
  priority: string;
  count: number;
}

export interface LanguageStrings {
  [key: string]: string;
}
