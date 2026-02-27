import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Menu, X, Car, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Buy a Car', path: '/listings' },
  { label: 'Sell My Car', path: '/sell' },
  { label: 'Resale Value', path: '/resale-value' },
  { label: 'Vehicle Lookup', path: '/vehicle-lookup' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              <span className="text-primary">Auto</span>
              <span className="text-foreground">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentPath === '/admin'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/sell">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                + List Your Car
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPath === '/admin'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Link>
            <div className="pt-2 border-t border-border mt-1">
              <Link to="/sell" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  + List Your Car
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
