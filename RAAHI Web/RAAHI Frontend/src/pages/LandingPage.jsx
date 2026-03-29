import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturesSection from '../components/landing/FeaturesSection';
import HeroSection from '../components/landing/HeroSection';
import ModulesSection from '../components/landing/ModulesSection';
import StatsSection from '../components/landing/StatsSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import {
  featureCards,
  heroContent,
  moduleCards,
  stats,
  workflowSteps,
} from '../data/landingContent';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToWorkflow = useCallback(() => {
    document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main>
      <HeroSection
        content={heroContent}
        onAccessSystem={() => navigate('/login')}
        onEmergencyAccess={() => navigate('/dashboard')}
        onLearnMore={scrollToWorkflow}
      />
      <WorkflowSection id="workflow" steps={workflowSteps} />
      <FeaturesSection features={featureCards} />
      <StatsSection stats={stats} />
      <ModulesSection modules={moduleCards} />
    </main>
  );
};

export default LandingPage;
