import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <main className="bg-surface-container-low py-24">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 sm:px-8">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
          <span className="mb-4 inline-flex rounded-full bg-error-container px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-on-error-container">
            Temporary Route
          </span>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
            Emergency Operations Dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-on-surface-variant">
            This placeholder keeps the emergency navigation path active while the dashboard experience is
            built out. The route structure is production-ready and can be replaced with live modules later.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline text-xl font-bold text-primary">Live Monitoring</h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              Space reserved for real-time tourist alert streams and responder coordination panels.
            </p>
          </article>
          <article className="border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline text-xl font-bold text-primary">Incident Queue</h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              Future queue for escalations, triage, and workflow-driven dispatch operations.
            </p>
          </article>
          <article className="border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline text-xl font-bold text-primary">Authority Links</h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              Placeholder for police, hospital, and field responder integrations.
            </p>
          </article>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/login"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90"
          >
            Go To Login
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            Back To Landing Page
          </Link>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
