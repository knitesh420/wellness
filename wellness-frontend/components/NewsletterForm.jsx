'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-sm bg-transparent">
      <div className="relative flex-1 group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full px-5 py-3 bg-[#0c0e14]/80 border border-white/[0.05] rounded-xl text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 focus:bg-[#0c0e14] focus:ring-4 focus:ring-blue-500/5 transition-all duration-300"
          required
        />
      </div>
      <button
        type="submit"
        disabled={submitted}
        className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-[14px] transition-all duration-500 shadow-lg ${submitted
          ? 'bg-emerald-500 text-white shadow-emerald-500/30'
          : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98]'
          }`}
      >
        {submitted ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Success!</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 -rotate-12 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            <span>Subscribe</span>
          </>
        )}
      </button>
    </form>
  );
}
