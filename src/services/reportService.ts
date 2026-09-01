import type { Complaint, IssueAnalysis, Location, Priority, IssueCategory, Department, AgentAction } from '@/types';
import { generateComplaintId, issueImages } from '@/data/demoData';

// Service layer abstraction — simulates the backend API.
// In production, these methods would call the Spring Boot REST API.
// The UI never talks to business logic directly; it goes through this service.

export interface ReportSubmission {
  image: string;
  location: Location;
  description: string;
}

export interface AnalysisResult {
  analysis: IssueAnalysis;
  duplicates: number;
  riskScore: number;
  priority: Priority;
  department: Department;
  complaintId: string;
  agentActions: AgentAction[];
}

// Simulated AI vision analysis — in production this calls a vision model API
export function analyzeImage(image: string): Promise<IssueAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate detection based on image or default to pothole for demo
      const issues: IssueCategory[] = ['Pothole', 'Garbage', 'Broken Streetlight', 'Water Leakage', 'Road Damage', 'Fallen Tree'];
      const issue = issues[Math.floor(Math.random() * issues.length)];

      const categoryMap: Record<IssueCategory, string> = {
        Pothole: 'Road Infrastructure',
        Garbage: 'Waste Management',
        'Broken Streetlight': 'Electrical Infrastructure',
        'Water Leakage': 'Water Infrastructure',
        'Road Damage': 'Road Infrastructure',
        'Fallen Tree': 'Public Infrastructure',
        Other: 'General',
      };

      const severityMap: Record<IssueCategory, 'High' | 'Medium' | 'Low'> = {
        Pothole: 'High',
        Garbage: 'Medium',
        'Broken Streetlight': 'High',
        'Water Leakage': 'High',
        'Road Damage': 'Medium',
        'Fallen Tree': 'Medium',
        Other: 'Low',
      };

      resolve({
        issue,
        category: categoryMap[issue],
        confidence: 88 + Math.floor(Math.random() * 10),
        severity: severityMap[issue],
        description: `${issue} detected near reported location`,
      });
    }, 2000);
  });
}

// Simulated duplicate detection
export function detectDuplicates(location: Location, issue: IssueCategory): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dupCount = Math.floor(Math.random() * 4);
      resolve(dupCount);
    }, 1500);
  });
}

// Simulated risk score calculation
export function calculateRiskScore(severity: string, duplicates: number): Promise<{ score: number; priority: Priority }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let base = severity === 'High' ? 70 : severity === 'Medium' ? 45 : 25;
      base += duplicates * 5;
      base += Math.floor(Math.random() * 10);
      const score = Math.min(base, 99);
      const priority: Priority = score >= 70 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW';
      resolve({ score, priority });
    }, 1500);
  });
}

// Simulated department routing
export function routeDepartment(issue: IssueCategory): Promise<Department> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const map: Record<IssueCategory, Department> = {
        Pothole: 'Road Maintenance Department',
        Garbage: 'Waste Management Department',
        'Broken Streetlight': 'Electrical Department',
        'Water Leakage': 'Water Department',
        'Road Damage': 'Road Maintenance Department',
        'Fallen Tree': 'Parks & Horticulture Department',
        Other: 'General Municipal Services',
      };
      resolve(map[issue]);
    }, 1200);
  });
}

// Simulated resolution verification
export function verifyResolution(beforeImage: string, afterImage: string): Promise<{ confidence: number; result: 'VERIFIED' | 'REJECTED' }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        confidence: 90 + Math.floor(Math.random() * 8),
        result: 'VERIFIED',
      });
    }, 2500);
  });
}

// Full report submission — orchestrates the entire AI workflow
export async function submitReport(submission: ReportSubmission): Promise<AnalysisResult> {
  const analysis = await analyzeImage(submission.image);
  const duplicates = await detectDuplicates(submission.location, analysis.issue);
  const { score: riskScore, priority } = await calculateRiskScore(analysis.severity, duplicates);
  const department = await routeDepartment(analysis.issue);
  const complaintId = generateComplaintId();

  const now = new Date().toISOString();
  const agentActions: AgentAction[] = [
    { id: 'a1', agent: 'Vision Agent', tool: 'analyzeImage()', input: 'Image: report_image.jpg', output: `${analysis.issue} detected, confidence: ${analysis.confidence}%, severity: ${analysis.severity}`, timestamp: now },
    { id: 'a2', agent: 'Location Agent', tool: 'reverseGeocode()', input: `Lat: ${submission.location.latitude}, Lng: ${submission.location.longitude}`, output: `${submission.location.nearbyRoad}, ${submission.location.area}, ${submission.location.city}`, timestamp: now },
    { id: 'a3', agent: 'Duplicate Detection Agent', tool: 'searchNearbyComplaints()', input: 'Radius: 120m', output: `${duplicates} similar complaints found`, timestamp: now },
    { id: 'a4', agent: 'Priority Agent', tool: 'calculateRiskScore()', input: `Severity: ${analysis.severity}, Duplicates: ${duplicates}`, output: `Risk Score: ${riskScore}/100, Priority: ${priority}`, timestamp: now },
    { id: 'a5', agent: 'Routing Agent', tool: 'findDepartment()', input: `Issue: ${analysis.issue}`, output: department, timestamp: now },
    { id: 'a6', agent: 'Action Agent', tool: 'createComplaint()', input: `Issue: ${analysis.issue}, Priority: ${priority}`, output: `Complaint ${complaintId} created`, timestamp: now },
    { id: 'a7', agent: 'Follow-up Agent', tool: 'scheduleMonitoring()', input: `Complaint: ${complaintId}`, output: 'SLA monitoring started', timestamp: now },
  ];

  return {
    analysis,
    duplicates,
    riskScore,
    priority,
    department,
    complaintId,
    agentActions,
  };
}

export function createComplaintFromReport(submission: ReportSubmission, result: AnalysisResult): Complaint {
  const now = new Date().toISOString();
  return {
    id: result.complaintId,
    issue: result.analysis.issue,
    category: result.analysis.category,
    priority: result.priority,
    status: 'WORK_INITIATED',
    riskScore: result.riskScore,
    aiConfidence: result.analysis.confidence,
    location: submission.location,
    department: result.department,
    slaHours: result.priority === 'HIGH' ? 24 : 48,
    slaRemaining: result.priority === 'HIGH' ? 24 : 48,
    createdAt: now,
    image: submission.image || issueImages[result.analysis.issue],
    description: submission.description,
    duplicateCount: result.duplicates,
    duplicates: [],
    timeline: [
      { id: 't1', step: 1, label: 'Reported', timestamp: now, status: 'completed', description: 'Citizen submitted report with photo and location.' },
      { id: 't2', step: 2, label: 'AI Verified', agent: 'Vision Agent', timestamp: now, status: 'completed', description: `Vision Agent detected ${result.analysis.issue} with ${result.analysis.confidence}% confidence.` },
      { id: 't3', step: 3, label: 'Priority Assigned', agent: 'Priority Agent', timestamp: now, status: 'completed', description: `Risk score calculated: ${result.riskScore}/100. Priority: ${result.priority}.` },
      { id: 't4', step: 4, label: 'Department Assigned', agent: 'Routing Agent', timestamp: now, status: 'completed', description: `Routed to ${result.department}.` },
      { id: 't5', step: 5, label: 'Work Initiated', agent: 'Action Agent', timestamp: now, status: 'completed', description: 'Department accepted. Work order created.' },
      { id: 't6', step: 6, label: 'Resolution Pending', agent: 'Follow-up Agent', timestamp: now, status: 'active', description: 'SLA monitoring active.' },
      { id: 't7', step: 7, label: 'AI Verification', agent: 'Resolution Verification Agent', timestamp: '', status: 'pending', description: 'Awaiting resolution evidence.' },
      { id: 't8', step: 8, label: 'Resolved', timestamp: '', status: 'pending', description: 'Complaint will be closed after verification.' },
    ],
    agentActions: result.agentActions,
  };
}
