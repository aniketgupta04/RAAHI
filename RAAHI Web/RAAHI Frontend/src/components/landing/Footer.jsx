const Footer = ({ links }) => {
  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-low px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="font-headline text-lg font-bold uppercase tracking-[0.16em] text-primary">RAAHI</div>
          <p className="mt-2 max-w-md text-sm tracking-wide text-on-surface-variant">
            © 2024 Digital Authority Safety System. All rights reserved. Official government resource.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 md:gap-10">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-wide text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
