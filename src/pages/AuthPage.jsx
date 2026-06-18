import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Eye, EyeOff } from 'lucide-react';

const signInContent = {
  image: 'https://images.unsplash.com/photo-1453919104169-906d4e2d312d?q=80&w=2072&auto=format&fit=crop',
  quote: "Justice is blind, but it's not invisible. I see things the way they really are.",
  author: 'Supreme Co-pilot',
};

const signUpContent = {
  image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=2070&auto=format&fit=crop',
  quote: 'A man is defined by his choices. I choose to defend this city.',
  author: 'Supreme Co-pilot',
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn((prev) => !prev);
  const current = isSignIn ? signInContent : signUpContent;

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleAuth = (event) => {
    event.preventDefault();
    console.log(isSignIn ? 'UI: Sign In form submitted' : 'UI: Sign Up form submitted');
    // Simulate auth success and redirect
    localStorage.setItem('justice_auth_user', JSON.stringify({
      id: 'usr_mock123',
      role: 'advocate',
      name: 'Advocate Kumar',
    }));
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-void w-full lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Navigation Layer */}
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 px-6 py-3 rounded-sm bg-void border-2 border-white/5 hover:border-gold/40 hover:bg-gold/5 transition-all backdrop-blur-md shadow-hard italic"
        >
          <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-text-secondary group-hover:text-gold transition-all">
            RETURN_TO_BASE
          </span>
        </button>
      </div>

      {/* Brand Watermark for Mobile */}
      <div className="lg:hidden fixed top-8 right-8 z-50">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-gold" />
          <span className="font-display text-lg font-bold text-white tracking-widest uppercase italic">
            JusticeAI
          </span>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1 relative z-10 bg-void">
        <div className="mx-auto grid w-full max-w-[400px] gap-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-purple" />
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
                {isSignIn ? 'Terminal Access' : 'New Assignment'}
              </h1>
              <p className="text-sm font-medium tracking-widest uppercase text-text-tertiary">
                {isSignIn ? 'Enter credentials' : 'Establish credentials'}
              </p>
            </div>

            <div className="space-y-4">
              {!isSignIn && (
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.2em] font-bold text-text-tertiary leading-none" htmlFor="fullName">
                    Designation / Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Adv. K. Sharma"
                    required
                    autoComplete="name"
                    className="flex h-12 w-full rounded-xl border border-white/5 bg-void px-4 py-3 text-sm text-text-primary shadow-inner transition-all placeholder:text-text-tertiary focus-visible:border-purple/50 focus-visible:bg-void/[0.02] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.2em] font-bold text-text-tertiary leading-none" htmlFor="email">
                  Secure Comms Channel
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="advocate@justiceai.law"
                  required
                  autoComplete="email"
                  className="flex h-12 w-full rounded-xl border border-white/5 bg-void px-4 py-3 text-sm text-text-primary shadow-inner transition-all placeholder:text-text-tertiary focus-visible:border-purple/50 focus-visible:bg-void/[0.02] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.2em] font-bold text-text-tertiary leading-none" htmlFor="password">
                  Security Key
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    autoComplete={isSignIn ? "current-password" : "new-password"}
                    className="flex h-12 w-full rounded-xl border border-white/5 bg-void px-4 py-3 text-sm text-text-primary shadow-inner transition-all placeholder:text-text-tertiary focus-visible:border-purple/50 focus-visible:bg-void/[0.02] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pe-12"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center text-text-tertiary transition-colors hover:text-purple focus-visible:text-purple focus-visible:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-purple text-white hover:bg-purple-light shadow-lg shadow-purple/10 h-11 px-6 py-2 w-full"
              >
                {isSignIn ? 'Authenticate' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="text-center text-xs font-bold tracking-widest uppercase text-text-tertiary">
            {isSignIn ? 'New to the city?' : 'Already have clinical access?'}{' '}
            <button
              className="text-purple hover:text-purple-light transition-colors ml-1"
              onClick={toggleForm}
            >
              {isSignIn ? 'Begin Here' : 'Sign In'}
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative z-10 bg-[#0D0D0D] px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-text-tertiary">
              Secure Bridge
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-xl text-sm font-bold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] border border-white/5 bg-raised/50 hover:bg-void/5 hover:border-purple/30 text-text-primary h-11 px-6 py-2 w-full"
            onClick={() => console.log('UI: Google clicked')}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-4 w-4"
            />
            Auth via Google Cloud
          </button>
        </div>
      </div>

      {/* Visual Panel */}
      <div className="hidden lg:block relative order-1 lg:order-2 overflow-hidden bg-raised">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 [filter:brightness(0.5)_saturate(1.1)]"
          style={{ backgroundImage: `url(${current.image})` }}
          key={current.image}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end p-16 space-y-8">
          <blockquote className="space-y-4 max-w-lg">
            <p className="text-3xl font-display font-semibold text-white leading-tight italic">
              “{current.quote}”
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-purple" />
              <cite className="text-xs uppercase tracking-[0.4em] font-bold text-purple not-italic">
                {current.author}
              </cite>
            </footer>
          </blockquote>

          <div className="flex gap-12 pt-8">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">
                Jurisdiction
              </p>
              <p className="text-sm font-bold text-white">New Delhi, India</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">
                Firm
              </p>
              <p className="text-sm font-bold text-white">Citizen's Counsel</p>
            </div>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      {/* Bottom Legal Attribution */}
      <div className="fixed bottom-6 right-8 z-50 hidden lg:block">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-text-tertiary italic">
          SYSTEM_NODE: <span className="text-gold">CITIZEN_COUNSEL_v4.2</span> // SECURE_HANDSHAKE
        </p>
      </div>
    </div>
  );
}
