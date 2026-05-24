import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, LogIn, CheckCircle } from "lucide-react";

const schema = z.object({
  rating: z.number().min(1).max(5),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
});
type FormData = z.infer<typeof schema>;

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              i <= (hover || value) ? "star-filled fill-current" : "star-empty"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const displayName = review.userDiscordUsername || review.userName || "Anonymous";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glow-border rounded-xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={review.userAvatar ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {displayName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{displayName}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "star-filled fill-current" : "star-empty"}`} />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{review.body}</p>
    </motion.div>
  );
}

export default function Reviews() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: reviews = [], isLoading } = trpc.reviews.list.useQuery();
  const { data: myReview } = trpc.reviews.myReview.useQuery(undefined, { enabled: isAuthenticated });

  const [rating, setRating] = useState(5);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, body: "" },
  });

  const submitMutation = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      toast.success("Review submitted! Thank you for your feedback.");
      reset();
      utils.reviews.list.invalidate();
      utils.reviews.myReview.invalidate();
    },
    onError: (err) => toast.error(err.message || "Failed to submit review."),
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const onSubmit = (data: FormData) => {
    submitMutation.mutate({ ...data, rating });
  };

  return (
    <PageWrapper>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, oklch(0.65 0.22 290 / 0.06) 0%, transparent 70%)" }}
      />

      <div className="container py-20 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Community Reviews
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Server <span className="text-gradient">Reviews</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            What people say about Nash's Discord server and services.
          </p>

          {avgRating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              <span className="text-4xl font-black text-gradient">{avgRating}</span>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= Math.round(Number(avgRating)) ? "star-filled fill-current" : "star-empty"}`} />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">{reviews.length} reviews</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Submit form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass glow-border rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Leave a Review
              </h3>

              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <LogIn className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-4">
                    You must be signed in to leave a review.
                  </p>
                  <Button
                    onClick={() => (window.location.href = getLoginUrl())}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In to Review
                  </Button>
                </div>
              ) : myReview ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">You've already submitted a review. Thank you!</p>
                  <div className="flex justify-center gap-0.5 mt-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= myReview.rating ? "star-filled fill-current" : "star-empty"}`} />
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Rating</Label>
                    <StarSelector value={rating} onChange={setRating} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Your Review *</Label>
                    <Textarea
                      placeholder="Share your experience with Nash's server..."
                      rows={5}
                      className="bg-input/50 border-border/60 focus:border-primary/60 resize-none text-sm"
                      {...register("body")}
                    />
                    {errors.body && <p className="text-destructive text-xs">{errors.body.message}</p>}
                  </div>
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Reviews list */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-6 h-40 shimmer" />
              ))
            ) : reviews.length === 0 ? (
              <div className="glass glow-border rounded-xl p-12 text-center">
                <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
              </div>
            ) : (
              reviews.map((review: any) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
