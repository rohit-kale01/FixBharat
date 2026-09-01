import { Link } from 'react-router-dom';
import { Shield, Heart, Github, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                <Shield className="w-5 h-5 text-saffron-400" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">BharatFix</span>
                <p className="text-xs text-navy-400">Report once. We take it from there.</p>
              </div>
            </div>
            <p className="text-sm text-navy-400 max-w-md leading-relaxed">
              An autonomous AI workforce that turns civic complaints into verified resolutions.
              Built for the Build With Bharat 2.0 hackathon at NIT Delhi.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/report" className="hover:text-saffron-400 transition-colors">Report a Problem</Link></li>
              <li><Link to="/dashboard" className="hover:text-saffron-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/map" className="hover:text-saffron-400 transition-colors">City Map</Link></li>
              <li><Link to="/agents" className="hover:text-saffron-400 transition-colors">AI Workforce</Link></li>
              <li><Link to="/demo" className="hover:text-saffron-400 transition-colors">Demo Mode</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/complaints" className="hover:text-saffron-400 transition-colors">All Complaints</Link></li>
              <li><Link to="/admin" className="hover:text-saffron-400 transition-colors">Admin View</Link></li>
              <li><a href="#" className="hover:text-saffron-400 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-saffron-400 transition-colors">Responsible AI</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">
            Prototype built for Build With Bharat 2.0 — Demo data is simulated, not real government data.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-navy-500">
            <MapPin className="w-3 h-3" />
            <span>NIT Delhi</span>
            <span className="mx-2">·</span>
            <span>Made with</span>
            <Heart className="w-3 h-3 text-saffron-500" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
