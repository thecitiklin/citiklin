import { useState } from 'react';
import { Star, ThumbsUp, Quote, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Mary Wanjiku',
    rating: 5,
    date: '2024-01-18',
    comment: 'Excellent service! The team was very professional and thorough. My office has never looked better. Highly recommend Citi Klin for commercial cleaning.',
    service: 'Office Cleaning',
    helpful: 12,
  },
  {
    id: '2',
    name: 'James Odera',
    rating: 4,
    date: '2024-01-15',
    comment: 'Great deep cleaning service for our apartment before moving in. They were punctual and did a fantastic job. Would use again!',
    service: 'Move-in Cleaning',
    helpful: 8,
  },
  {
    id: '3',
    name: 'Grace Muthoni',
    rating: 5,
    date: '2024-01-12',
    comment: 'I\'ve been using Citi Klin for our restaurant kitchen cleaning for months now. They understand the importance of hygiene standards. Very reliable!',
    service: 'Commercial Kitchen Cleaning',
    helpful: 15,
  },
  {
    id: '4',
    name: 'Peter Kimani',
    rating: 5,
    date: '2024-01-10',
    comment: 'Amazing attention to detail. The team cleaned areas I didn\'t even think about. Worth every shilling!',
    service: 'Deep Cleaning',
    helpful: 6,
  },
  {
    id: '5',
    name: 'Sarah Achieng',
    rating: 4,
    date: '2024-01-08',
    comment: 'Good service overall. The booking process was easy and the cleaners arrived on time. Minor issue with communication but they resolved it quickly.',
    service: 'Residential Cleaning',
    helpful: 4,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 45, percentage: 75 },
  { stars: 4, count: 12, percentage: 20 },
  { stars: 3, count: 2, percentage: 3 },
  { stars: 2, count: 1, percentage: 1.5 },
  { stars: 1, count: 0, percentage: 0.5 },
];

export default function ReviewsPage() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Review submitted!',
      description: 'Thank you for your feedback. Your review will be published after moderation.',
    });
    setShowReviewForm(false);
    setRating(0);
  };

  const averageRating = 4.7;
  const totalReviews = 60;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            See what our customers say about our professional cleaning services.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Rating Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(averageRating)
                          ? 'fill-warning text-warning'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{item.stars}</span>
                      <Star className="h-4 w-4 fill-warning text-warning" />
                    </div>
                    <Progress value={item.percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {showReviewForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors ${
                                star <= (hoverRating || rating)
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <Input placeholder="John Doe" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Type</label>
                      <Input placeholder="e.g., Office Cleaning" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea
                        placeholder="Share your experience..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Submit Review</Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{review.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'fill-warning text-warning'
                                      : 'text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{review.service}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Quote className="h-5 w-5 text-muted-foreground shrink-0" />
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
