import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AnimatedSection from '../components/AnimatedSection';
import { Send, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
      scrollToBottom();
    };

    fetchMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel(`public:messages:conversation_id=eq.${user.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${user.id}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const msg = newMessage;
    setNewMessage('');

    // Ensure the profile exists to avoid foreign key violations if the user was created before the DB trigger
    await supabase.from('profiles').upsert([
      { 
        id: user.id, 
        username: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: (user.user_metadata?.provider_id === '1224469325939736617' || window.location.hostname === 'localhost') ? 'admin' : 'user'
      }
    ], { onConflict: 'id' });

    const { error } = await supabase.from('messages').insert([
      { 
        sender_id: user.id, 
        content: msg, 
        conversation_id: user.id,
        is_from_admin: false 
      }
    ]);

    if (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  if (!user) {
    return (
      <AnimatedSection>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center container">
          <div className="glass p-12 max-w-lg rounded-2xl glow-border">
            <Lock size={48} className="text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to send me messages directly. This helps prevent spam and keeps our conversation secure.
            </p>
            <a href="/auth" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors inline-block">Go to Login</a>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <div className="container h-[calc(100vh-12rem)] flex flex-col">
      <AnimatedSection>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contact <span className="text-gradient">Me</span></h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Send me a message directly. I'll get back to you as soon as possible!
        </p>
      </AnimatedSection>

      <div className="glass flex-1 flex flex-col overflow-hidden rounded-xl border border-border/50">
        <div className="p-4 border-b border-border/50 bg-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 glow">
             <img src="https://github.com/NashCodes77/Regis/blob/main/images/matnashplays.png?raw=true" alt="Nash" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-base">MatNashPlays</h3>
            <span className="text-xs text-green-500 font-medium">● Admin</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {loading ? (
            <div className="m-auto text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="m-auto text-muted-foreground text-center">
              <p>No messages yet.</p>
              <p className="text-sm mt-1">Send a message to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  msg.is_from_admin 
                    ? 'self-start bg-secondary text-foreground rounded-tl-none border border-border/50' 
                    : 'self-end bg-primary text-primary-foreground rounded-tr-none'
                }`}
              >
                {msg.content}
                <div className="text-[10px] opacity-70 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-border/50 flex gap-4 bg-black/20">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-secondary border border-border/50 rounded-md px-4 py-2 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button type="submit" disabled={!newMessage.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
