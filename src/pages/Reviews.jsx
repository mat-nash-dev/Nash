import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareQuote, Lock } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel('public:reviews')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, (payload) => {
        fetchReviewWithUser(payload.new.id);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'reviews' }, (payload) => {
        setReviews((prev) => prev.filter((r) => r.id !== payload.old.id));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const fetchReviewWithUser = async (id) => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username, avatar_url)')
      .eq('id', id)
      .single();
    if (data) {
      setReviews((prev) => [data, ...prev]);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user || !newReview.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert([
      { user_id: user.id, content: newReview, rating }
    ]);

    if (error) {
      toast.error('Failed to post review');
    } else {
      toast.success('Review posted!');
      setNewReview('');
      setRating(5);
    }
    setSubmitting(false);
  };

  return (
    <div className="container">
      <AnimatedSection>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Server <span className="text-gradient">Reviews</span></h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          See what others are saying about the server and my services. Your feedback is always appreciated!
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-12">
        
        {/* Post Review Form */}
        <AnimatedSection delay={0.2}>
          {user ? (
            <div className="glass p-8 rounded-2xl glow-border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquareQuote size={20} className="text-primary" /> Leave a Review
              </h3>
              <form onSubmit={submitReview} className="flex flex-col gap-4">
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star size={32} fill={star <= rating ? '#fbbf24' : 'none'} className={star <= rating ? 'text-amber-400' : 'text-muted-foreground/30'} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience..." 
                  rows="4"
                  className="bg-secondary border border-border/50 rounded-xl p-4 focus:outline-none focus:border-primary/50 transition-colors resize-y w-full"
                  required
                />
                <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg self-start transition-all hover:scale-105 glow" disabled={submitting || !newReview.trim()}>
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass p-12 text-center flex flex-col items-center gap-4 rounded-2xl">
              <Lock size={48} className="text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg">You must be logged in to post a review.</p>
              <a href="/auth" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors inline-block mt-2">Log In</a>
            </div>
          )}
        </AnimatedSection>

        {/* Reviews List */}
        <AnimatedSection delay={0.4}>
          {loading ? (
            <div className="text-center text-muted-foreground py-12 flex justify-center">
              <div className="w-10 h-10 border-4 border-accent border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 bg-secondary/30 rounded-2xl border border-dashed border-border/50">
              No reviews yet. Be the first to leave one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="glass p-6 rounded-2xl flex flex-col group transition-all hover:glass-strong hover:glow-border"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={star <= review.rating ? '#fbbf24' : 'none'} className={star <= review.rating ? 'text-amber-400' : 'text-muted-foreground/20'} />
                    ))}
                  </div>
                  <p className="flex-1 mb-6 italic text-foreground leading-relaxed">"{review.content}"</p>
                  
                  <div className="flex items-center gap-4 border-t border-border/50 pt-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border/50 flex-shrink-0">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-primary/20 text-primary">
                          {review.profiles?.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{review.profiles?.username || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Reviews;
