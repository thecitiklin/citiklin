import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export function PublicFooter() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-primary">Citi Klin</h3>
            <p className="text-sm text-muted-foreground">
              Professional cleaning services for homes, offices, and industrial spaces across Kenya.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Office Cleaning</li>
              <li>Residential Cleaning</li>
              <li>Industrial Cleaning</li>
              <li>Sanitization</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to={ROUTES.LOGIN} className="hover:text-primary">Client Portal</Link></li>
              <li><Link to={ROUTES.CONTACT} className="hover:text-primary">Contact Us</Link></li>
              <li><Link to={ROUTES.REVIEWS} className="hover:text-primary">Reviews</Link></li>
              <li><Link to={ROUTES.HELP} className="hover:text-primary">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +254739 996305
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> thecitiklin@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            This Business is developed by{' '}
            <a href="https://www.yasirzayed.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Yasir Zayed
            </a>
          </p>
          <p className="text-center">© {new Date().getFullYear()} Citi Klin. All Rights reserved to LCE. L.C.E is Citi Klin Parent Company.</p>
          <p>
            Powered by{' '}
            <a href="https://www.yasirzayed.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Yasir Zayed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
