import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Book, MessageCircle, Phone, Mail, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const categories = [
  { id: 'booking', name: 'Booking & Scheduling', icon: Book, count: 8 },
  { id: 'services', name: 'Our Services', icon: FileText, count: 12 },
  { id: 'pricing', name: 'Pricing & Payments', icon: FileText, count: 6 },
  { id: 'account', name: 'Account & Login', icon: HelpCircle, count: 5 },
];

const faqs = [
  {
    category: 'booking',
    question: 'How do I book a cleaning service?',
    answer: 'You can book a cleaning service by clicking the "Book Service" button on our website, calling our customer service line at +254 700 123 456, or sending us an email at thecitiklin@gmail.com. Our team will confirm your booking within 2 hours.',
  },
  {
    category: 'booking',
    question: 'Can I reschedule or cancel my booking?',
    answer: 'Yes, you can reschedule or cancel your booking up to 24 hours before the scheduled time at no extra cost. For cancellations made within 24 hours, a 20% cancellation fee may apply.',
  },
  {
    category: 'booking',
    question: 'What areas do you serve?',
    answer: 'We currently serve all areas within Nairobi and its environs including Westlands, Karen, Kilimani, Lavington, Kileleshwa, and surrounding neighborhoods. Contact us for services outside these areas.',
  },
  {
    category: 'services',
    question: 'What cleaning services do you offer?',
    answer: 'We offer a comprehensive range of cleaning services including regular house cleaning, deep cleaning, office/commercial cleaning, post-construction cleaning, move-in/move-out cleaning, and specialized services like carpet and upholstery cleaning.',
  },
  {
    category: 'services',
    question: 'Do you bring your own cleaning supplies?',
    answer: 'Yes, our teams come fully equipped with professional-grade cleaning supplies and equipment. We use eco-friendly products unless you have specific preferences. Let us know if you have any allergies or special requirements.',
  },
  {
    category: 'services',
    question: 'Are your cleaners insured and background checked?',
    answer: 'Absolutely! All our cleaning professionals undergo thorough background checks and are fully insured. We take your safety and security very seriously.',
  },
  {
    category: 'pricing',
    question: 'How is pricing determined?',
    answer: 'Our pricing is based on the type of service, size of the property, and specific requirements. We provide transparent quotes upfront with no hidden fees. Contact us for a free personalized quote.',
  },
  {
    category: 'pricing',
    question: 'What payment methods do you accept?',
    answer: 'We accept multiple payment methods including M-Pesa, credit/debit cards, PayPal, and bank transfers. Payment is due after the service is completed to your satisfaction.',
  },
  {
    category: 'account',
    question: 'Do I need an account to book?',
    answer: 'No, you can book as a guest. However, creating an account allows you to track your bookings, view service history, and enjoy faster checkout for future bookings.',
  },
  {
    category: 'account',
    question: 'How do I access my customer dashboard?',
    answer: 'If you have an account, you can log in through our website to access your customer dashboard where you can manage bookings, view invoices, and communicate with our support team.',
  },
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-background text-foreground"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Categories */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <span>All Topics</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="h-5 w-5" />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{category.count}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+254700123456"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-sm text-muted-foreground">+254 700 123 456</p>
                    </div>
                  </a>
                  <a
                    href="mailto:support@citiklin.co.ke"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@citiklin.co.ke</p>
                    </div>
                  </a>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Contact Form</p>
                      <p className="text-sm text-muted-foreground">Send us a message</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : 'Frequently Asked Questions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try a different search term or browse by category.
                    </p>
                    <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
