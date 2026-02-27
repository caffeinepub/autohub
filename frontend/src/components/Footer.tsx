import { Link } from '@tanstack/react-router';
import { Car, Heart, Phone, Mail, MapPin, User } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'autohub-app');

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-primary">Auto</span>Hub
              </span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              India's trusted platform for buying and selling pre-owned cars. Find your perfect car today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Browse Cars', path: '/listings' },
                { label: 'Sell My Car', path: '/sell' },
                { label: 'Check Resale Value', path: '/resale-value' },
                { label: 'Vehicle Lookup', path: '/vehicle-lookup' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60 mb-4">Popular Brands</h4>
            <ul className="space-y-2">
              {['Maruti Suzuki', 'Hyundai', 'Honda', 'Tata Motors', 'Mahindra', 'Toyota'].map((brand) => (
                <li key={brand}>
                  <span className="text-sm opacity-70">{brand}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <User className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                <div>
                  <p className="font-semibold opacity-90">Krishna Kant Pandey</p>
                  <p className="opacity-60 text-xs">Company Owner</p>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href="tel:+917836887228"
                  className="opacity-80 hover:opacity-100 hover:text-primary transition-colors font-medium"
                >
                  +91-7836887228
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>India</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@autohub.in</span>
              </li>
            </ul>
          </div>

          {/* Helpline */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60 mb-4">Helpline</h4>
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 space-y-2">
              <p className="text-xs opacity-60 uppercase tracking-wide">24/7 Support</p>
              <a
                href="tel:+917836887228"
                className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity"
              >
                <Phone className="w-5 h-5" />
                +91-7836887228
              </a>
              <p className="text-xs opacity-60 leading-relaxed">
                Call us for buying, selling, or any queries about your vehicle.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-60">
            © {year} AutoHub. All rights reserved.
          </p>
          <p className="text-sm opacity-60 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
