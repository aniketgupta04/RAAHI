import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-background">
      <header className="w-full bg-surface-container-lowest px-6 py-6">
        <div className="mx-auto flex max-w-7xl justify-center">
          <Link to="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">shield_with_heart</span>
            <span className="font-headline text-xl font-bold tracking-tight text-primary">
              Raahi - Tourist Safety
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 rounded bg-surface-container-high px-4 py-3">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">gpp_maybe</span>
            <p className="text-sm font-medium tracking-wide text-on-surface-variant">
              System Security: This is a secure government portal. All access is monitored.
            </p>
          </div>

          <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm md:p-10">
            <div className="mb-8">
              <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">Portal Login</h1>
              <p className="mt-2 text-sm tracking-normal text-on-surface-variant">
                Enter your credentials to access the Emergency Monitoring System.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant"
                >
                  Official ID / Email
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={credentials.identifier}
                  onChange={handleChange}
                  placeholder="e.g. OFFICER_7721 or name@gov.in"
                  className="w-full rounded bg-surface-container-low px-4 py-3 text-on-background placeholder:text-outline-variant focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant"
                  >
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-primary-container transition-all hover:underline">
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full rounded bg-surface-container-low px-4 py-3 text-on-background focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary-container py-4 font-bold text-on-primary transition-colors hover:bg-primary"
                >
                  <span>Login to Dashboard</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-container-high" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface-container-lowest px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-outline">
                      Distress Protocols
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded border border-transparent py-3 font-bold text-error transition-all hover:border-error-container hover:bg-error-container/10"
                >
                  <span className="material-symbols-outlined text-lg">emergency</span>
                  <span>Emergency Access</span>
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-center text-[11px] font-medium uppercase tracking-tight text-outline">
              Digital Authority • Government-Grade Safety Protocol • 2024
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[11px] text-outline transition-colors hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-[11px] text-outline transition-colors hover:text-primary">
                Audit Logs
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-outline-variant/20 bg-surface-container-low">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 py-12 md:flex-row">
          <div className="flex flex-col gap-1">
            <span className="font-headline font-bold tracking-tight text-primary">Tourist Safety</span>
            <p className="text-sm tracking-wide text-on-surface-variant">
              © 2024 Digital Authority. Government-Grade Safety Protocol.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-sm tracking-wide text-on-surface-variant transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-sm tracking-wide text-on-surface-variant transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-sm tracking-wide text-on-surface-variant transition-colors hover:text-primary">
              Accessibility
            </a>
            <a href="#" className="text-sm tracking-wide text-on-surface-variant transition-colors hover:text-primary">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
