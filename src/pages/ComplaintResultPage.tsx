import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, ShieldCheck, Gauge, Copy, Zap, Eye, Route, Bell,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Upload, FileText,
  Construction, Trash2, Lightbulb, Droplets, TreePine, AlertTriangle, Loader2,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { formatTimeAgo, formatTime, formatDate } from '@/lib/utils';
import { verifyResolution } from '@/services/reportService';
import { resolvedImages } from '@/data/demoData';
import type { AgentName, IssueCategory } from '@/types';

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

const issueIcons: Record<IssueCategory, typeof Eye> = {
  Pothole: Construction,
  Garbage: Trash2,
  'Broken Streetlight': Lightbulb,
  'Water Leakage': Droplets,
  'Road Damage': Construction,
  'Fallen Tree': TreePine,
  Other: AlertTriangle,
};

export default function ComplaintResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, markResolved, addNotification, addActivity } = useApp();
  const complaint = complaints.find((c) => c.id === id);
  const [showReasoning, setShowReasoning] = useState(false);
  const [showToolCalls, setShowToolCalls] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  if (!complaint) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="w-12 h-12 text-navy-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Complaint not found</h1>
        <p className="text-navy-500 mb-6">This complaint doesn't exist or has been removed.</p>
        <Link to="/complaints" className="btn-primary">View All Complaints</Link>
      </div>
    );
  }

  const IssueIcon = issueIcons[complaint.issue] || AlertTriangle;

  const handleMarkResolved = async () => {
    setUploadingEvidence(true);
    await new Promise((r) => setTimeout(r, 1500));

    setVerifying(true);
    setUploadingEvidence(false);
    const result = await verifyResolution(complaint.image, resolvedImages[complaint.issue]);

    const evidence = {
      beforeImage: complaint.image,
      afterImage: resolvedImages[complaint.issue],
      beforeAnalysis: `${complaint.issue} detected`,
      afterAnalysis: 'Issue resolved, no damage detected',
      confidence: result.confidence,
      result: result.result,
      verifiedAt: new Date().toISOString(),
    };

    markResolved(complaint.id, evidence);

    addNotification({
      id: `n-resolved-${complaint.id}`,
      complaintId: complaint.id,
      message: `AI verification completed for ${complaint.id}. Resolution verified with ${result.confidence}% confidence.`,
      timestamp: new Date().toISOString(),
      type: 'verification',
      read: false,
    });

    addActivity({
      id: `act-verify-${complaint.id}`,
      timestamp: new Date().toISOString(),
      agent: 'Resolution Verification Agent',
      action: 'Verified resolution',
      detail: `${complaint.id} - ${result.confidence}% confidence`,
      complaintId: complaint.id,
    });

    setVerifying(false);
  };

  return (
    <div className="section-container py-8 max-w-6xl">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
              <IssueIcon className="w-7 h-7 text-navy-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-navy-400">#{complaint.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-navy-900">{complaint.issue}</h1>
              <p className="text-sm text-navy-500 mt-1">{complaint.category}</p>
              <div className="flex items-center gap-2 mt-3">
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>
          </div>
          <div className="text-sm text-navy-500 shrink-0">
            <p className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Reported {formatTimeAgo(complaint.createdAt)}</p>
            <p className="flex items-center gap-1.5 mt-1"><MapPin className="w-4 h-4" /> {complaint.location.area}, {complaint.location.city}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-navy-50">
              <h2 className="font-semibold text-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy-500" />
                Original Report
              </h2>
            </div>
            <img src={complaint.image} alt={complaint.issue} className="w-full max-h-96 object-cover" />
            <div className="p-4">
              <p className="text-sm text-navy-600">{complaint.description}</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              AI Analysis
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-navy-50">
                <p className="text-xs text-navy-500 mb-1">Issue</p>
                <p className="font-semibold text-navy-900 text-sm">{complaint.issue}</p>
              </div>
              <div className="p-3 rounded-xl bg-navy-50">
                <p className="text-xs text-navy-500 mb-1">AI Confidence</p>
                <p className="font-semibold text-blue-600 text-sm">{complaint.aiConfidence}%</p>
              </div>
              <div className="p-3 rounded-xl bg-navy-50">
                <p className="text-xs text-navy-500 mb-1">Risk Score</p>
                <p className="font-semibold text-saffron-600 text-sm">{complaint.riskScore}/100</p>
              </div>
              <div className="p-3 rounded-xl bg-navy-50">
                <p className="text-xs text-navy-500 mb-1">Duplicates</p>
                <p className="font-semibold text-navy-900 text-sm">{complaint.duplicateCount}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-navy-500" />
              Timeline
            </h2>
            <div className="space-y-1">
              {complaint.timeline.map((event, i) => {
                const isLast = i === complaint.timeline.length - 1;
                return (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        event.status === 'completed' ? 'bg-green2-100' :
                        event.status === 'active' ? 'bg-saffron-100' :
                        'bg-navy-50'
                      }`}>
                        {event.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-green2-600" />
                        ) : event.status === 'active' ? (
                          <Loader2 className="w-4 h-4 text-saffron-500 animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-navy-300" />
                        )}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 flex-1 ${event.status === 'completed' ? 'bg-green2-200' : 'bg-navy-100'}`} style={{ minHeight: '24px' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium text-sm ${event.status === 'pending' ? 'text-navy-400' : 'text-navy-900'}`}>
                          {event.label}
                        </p>
                        {event.timestamp && (
                          <span className="text-xs text-navy-400">{formatTime(event.timestamp)}</span>
                        )}
                      </div>
                      {event.agent && (
                        <p className="text-xs text-saffron-600 mt-0.5">{event.agent}</p>
                      )}
                      <p className="text-xs text-navy-500 mt-1">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="card overflow-hidden">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full p-4 flex items-center justify-between hover:bg-navy-50 transition-colors"
            >
              <span className="font-semibold text-navy-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                View AI Reasoning
              </span>
              {showReasoning ? <ChevronUp className="w-5 h-5 text-navy-400" /> : <ChevronDown className="w-5 h-5 text-navy-400" />}
            </button>
            {showReasoning && (
              <div className="p-4 border-t border-navy-100 animate-fade-in">
                <div className="space-y-3">
                  {complaint.agentActions.map((action) => {
                    const Icon = agentIcons[action.agent] || Eye;
                    return (
                      <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-navy-50">
                        <Icon className="w-4 h-4 text-navy-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-navy-800">{action.agent}</p>
                          <p className="text-xs text-navy-500 mt-1">{action.output}</p>
                          <p className="text-[10px] text-navy-400 mt-1 font-mono">{formatTime(action.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tool Call Visualization */}
          <div className="card overflow-hidden">
            <button
              onClick={() => setShowToolCalls(!showToolCalls)}
              className="w-full p-4 flex items-center justify-between hover:bg-navy-50 transition-colors"
            >
              <span className="font-semibold text-navy-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-saffron-500" />
                AI Tool Call Visualization
              </span>
              {showToolCalls ? <ChevronUp className="w-5 h-5 text-navy-400" /> : <ChevronDown className="w-5 h-5 text-navy-400" />}
            </button>
            {showToolCalls && (
              <div className="p-4 border-t border-navy-100 animate-fade-in">
                <div className="space-y-4">
                  {complaint.agentActions.map((action) => {
                    const Icon = agentIcons[action.agent] || Eye;
                    return (
                      <div key={action.id} className="rounded-xl border border-navy-100 overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2 bg-navy-50">
                          <Icon className="w-4 h-4 text-navy-600" />
                          <span className="text-xs font-semibold text-navy-800">{action.agent}</span>
                        </div>
                        <div className="p-3 space-y-2 font-mono text-xs">
                          <div className="flex gap-2">
                            <span className="text-navy-400 shrink-0">Tool:</span>
                            <span className="text-saffron-600 font-semibold">{action.tool}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-navy-400 shrink-0">Input:</span>
                            <span className="text-navy-700">{action.input}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-navy-400 shrink-0">Output:</span>
                            <span className="text-green2-600">{action.output}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Resolution Evidence */}
          {complaint.resolutionEvidence && (
            <div className="card p-6 border-green2-200 bg-green2-50/20">
              <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green2-600" />
                AI Resolution Verification
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-navy-500 mb-2">BEFORE</p>
                  <img src={complaint.resolutionEvidence.beforeImage} alt="Before" className="w-full h-40 object-cover rounded-xl" />
                  <p className="text-sm text-navy-600 mt-2">{complaint.resolutionEvidence.beforeAnalysis}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy-500 mb-2">AFTER</p>
                  <img src={complaint.resolutionEvidence.afterImage} alt="After" className="w-full h-40 object-cover rounded-xl" />
                  <p className="text-sm text-navy-600 mt-2">{complaint.resolutionEvidence.afterAnalysis}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-green2-100">
                <div>
                  <p className="text-sm font-semibold text-green2-800">Resolution Confidence: {complaint.resolutionEvidence.confidence}%</p>
                  <p className="text-xs text-green2-600 mt-0.5">Prototype AI Verification</p>
                </div>
                <div className="flex items-center gap-2 text-green2-700 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  VERIFIED
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {complaint.status !== 'RESOLVED' && (
            <div className="card p-6">
              <h2 className="font-semibold text-navy-900 mb-4">Authority Actions</h2>
              {verifying ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-saffron-50">
                  <Loader2 className="w-5 h-5 text-saffron-500 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-navy-900">AI Resolution Verification in progress...</p>
                    <p className="text-xs text-navy-500">Comparing before and after images</p>
                  </div>
                </div>
              ) : uploadingEvidence ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <p className="text-sm font-semibold text-navy-900">Uploading resolution evidence...</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleMarkResolved} className="btn-primary flex-1">
                    <Upload className="w-4 h-4" />
                    Upload Resolution Evidence & Verify
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy-900 mb-4">Complaint Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-navy-500">Department</span>
                <span className="font-medium text-navy-900 text-right">{complaint.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">SLA</span>
                <span className="font-medium text-navy-900">{complaint.slaHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">SLA Remaining</span>
                <span className={`font-medium ${complaint.slaRemaining < 6 ? 'text-red-600' : 'text-navy-900'}`}>
                  {complaint.slaRemaining > 0 ? `${complaint.slaRemaining}h` : 'Expired'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-500">Created</span>
                <span className="font-medium text-navy-900">{formatDate(complaint.createdAt)}</span>
              </div>
              {complaint.assignedTo && (
                <div className="flex justify-between">
                  <span className="text-navy-500">Assigned To</span>
                  <span className="font-medium text-navy-900 text-right text-xs">{complaint.assignedTo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-navy-500" />
              Location
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-navy-900">{complaint.location.nearbyRoad}</p>
              <p className="text-navy-500">{complaint.location.area}, {complaint.location.city}</p>
              <div className="flex gap-4 mt-3 text-xs text-navy-400 font-mono">
                <span>Lat: {complaint.location.latitude}</span>
                <span>Lng: {complaint.location.longitude}</span>
              </div>
            </div>
          </div>

          {/* Duplicates */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Copy className="w-4 h-4 text-navy-500" />
              Duplicate Reports
            </h2>
            {complaint.duplicates.length === 0 ? (
              <p className="text-sm text-navy-400">No duplicate reports found.</p>
            ) : (
              <div className="space-y-2">
                {complaint.duplicates.map((dup) => (
                  <Link
                    key={dup.complaintId}
                    to={`/complaint/${dup.complaintId}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-navy-50 hover:bg-navy-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy-900">{dup.complaintId}</p>
                      <p className="text-xs text-navy-400">{dup.distance}m away · {dup.similarity}% similar</p>
                    </div>
                    <StatusBadge status={dup.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Agent Actions Summary */}
          <div className="card p-6">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-saffron-500" />
              Autonomous Actions
            </h2>
            <div className="space-y-2">
              {complaint.agentActions.map((action, i) => {
                const Icon = agentIcons[action.agent as AgentName] || Eye;
                return (
                  <div key={action.id} className="flex items-center gap-2.5 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green2-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green2-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-navy-700 truncate">{action.output.split(',')[0]}</p>
                    </div>
                    <span className="text-xs text-navy-400 shrink-0">{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
