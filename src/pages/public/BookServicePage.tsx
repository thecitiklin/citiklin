import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, Sparkles, Building, Home } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Please select a service type'),
  propertyType: z.string().min(1, 'Please select a property type'),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, 'Please select a time slot'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(10, 'Please enter your full address'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const services = [
  { id: 'regular', name: 'Regular Cleaning', price: 'From KES 3,000', icon: Sparkles },
  { id: 'deep', name: 'Deep Cleaning', price: 'From KES 8,000', icon: Sparkles },
  { id: 'move-in', name: 'Move-in/Move-out', price: 'From KES 12,000', icon: Home },
  { id: 'office', name: 'Office Cleaning', price: 'From KES 5,000', icon: Building },
];

const timeSlots = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];

export default function BookServicePage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: '',
      propertyType: '',
      time: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Booking submitted
    setIsSubmitted(true);
    toast({
      title: 'Booking confirmed!',
      description: 'We will contact you shortly to confirm your appointment.',
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="rounded-full bg-accent/10 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your booking. Our team will contact you within 2 hours to confirm the details.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/')}>Back to Home</Button>
              <Button variant="outline" onClick={() => { setIsSubmitted(false); setStep(1); form.reset(); }}>
                Book Another Service
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Book a Service</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Schedule your professional cleaning service in just a few steps.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {s}
                </div>
                {s < 3 && <div className={cn('w-16 h-1', step > s ? 'bg-primary' : 'bg-muted')} />}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="max-w-3xl mx-auto">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Your Service</CardTitle>
                    <CardDescription>Choose the type of cleaning service you need</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid gap-4 md:grid-cols-2">
                              {services.map((service) => (
                                <div key={service.id}>
                                  <RadioGroupItem value={service.id} id={service.id} className="peer sr-only" />
                                  <label
                                    htmlFor={service.id}
                                    className={cn(
                                      'flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-colors',
                                      'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5',
                                      'hover:bg-muted/50'
                                    )}
                                  >
                                    <service.icon className="h-8 w-8 text-primary" />
                                    <div>
                                      <p className="font-medium">{service.name}</p>
                                      <p className="text-sm text-muted-foreground">{service.price}</p>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="residential" id="residential" />
                                <label htmlFor="residential">Residential</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="commercial" id="commercial" />
                                <label htmlFor="commercial">Commercial</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        if (form.getValues('serviceType') && form.getValues('propertyType')) {
                          setStep(2);
                        } else {
                          form.trigger(['serviceType', 'propertyType']);
                        }
                      }}
                    >
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>Choose your preferred appointment slot</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-5 gap-2">
                              {timeSlots.map((slot) => (
                                <div key={slot}>
                                  <RadioGroupItem value={slot} id={slot} className="peer sr-only" />
                                  <label
                                    htmlFor={slot}
                                    className={cn(
                                      'flex items-center justify-center rounded-lg border p-2 text-sm cursor-pointer transition-colors',
                                      'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5',
                                      'hover:bg-muted/50'
                                    )}
                                  >
                                    {slot}
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => {
                          if (form.getValues('date') && form.getValues('time')) {
                            setStep(3);
                          } else {
                            form.trigger(['date', 'time']);
                          }
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Details</CardTitle>
                    <CardDescription>Provide your contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+254 7XX XXX XXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Westlands, Nairobi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requirements or access instructions..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Booking...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
