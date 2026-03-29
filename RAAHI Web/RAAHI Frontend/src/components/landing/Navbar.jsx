import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSectionClick = (sectionId) => {
    if (!sectionId) {
      return;
    }

    if (!isHomePage) {
      navigate('/');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-surface-container-lowest/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link to="/" className="font-headline text-xl font-bold uppercase tracking-[0.16em] text-primary">
          RAAHI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSectionClick(item.sectionId)}
              className="text-base font-semibold tracking-tight text-on-surface-variant transition-colors hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="bg-error px-5 py-2 text-sm font-bold text-on-error transition-opacity hover:opacity-90"
          >
            Emergency Access
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center border border-outline-variant text-primary md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="material-symbols-outlined text-[24px]">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-nav" className="border-t border-outline-variant/40 bg-surface-container-lowest md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 sm:px-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSectionClick(item.sectionId)}
                className="py-2 text-left text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Login
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center bg-error px-5 py-3 text-sm font-bold text-on-error transition-opacity hover:opacity-90"
              >
                Emergency Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
