import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      setError('');
    }

    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login({
        email: credentials.email,
        password: credentials.password,
      });

      if (result.success) {
        navigate('/dashboard', { replace: true });
        return;
      }

      setError(result.error || 'Login failed. Please check your credentials.');
    } catch (submitError) {
      setError('Unable to connect to the login service right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-background">
      <header className="w-full border-b border-outline-variant/30 bg-surface-container-lowest px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">shield_with_heart</span>
            <span className="font-headline text-xl font-bold tracking-tight text-primary">
              Raahi - Tourist Safety
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
            >
              Home
            </Link>

            {!isLoading && !isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
                >
                  Register
                </Link>
                <span className="border border-primary bg-primary px-4 py-2 text-sm font-semibold text-on-primary">
                  Login
                </span>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <Link
                to="/profile"
                className="border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 rounded bg-surface-container-high px-4 py-3">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">gpp_maybe</span>
            <p className="text-sm font-medium tracking-wide text-on-surface-variant">
              System Security: This is a secure Raahi portal. All access is monitored.
            </p>
          </div>

          <div className="rounded-lg bg-surface-container-lowest p-8 shadow-sm md:p-10">
            <div className="mb-8">
              <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">Login</h1>
              <p className="mt-2 text-sm tracking-normal text-on-surface-variant">
                Enter your email and password to access your Raahi dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isSubmitting || isLoading}
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
                  autoComplete="current-password"
                  disabled={isSubmitting || isLoading}
                  className="w-full rounded bg-surface-container-low px-4 py-3 text-on-background focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary-container py-4 font-bold text-on-primary transition-colors hover:bg-primary"
                >
                  <span>{isSubmitting || isLoading ? 'Signing In...' : 'Login to Dashboard'}</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                <Link
                  to="/register"
                  className="flex w-full items-center justify-center rounded border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  New here? Register
                </Link>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-container-high" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface-container-lowest px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-outline">
                      Quick Access
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded border border-transparent py-3 font-bold text-error transition-all hover:border-error-container hover:bg-error-container/10"
                >
                  <span className="material-symbols-outlined text-lg">emergency</span>
                  <span>SOS Access</span>
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-center text-[11px] font-medium uppercase tracking-tight text-outline">
              Raahi Safety System - Secure Access - 2024
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
            <span className="font-headline font-bold tracking-tight text-primary">Raahi Safety</span>
            <p className="text-sm tracking-wide text-on-surface-variant">
              Copyright 2024 Raahi Safety System. Smart tourist safety platform.
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
