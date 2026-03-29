const WorkflowSection = ({ id, steps }) => {
  return (
    <section id={id} className="bg-surface-container-low px-6 py-20 scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-headline text-2xl font-bold uppercase tracking-[0.28em] text-primary">
          Protocol Workflow
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="flex flex-col items-center text-center">
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center ${
                  index === steps.length - 1 ? 'bg-error text-on-error' : 'bg-primary-container text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{step.icon}</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-on-surface-variant">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
