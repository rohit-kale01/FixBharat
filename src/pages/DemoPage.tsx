import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Pause, SkipForward, RotateCcw, CheckCircle2, Loader2,
  Eye, MapPin, Copy, Gauge, Route, Zap, Bell, ShieldCheck,
  ArrowRight, Sparkles, Camera, FileText,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { issueImages, resolvedImages } from '@/data/demoData';
import { verifyResolution } from '@/services/reportService';

interface DemoStep {
  id: number;
  title: string;
  narration: string;
  agent?: string;
  icon: typeof Eye;
  detail: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  { id: 1, title: 'Citizen Reports a Problem', narration: 'A citizen finds a dangerous pothole near NIT Delhi and opens BharatFix to report it.', icon: Camera, detail: 'Photo uploaded + location shared', duration: 3000 },
  { id: 2, title: 'Vision Agent Analyzes Image', narration: 'The Vision Agent analyzes the uploaded photo and identifies the issue.', agent: 'Vision Agent', icon: Eye, detail: 'Issue: Pothole | Confidence: 96% | Severity: High', duration: 3000 },
  { id: 3, title: 'Location Agent Identifies Location', narration: 'The Location Agent reverse-geocodes the coordinates to identify the exact area.', agent: 'Location Agent', icon: MapPin, detail: 'Main Bawana Road, NIT Delhi Campus, Delhi', duration: 2500 },
  { id: 4, title: 'Duplicate Detection Agent Searches', narration: 'The Duplicate Detection Agent searches for similar complaints nearby.', agent: 'Duplicate Detection Agent', icon: Copy, detail: '3 similar complaints found within 120m', duration: 2500 },
  { id: 5, title: 'Priority Agent Calculates Risk', narration: 'The Priority Agent calculates a risk score based on severity, duplicates, and road type.', agent: 'Priority Agent', icon: Gauge, detail: 'Risk Score: 87/100 | Priority: HIGH', duration: 2500 },
  { id: 6, title: 'Routing Agent Selects Department', narration: 'The Routing Agent determines the correct municipal department.', agent: 'Routing Agent', icon: Route, detail: 'Road Maintenance Department selected', duration: 2500 },
  { id: 7, title: 'Action Agent Creates Complaint', narration: 'The Action Agent creates a formal complaint ticket with SLA.', agent: 'Action Agent', icon: Zap, detail: 'Complaint BF-1024 created | SLA: 48 hours', duration: 2500 },
  { id: 8, title: 'Follow-up Agent Monitors SLA', narration: 'The Follow-up Agent begins SLA monitoring and schedules check-ins.', agent: 'Follow-up Agent', icon: Bell, detail: 'SLA monitoring started | Next check: 6 hours', duration: 2500 },
  { id: 9, title: 'Resolution Evidence Uploaded', narration: 'The department completes the repair and uploads resolution evidence.', icon: FileText, detail: 'Resolution photo uploaded by Road Maintenance', duration: 3000 },
  { id: 10, title: 'AI Verifies Resolution', narration: 'The Resolution Verification Agent compares before and after images.', agent: 'Resolution Verification Agent', icon: ShieldCheck, detail: 'Resolution Verified | Confidence: 94%', duration: 3000 },
  { id: 11, title: 'Complaint Resolved', narration: 'From complaint reporting to autonomous resolution. Report once. BharatFix takes it from there.', icon: CheckCircle2, detail: 'Complaint BF-1024 — RESOLVED', duration: 3000 },
];

export default function DemoPage() {
  const { addNotification, addActivity, markResolved } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= demoSteps.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  const runStep = useCallback((stepIndex: number) => {
    if (stepIndex >= demoSteps.length) {
      setIsPlaying(false);
      return;
    }
    setCompletedSteps((prev) => [...new Set([...prev, stepIndex])]);
    const step = demoSteps[stepIndex];
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isPlaying) {
        runStep(stepIndex + 1);
      }
      setCurrentStep(stepIndex + 1 < demoSteps.length ? stepIndex + 1 : stepIndex);
    }, step.duration);
  }, [isPlaying]);

  const startDemo = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    runStep(0);
  }, [runStep]);

  const pauseDemo = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const resumeDemo = useCallback(() => {
    setIsPlaying(true);
    runStep(currentStep + 1);
  }, [runStep, currentStep]);

  const resetDemo = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  }, []);

  const goToStep = useCallback((index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentStep(index);
    setCompletedSteps((prev) => [...new Set([...prev, index])]);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // On final step, actually resolve the demo complaint
  useEffect(() => {
    if (currentStep === demoSteps.length - 1 && completedSteps.includes(demoSteps.length - 1)) {
      const runVerification = async () => {
        const result = await verifyResolution(issueImages.Pothole, resolvedImages.Pothole);
        markResolved('BF-1024', {
          beforeImage: issueImages.Pothole,
          afterImage: resolvedImages.Pothole,
          beforeAnalysis: 'Large pothole detected on main road',
          afterAnalysis: 'Road surface restored, no damage detected',
          confidence: result.confidence,
          result: 'VERIFIED',
          verifiedAt: new Date().toISOString(),
        });
        addNotification({
          id: `n-demo-${Date.now()}`,
          complaintId: 'BF-1024',
          message: 'AI verification completed for BF-1024. Resolution verified with 94% confidence.',
          timestamp: new Date().toISOString(),
          type: 'verification',
          read: false,
        });
        addActivity({
          id: `act-demo-${Date.now()}`,
          timestamp: new Date().toISOString(),
          agent: 'Resolution Verification Agent',
          action: 'Verified resolution',
          detail: 'BF-1024 - 94% confidence',
          complaintId: 'BF-1024',
        });
      };
      runVerification();
    }
  }, [currentStep, completedSteps, markResolved, addNotification, addActivity]);

  const step = demoSteps[currentStep];
  const isComplete = currentStep === demoSteps.length - 1 && completedSteps.includes(demoSteps.length - 1);

  return (
    <div className="section-container py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron-50 border border-saffron-200 mb-4">
          <Sparkles className="w-4 h-4 text-saffron-600" />
          <span className="text-sm font-medium text-saffron-700">Presentation Mode</span>
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-2">BharatFix Live Demo</h1>
        <p className="text-navy-500">Watch the complete journey from citizen report to AI-verified resolution</p>
      </div>

      {!hasStarted ? (
        /* Start screen */
        <div className="card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-navy-900 flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-saffron-400 ml-1" />
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Ready to demonstrate?</h2>
          <p className="text-navy-500 mb-8 max-w-lg mx-auto">
            This demo walks through all 11 steps of the BharatFix autonomous workflow — from a citizen reporting a pothole to AI-verified resolution. Takes about 2-3 minutes.
          </p>
          <button onClick={startDemo} className="btn-primary text-base px-8 py-3.5">
            <Play className="w-5 h-5" />
            Start Demo
          </button>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {demoSteps.slice(0, 4).map((s, i) => (
              <div key={s.id} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mx-auto mb-2">
                  <s.icon className="w-5 h-5 text-navy-600" />
                </div>
                <p className="text-xs text-navy-500">{i + 1}. {s.title.split(' ').slice(0, 2).join(' ')}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-4">+ {demoSteps.length - 4} more steps</p>
        </div>
      ) : (
        <>
          {/* Demo progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-700">Step {currentStep + 1} of {demoSteps.length}</span>
              <span className="text-sm text-navy-400">{Math.round(((currentStep + 1) / demoSteps.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-navy-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step step indicators */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
            {demoSteps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  i === currentStep ? 'bg-saffron-500 text-white scale-110 shadow-md' :
                  completedSteps.includes(i) ? 'bg-green2-100 text-green2-700' :
                  'bg-navy-100 text-navy-400'
                }`}
                title={s.title}
              >
                {completedSteps.includes(i) && i !== currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
            ))}
          </div>

          {/* Main demo display */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Visual */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isComplete ? 'bg-green2-50' : 'bg-saffron-50'}`}>
                  {isPlaying && currentStep === step.id - 1 ? (
                    <Loader2 className={`w-6 h-6 ${isComplete ? 'text-green2-600' : 'text-saffron-600'} animate-spin`} />
                  ) : (
                    <step.icon className={`w-6 h-6 ${isComplete ? 'text-green2-600' : 'text-saffron-600'}`} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-navy-400 font-medium">Step {step.id}</p>
                  <h3 className="font-bold text-navy-900">{step.title}</h3>
                </div>
              </div>

              {/* Visual content based on step */}
              <div className="rounded-xl bg-navy-50 p-4 min-h-[200px] flex items-center justify-center">
                {step.id === 1 && (
                  <div className="text-center">
                    <img src={issueImages.Pothole} alt="Pothole" className="w-full max-h-48 object-cover rounded-xl mb-3" />
                    <p className="text-sm text-navy-600">Citizen uploaded photo of pothole</p>
                  </div>
                )}
                {step.id === 2 && (
                  <div className="text-center w-full">
                    <img src={issueImages.Pothole} alt="Analysis" className="w-full max-h-32 object-cover rounded-xl mb-3 opacity-80" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white"><p className="text-navy-400">Issue</p><p className="font-bold text-navy-900">Pothole</p></div>
                      <div className="p-2 rounded-lg bg-white"><p className="text-navy-400">Confidence</p><p className="font-bold text-blue-600">96%</p></div>
                      <div className="p-2 rounded-lg bg-white"><p className="text-navy-400">Severity</p><p className="font-bold text-red-600">High</p></div>
                    </div>
                  </div>
                )}
                {step.id === 3 && (
                  <div className="text-center w-full">
                    <MapPin className="w-12 h-12 text-green2-500 mx-auto mb-3" />
                    <p className="font-semibold text-navy-900">Main Bawana Road</p>
                    <p className="text-sm text-navy-500">NIT Delhi Campus, Delhi</p>
                    <p className="text-xs text-navy-400 font-mono mt-2">28.7460, 77.1310</p>
                  </div>
                )}
                {step.id === 4 && (
                  <div className="w-full space-y-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex items-center gap-2 p-2 rounded-lg bg-white">
                        <Copy className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-navy-700">BF-{980 + n * 5}</span>
                        <span className="text-xs text-navy-400 ml-auto">{n * 30}m away</span>
                      </div>
                    ))}
                  </div>
                )}
                {step.id === 5 && (
                  <div className="text-center w-full">
                    <Gauge className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <p className="text-4xl font-bold text-navy-900">87<span className="text-lg text-navy-400">/100</span></p>
                    <span className="badge-high mt-2">HIGH Priority</span>
                  </div>
                )}
                {step.id === 6 && (
                  <div className="text-center">
                    <Route className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
                    <p className="font-semibold text-navy-900">Road Maintenance</p>
                    <p className="text-sm text-navy-500">Department</p>
                  </div>
                )}
                {step.id === 7 && (
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-saffron-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold font-mono text-navy-900">BF-1024</p>
                    <p className="text-sm text-navy-500 mt-1">SLA: 48 hours</p>
                    <span className="badge-progress mt-2">Assigned</span>
                  </div>
                )}
                {step.id === 8 && (
                  <div className="text-center">
                    <Bell className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                    <p className="font-semibold text-navy-900">SLA Monitoring Active</p>
                    <p className="text-sm text-navy-500">Next check: 6 hours</p>
                    <div className="mt-3 flex items-center gap-2 justify-center text-xs text-navy-400">
                      <div className="w-2 h-2 rounded-full bg-green2-500 animate-pulse" />
                      <span>Monitoring</span>
                    </div>
                  </div>
                )}
                {step.id === 9 && (
                  <div className="w-full">
                    <img src={resolvedImages.Pothole} alt="Repaired" className="w-full max-h-48 object-cover rounded-xl" />
                    <p className="text-sm text-navy-600 mt-2 text-center">Resolution evidence uploaded</p>
                  </div>
                )}
                {step.id === 10 && (
                  <div className="w-full">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-navy-400 mb-1">BEFORE</p>
                        <img src={issueImages.Pothole} alt="Before" className="w-full h-24 object-cover rounded-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-navy-400 mb-1">AFTER</p>
                        <img src={resolvedImages.Pothole} alt="After" className="w-full h-24 object-cover rounded-lg" />
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-green2-50 text-center">
                      <p className="text-sm font-bold text-green2-700">Resolution Verified — 94%</p>
                    </div>
                  </div>
                )}
                {step.id === 11 && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green2-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green2-600" />
                    </div>
                    <p className="text-2xl font-bold text-navy-900">RESOLVED</p>
                    <p className="text-sm text-navy-500 mt-2">Complaint BF-1024</p>
                    <Link to="/complaint/BF-1024" className="mt-4 inline-flex items-center gap-1 text-sm text-saffron-600 font-semibold hover:underline">
                      View Complaint <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Tool call */}
              {step.agent && (
                <div className="mt-4 p-3 rounded-lg bg-navy-900 text-white font-mono text-xs">
                  <div className="flex gap-2"><span className="text-navy-400">Agent:</span><span className="text-saffron-400">{step.agent}</span></div>
                  <div className="flex gap-2 mt-1"><span className="text-navy-400">Output:</span><span className="text-green2-400">{step.detail}</span></div>
                </div>
              )}
            </div>

            {/* Right: Narration + controls */}
            <div className="space-y-4">
              {/* Narration */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-saffron-500" />
                  <span className="text-xs font-semibold text-saffron-600 uppercase tracking-wider">Presenter Narration</span>
                </div>
                <p className="text-lg text-navy-800 leading-relaxed">{step.narration}</p>
                {step.detail && (
                  <div className="mt-4 p-3 rounded-lg bg-navy-50 text-sm text-navy-600 font-medium">
                    {step.detail}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="card p-4">
                <div className="flex items-center gap-2">
                  {!isPlaying ? (
                    <button onClick={resumeDemo} className="btn-primary flex-1" disabled={isComplete}>
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  ) : (
                    <button onClick={pauseDemo} className="btn-secondary flex-1">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  )}
                  <button onClick={nextStep} className="btn-secondary" disabled={currentStep >= demoSteps.length - 1}>
                    <SkipForward className="w-4 h-4" />
                    Next
                  </button>
                  <button onClick={resetDemo} className="btn-ghost">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Completed steps list */}
              <div className="card p-4">
                <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">Workflow Progress</h4>
                <div className="space-y-1.5">
                  {demoSteps.map((s, i) => (
                    <div key={s.id} className={`flex items-center gap-2 text-sm transition-all ${i === currentStep ? 'opacity-100' : completedSteps.includes(i) ? 'opacity-70' : 'opacity-40'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        completedSteps.includes(i) ? 'bg-green2-100' : i === currentStep ? 'bg-saffron-100' : 'bg-navy-100'
                      }`}>
                        {completedSteps.includes(i) ? <CheckCircle2 className="w-3 h-3 text-green2-600" /> : i === currentStep ? <Loader2 className="w-3 h-3 text-saffron-600 animate-spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-navy-300" />}
                      </div>
                      <span className={i === currentStep ? 'font-semibold text-navy-900' : 'text-navy-600'}>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          {isComplete && (
            <div className="card p-8 text-center mt-6 border-green2-200 bg-green2-50/20 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">From complaint reporting to autonomous resolution.</h2>
              <p className="text-lg text-saffron-600 font-semibold mb-6">BharatFix — Report once. We take it from there.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/report" className="btn-primary">Try It Yourself</Link>
                <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
