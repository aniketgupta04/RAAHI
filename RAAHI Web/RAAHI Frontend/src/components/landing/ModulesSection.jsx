const ModulesSection = ({ modules }) => {
  return (
    <section id="modules" className="bg-surface-container px-6 py-24 scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-headline text-2xl font-bold text-primary">Integration Modules</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {modules.map((module) => (
            <article
              key={module.title}
              className="group flex cursor-pointer flex-col overflow-hidden bg-surface-container-lowest shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-surface-variant">
                <img src={module.image} alt={module.alt} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-headline text-lg font-bold text-primary">{module.title}</h3>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">{module.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  {module.action}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
