import { Outlet } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';
import { footerLinks, navItems } from '../data/landingContent';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar navItems={navItems} />
      <Outlet />
      <Footer links={footerLinks} />
    </div>
  );
};

export default Layout;
