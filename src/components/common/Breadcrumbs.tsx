import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show on dashboard home
  if (pathnames.length === 0) {
    return null;
  }

  // Custom Breadcrumb Logic
  let crumbs: { label: string; to: string }[] = [];

  // Handle specific routes
  if (pathnames[0] === 'assessments') {
    crumbs.push({ label: 'Assessments', to: '/assessments' });
  } else if (pathnames[0] === 'profile') {
    crumbs.push({ label: 'Profile', to: '/profile' });
  } else if (pathnames[0] === 'report' && pathnames[1]) {
    // Report Detail Route -> Map to Assessments parent
    crumbs.push({ label: 'Assessments', to: '/assessments' });
    crumbs.push({ label: 'Report Details', to: `/report/${pathnames[1]}` });
  } else {
    // Fallback for other routes (e.g. 404 testing)
    pathnames.forEach((value, index) => {
       const to = `/${pathnames.slice(0, index + 1).join('/')}`;
       crumbs.push({ label: value.replace(/-/g, ' '), to });
    });
  }

  return (
    <nav className="flex items-center text-sm text-surface-500 mb-6 animate-in fade-in slide-in-from-left-2 duration-300 px-1 w-full">
      <div className="flex items-center flex-1">
        <Link to="/" className="flex items-center hover:text-surface-900 transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.to}>
              <ChevronRight className="w-4 h-4 mx-2 text-surface-300" />
              {isLast ? (
                <span className="font-semibold text-surface-900 capitalize cursor-default">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="hover:text-surface-900 transition-colors capitalize">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <button 
        onClick={() => navigate(-1)} 
        className="p-1 text-surface-400 bg-surface-200 cursor-pointer hover:text-surface-900 hover:bg-surface-200 rounded-full transition-colors ml-auto"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Breadcrumbs;
