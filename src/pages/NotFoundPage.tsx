import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-navy-200 font-display mb-4">404</p>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Page not found</h1>
        <p className="text-navy-500 mb-8">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
