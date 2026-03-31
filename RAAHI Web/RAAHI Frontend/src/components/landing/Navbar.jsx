import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const displayName = useMemo(() => {
    if (!user) {
      return 'Profile';
    }
    if (user.fullName) {
      return user.fullName;
    }
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Profile';
  }, [user]);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleNavItemClick = (item) => {
    if (item.route) {
      navigate(item.route);
      return;
    }

    if (!item.sectionId) {
      return;
    }

    if (!isHomePage) {
      navigate('/');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(item.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      return;
    }

    document.getElementById(item.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
              onClick={() => handleNavItemClick(item)}
              className="text-base font-semibold tracking-tight text-on-surface-variant transition-colors hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {!isLoading && !isAuthenticated && (
            <>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Login
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((current) => !current)}
                className="flex items-center gap-3 border border-outline-variant/50 bg-surface-container-low px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {(displayName[0] || 'P').toUpperCase()}
                </span>
                <span>{displayName}</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-14 min-w-56 border border-outline-variant/50 bg-surface-container-lowest p-2 shadow-lg">
                  <div className="border-b border-outline-variant/30 px-3 py-2">
                    <div className="text-sm font-semibold text-primary">{displayName}</div>
                    <div className="text-xs text-on-surface-variant">{user?.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="mt-2 block px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
                onClick={() => handleNavItemClick(item)}
                className="py-2 text-left text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              {!isLoading && !isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    Login
                  </Link>
                </>
              )}

              {!isLoading && isAuthenticated && (
                <>
                  <div className="rounded border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-sm">
                    <div className="font-semibold text-primary">{displayName}</div>
                    <div className="text-xs text-on-surface-variant">{user?.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center border border-outline-variant/50 bg-surface-container-low px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-high"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center bg-surface-container px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-high"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
