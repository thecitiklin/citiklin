import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/routes';
import { CheckCircle, Sparkles, Shield, Clock, Phone, Mail, MapPin } from 'lucide-react';

const services = [
  { title: 'Office Cleaning', description: 'Professional cleaning for commercial spaces' },
  { title: 'Residential Cleaning', description: 'Deep cleaning for homes and apartments' },
  { title: 'Industrial Cleaning', description: 'Heavy-duty cleaning for factories and warehouses' },
  { title: 'Specialized Sanitization', description: 'Medical-grade disinfection services' },
];

const features = [
  { icon: Sparkles, title: 'Quality Service', description: 'Trained professionals using premium products' },
  { icon: Shield, title: 'Insured & Bonded', description: 'Full coverage for peace of mind' },
  { icon: Clock, title: 'Flexible Scheduling', description: 'Book at your convenience, 7 days a week' },
];

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Professional Cleaning Services for{' '}
              <span className="text-primary">Every Space</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Citi Klin delivers premium cleaning solutions for homes, offices, and industrial
              spaces. Experience spotless results with our trained professionals.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to={ROUTES.CONTACT}>
                <Button size="lg" className="w-full sm:w-auto">
                  Get a Free Quote
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Client Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold">Our Services</h2>
            <p className="text-muted-foreground">
              Comprehensive cleaning solutions tailored to your needs
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold">Why Choose Citi Klin?</h2>
            <p className="text-muted-foreground">
              We go above and beyond to deliver exceptional results
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-3xl font-semibold">Ready to Get Started?</h2>
                <p className="mb-8 text-primary-foreground/80">
                  Contact us today for a free consultation and quote. Our team is ready to help
                  you with all your cleaning needs.
                </p>
                <Link to={ROUTES.CONTACT}>
                  <Button size="lg" variant="secondary">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <span className="font-display text-lg font-bold text-primary-foreground">CK</span>
                </div>
                <span className="font-display text-xl font-semibold">Citi Klin</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional cleaning services for homes, offices, and industrial spaces.
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
                  <Phone className="h-4 w-4" /> +254 700 000 000
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
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Citi Klin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
