import { useState } from 'react';
import { Star, ThumbsUp, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useReviews, useCreateReview, useUpdateReview } from '@/hooks/useReviews';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReviewsPage() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useReviews();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  // Only show approved reviews
  const approvedReviews = reviews.filter(r => r.is_approved);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createReview.mutateAsync({
        name,
        email: email || null,
        rating,
        service,
        comment,
        is_approved: false,
        helpful_count: 0,
      });
      
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback. Your review will be published after moderation.',
      });
      
      setShowReviewForm(false);
      setRating(0);
      setName('');
      setEmail('');
      setService('');
      setComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleHelpful = async (reviewId: string, currentCount: number) => {
    await updateReview.mutateAsync({
      id: reviewId,
      helpful_count: currentCount + 1,
    });
  };

  // Calculate rating stats from real data
  const totalReviews = approvedReviews.length;
  const averageRating = totalReviews > 0 
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = approvedReviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                        star <= Math.round(Number(averageRating))
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
                      <Input 
                        placeholder="John Doe" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email (optional)</label>
                      <Input 
                        type="email"
                        placeholder="john@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Type</label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Office Cleaning">Office Cleaning</SelectItem>
                          <SelectItem value="Residential Cleaning">Residential Cleaning</SelectItem>
                          <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                          <SelectItem value="Move-in Cleaning">Move-in Cleaning</SelectItem>
                          <SelectItem value="Commercial Kitchen Cleaning">Commercial Kitchen Cleaning</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea
                        placeholder="Share your experience..."
                        className="min-h-[120px]"
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={createReview.isPending}>
                        {createReview.isPending ? 'Submitting...' : 'Submit Review'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {approvedReviews.length > 0 ? (
              approvedReviews.map((review) => (
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
                          <span className="text-sm text-muted-foreground">
                            {review.created_at ? format(parseISO(review.created_at), 'MMM d, yyyy') : ''}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <Quote className="h-5 w-5 text-muted-foreground shrink-0" />
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground"
                            onClick={() => handleHelpful(review.id, review.helpful_count || 0)}
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Helpful ({review.helpful_count || 0})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
