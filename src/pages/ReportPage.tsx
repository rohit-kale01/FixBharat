import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, MapPin, Mic, Navigation, Image as ImageIcon, ArrowRight, ArrowLeft,
  CheckCircle2, Loader2, X, FileText, Crosshair, AlertCircle,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { submitReport, createComplaintFromReport } from '@/services/reportService';
import type { Location, Complaint, AgentAction } from '@/types';
import { issueImages } from '@/data/demoData';

type Step = 'image' | 'location' | 'describe' | 'submit' | 'processing' | 'result';

const agentSequence = [
  { name: 'Vision Agent', icon: 'Eye', messages: ['Analyzing image...', 'Detected pothole with 96% confidence.'], color: 'text-blue-500' },
  { name: 'Location Agent', icon: 'MapPin', messages: ['Identifying location...', 'Main Bawana Road, NIT Delhi Campus, Delhi'], color: 'text-green-500' },
  { name: 'Duplicate Detection Agent', icon: 'Copy', messages: ['Searching nearby reports...', '3 similar complaints found within 120m.'], color: 'text-purple-500' },
  { name: 'Priority Agent', icon: 'Gauge', messages: ['Calculating risk...', 'High priority due to severity and repeated reports. Risk score: 87/100'], color: 'text-amber-500' },
  { name: 'Routing Agent', icon: 'Route', messages: ['Selecting department...', 'Road Maintenance Department selected.'], color: 'text-cyan-500' },
  { name: 'Action Agent', icon: 'Zap', messages: ['Creating complaint...', 'Complaint BF-1024 created. SLA: 48 hours.'], color: 'text-saffron-500' },
  { name: 'Follow-up Agent', icon: 'Bell', messages: ['Scheduling monitoring...', 'SLA monitoring started. Next check in 6 hours.'], color: 'text-pink-500' },
];

export default function ReportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addComplaint, addNotification, addActivity } = useApp();

  const [step, setStep] = useState<Step>('image');
  const [image, setImage] = useState<string>('');
  const [location, setLocation] = useState<Location | null>(null);
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);
  const [agentMessages, setAgentMessages] = useState<string[]>([]);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const [resultComplaintId, setResultComplaintId] = useState<string>('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const steps: { key: Step; label: string; icon: typeof Upload }[] = [
    { key: 'image', label: t('report.step.image'), icon: ImageIcon },
    { key: 'location', label: t('report.step.location'), icon: MapPin },
    { key: 'describe', label: t('report.step.describe'), icon: FileText },
    { key: 'submit', label: t('report.step.submit'), icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG or PNG).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.onerror = () => setError('Failed to read image. Please try again.');
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Fallback to demo location near NIT Delhi
      setLocation({
        latitude: 28.7460,
        longitude: 77.1310,
        nearbyRoad: 'Main Bawana Road',
        area: 'NIT Delhi Campus',
        city: 'Delhi',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: parseFloat(pos.coords.latitude.toFixed(4)),
          longitude: parseFloat(pos.coords.longitude.toFixed(4)),
          nearbyRoad: 'Nearby Road',
          area: 'Current Location',
          city: 'Delhi',
        });
      },
      () => {
        // Fallback to demo location
        setLocation({
          latitude: 28.7460,
          longitude: 77.1310,
          nearbyRoad: 'Main Bawana Road',
          area: 'NIT Delhi Campus',
          city: 'Delhi',
        });
      },
      { timeout: 5000 }
    );
  }, []);

  const startVoiceInput = useCallback(() => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) {
      setIsListening(true);
      setTimeout(() => {
        setDescription((prev) => prev + (prev ? ' ' : '') + 'There is a dangerous pothole near the main road. It could cause accidents.');
        setIsListening(false);
      }, 2000);
      return;
    }

    const recognition = new (SR as new () => SpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, []);

  const runAgentSequence = useCallback(async () => {
    setStep('processing');
    setActiveAgent(0);
    setAgentMessages([]);
    setCompletedAgents([]);

    for (let i = 0; i < agentSequence.length; i++) {
      setActiveAgent(i);
      const msgs: string[] = [];
      for (const msg of agentSequence[i].messages) {
        await new Promise((r) => setTimeout(r, 1200));
        msgs.push(msg);
        setAgentMessages([...msgs]);
      }
      await new Promise((r) => setTimeout(r, 500));
      setCompletedAgents((prev) => [...prev, i]);
    }

    await new Promise((r) => setTimeout(r, 800));

    // Create the actual complaint
    const demoLocation: Location = location || {
      latitude: 28.7460,
      longitude: 77.1310,
      nearbyRoad: 'Main Bawana Road',
      area: 'NIT Delhi Campus',
      city: 'Delhi',
    };

    const result = await submitReport({
      image: image || issueImages.Pothole,
      location: demoLocation,
      description: description || 'Citizen reported a civic issue.',
    });

    const complaint = createComplaintFromReport(
      { image: image || issueImages.Pothole, location: demoLocation, description: description || 'Citizen reported a civic issue.' },
      result
    );

    addComplaint(complaint);
    setResultComplaintId(complaint.id);

    addNotification({
      id: `n-${complaint.id}`,
      complaintId: complaint.id,
      message: `Your complaint ${complaint.id} has been created and assigned to ${complaint.department}.`,
      timestamp: new Date().toISOString(),
      type: 'assignment',
      read: false,
    });

    result.agentActions.forEach((action: AgentAction) => {
      addActivity({
        id: `act-${complaint.id}-${action.id}`,
        timestamp: action.timestamp,
        agent: action.agent,
        action: action.output.split(',')[0],
        detail: action.output,
        complaintId: complaint.id,
      });
    });

    setStep('result');
  }, [image, location, description, addComplaint, addNotification, addActivity]);

  const canProceed = () => {
    if (step === 'image') return image !== '';
    if (step === 'location') return location !== null;
    if (step === 'describe') return description.trim() !== '';
    return false;
  };

  if (step === 'processing') {
    return <ProcessingScreen activeAgent={activeAgent} agentMessages={agentMessages} completedAgents={completedAgents} />;
  }

  if (step === 'result') {
    return (
      <div className="section-container py-16 max-w-2xl">
        <div className="card p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-green2-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green2-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Your complaint is now moving automatically</h2>
          <p className="text-navy-500 mb-6">
            Complaint <span className="font-semibold text-saffron-600">{resultComplaintId}</span> has been created and assigned.
            The AI workforce will monitor it until resolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/complaint/${resultComplaintId}`} className="btn-primary">
              View Complaint Details
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => { setStep('image'); setImage(''); setLocation(null); setDescription(''); }} className="btn-secondary">
              Report Another Problem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">{t('report.title')}</h1>
        <p className="text-navy-500">Report a civic problem and let the AI workforce handle the rest.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((s, i) => {
          const isActive = i === currentStepIndex;
          const isComplete = i < currentStepIndex;
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isComplete ? 'bg-green2-500 text-white' :
                  isActive ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/30' :
                  'bg-navy-100 text-navy-400'
                }`}>
                  {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-navy-900' : 'text-navy-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded transition-all ${isComplete ? 'bg-green2-400' : 'bg-navy-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="card p-6 sm:p-8">
        {/* STEP 1: IMAGE */}
        {step === 'image' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-navy-900 mb-1">{t('report.step.image')}</h2>
            <p className="text-sm text-navy-500 mb-6">Upload a photo of the civic problem you want to report.</p>

            {image ? (
              <div className="relative">
                <img src={image} alt="Uploaded" className="w-full max-h-80 object-cover rounded-xl" />
                <button
                  onClick={() => setImage('')}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-saffron-400 bg-saffron-50' : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-navy-400" />
                </div>
                <p className="font-semibold text-navy-700 mb-1">{t('report.upload.title')}</p>
                <p className="text-sm text-navy-400">{t('report.upload.subtitle')}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-navy-400">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Or use a demo image:</span>
              <button
                onClick={() => setImage(issueImages.Pothole)}
                className="text-saffron-600 font-medium hover:underline"
              >
                Load demo pothole photo
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 'location' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-navy-900 mb-1">{t('report.step.location')}</h2>
            <p className="text-sm text-navy-500 mb-6">Share the location of the problem so the AI can route it correctly.</p>

            <button onClick={detectLocation} className="w-full p-4 rounded-xl border-2 border-dashed border-navy-200 hover:border-saffron-400 hover:bg-saffron-50 transition-all flex items-center justify-center gap-3 mb-6">
              <Crosshair className="w-5 h-5 text-saffron-600" />
              <span className="font-semibold text-navy-700">{t('report.location.detect')}</span>
            </button>

            {location && (
              <div className="p-5 rounded-xl bg-navy-50 animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-saffron-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy-900">{location.nearbyRoad}</p>
                    <p className="text-sm text-navy-500">{location.area}, {location.city}</p>
                    <div className="flex gap-4 mt-2 text-xs text-navy-400 font-mono">
                      <span>Lat: {location.latitude}</span>
                      <span>Lng: {location.longitude}</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green2-500" />
                </div>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 text-xs text-navy-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>If location access is unavailable, we'll use a demo location near NIT Delhi for the report.</p>
            </div>
          </div>
        )}

        {/* STEP 3: DESCRIBE */}
        {step === 'describe' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-navy-900 mb-1">{t('report.step.describe')}</h2>
            <p className="text-sm text-navy-500 mb-6">Describe the problem in your own words. You can also use voice input.</p>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('report.describe.placeholder')}
              rows={5}
              className="input-field resize-none"
              aria-label="Problem description"
            />

            <button
              onClick={startVoiceInput}
              className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isListening
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
              }`}
            >
              {isListening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Listening...' : t('report.describe.voice')}
            </button>

            {image && (
              <div className="mt-6 flex items-center gap-3 p-3 rounded-lg bg-navy-50">
                <img src={image} alt="Report" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-700">Photo attached</p>
                  <p className="text-xs text-navy-400">Will be analyzed by Vision Agent</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-100">
          <button
            onClick={() => {
              if (step === 'location') setStep('image');
              else if (step === 'describe') setStep('location');
            }}
            disabled={step === 'image'}
            className={`btn-ghost ${step === 'image' ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </button>

          {step === 'describe' ? (
            <button
              onClick={runAgentSequence}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('report.submit')}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (step === 'image' && image) setStep('location');
                else if (step === 'location' && location) setStep('describe');
              }}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessingScreen({
  activeAgent, agentMessages, completedAgents,
}: {
  activeAgent: number;
  agentMessages: string[];
  completedAgents: number[];
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-saffron-50 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-saffron-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">{t('report.processing.title')}</h1>
          <p className="text-navy-500 text-sm max-w-lg mx-auto">{t('report.processing.subtitle')}</p>
        </div>

        <div className="space-y-3">
          {agentSequence.map((agent, i) => {
            const isCompleted = completedAgents.includes(i);
            const isActive = i === activeAgent && !isCompleted;
            const isPending = i > activeAgent;

            return (
              <div
                key={agent.name}
                className={`card p-4 transition-all duration-300 ${
                  isCompleted ? 'border-green2-200 bg-green2-50/30' :
                  isActive ? 'border-saffron-300 shadow-md' :
                  'opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isCompleted ? 'bg-green2-100' :
                    isActive ? 'bg-saffron-100' :
                    'bg-navy-50'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green2-600" />
                    ) : isActive ? (
                      <Loader2 className={`w-5 h-5 ${agent.color} animate-spin`} />
                    ) : (
                      <div className={`w-2 h-2 rounded-full bg-navy-300`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm ${isPending ? 'text-navy-400' : 'text-navy-900'}`}>
                        {agent.name}
                      </p>
                      {isCompleted && (
                        <span className="text-xs text-green2-600 font-medium">Completed</span>
                      )}
                    </div>
                    {isActive && agentMessages.length > 0 && (
                      <p className="text-sm text-navy-500 mt-0.5 animate-fade-in">{agentMessages[agentMessages.length - 1]}</p>
                    )}
                    {isPending && (
                      <p className="text-xs text-navy-400 mt-0.5">Waiting...</p>
                    )}
                    {isCompleted && (
                      <p className="text-sm text-green2-600 mt-0.5">{agent.messages[agent.messages.length - 1]}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-navy-400">
          <Navigation className="w-4 h-4" />
          <span>Your complaint is now moving automatically...</span>
        </div>
      </div>
    </div>
  );
}
