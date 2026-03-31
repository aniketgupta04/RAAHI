import { lazy, Suspense, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturesSection from '../components/landing/FeaturesSection';
import HeroSection from '../components/landing/HeroSection';
import ModulesSection from '../components/landing/ModulesSection';
import StatsSection from '../components/landing/StatsSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import { useAuth } from '../contexts/AuthContext';
import {
  featureCards,
  heroContent,
  moduleCards,
  stats,
  workflowSteps,
} from '../data/landingContent';

const PanicButton = lazy(() => import('../components/Shared/PanicButton'));

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isFirebaseConfigured = useMemo(() => {
    const requiredFirebaseKeys = [
      import.meta.env.VITE_FIREBASE_API_KEY,
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      import.meta.env.VITE_FIREBASE_DATABASE_URL,
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      import.meta.env.VITE_FIREBASE_APP_ID,
    ];

    return requiredFirebaseKeys.every(Boolean);
  }, []);

  const scrollToWorkflow = useCallback(() => {
    document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main>
      <HeroSection
        content={heroContent}
        isAuthenticated={isAuthenticated}
        onAccessSystem={() => navigate('/login')}
        onProfile={() => navigate('/profile')}
        onRegister={() => navigate('/register')}
        onAccessDashboard={() => navigate('/dashboard')}
        onEmergencyAccess={() => navigate('/dashboard')}
        onLearnMore={scrollToWorkflow}
      />
      <WorkflowSection id="workflow" steps={workflowSteps} />
      <FeaturesSection features={featureCards} />
      <StatsSection stats={stats} />
      <ModulesSection modules={moduleCards} />
      {isFirebaseConfigured && (
        <Suspense fallback={null}>
          <PanicButton />
        </Suspense>
      )}
    </main>
  );
};

export default LandingPage;
