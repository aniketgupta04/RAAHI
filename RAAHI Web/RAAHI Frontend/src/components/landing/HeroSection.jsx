const HeroSection = ({ content, onAccessSystem, onEmergencyAccess, onLearnMore }) => {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-24 text-on-primary md:py-32 sm:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-50" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.32em] text-primary-fixed">
          Government Safety Platform
        </p>
        <h1 className="max-w-4xl font-headline text-4xl font-extrabold tracking-tight md:text-6xl">
          {content.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-fixed md:text-xl">
          {content.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onAccessSystem}
            className="bg-surface-container-lowest px-8 py-4 text-lg font-bold text-primary transition-colors hover:bg-surface-bright"
          >
            Access System
          </button>
          <button
            type="button"
            onClick={onEmergencyAccess}
            className="bg-error px-8 py-4 text-lg font-bold text-on-error transition-opacity hover:opacity-90"
          >
            Emergency Access
          </button>
          <button
            type="button"
            onClick={onLearnMore}
            className="border border-white/30 px-8 py-4 text-lg font-bold transition-colors hover:bg-white/10"
          >
            Learn How It Works
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
