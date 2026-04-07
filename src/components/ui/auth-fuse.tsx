'use client';

import * as React from 'react';
import { useState, useId, useEffect } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, Scale } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 40,
  cursor = '|',
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || '';

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentText, loop, speed, deleteSpeed, delay, displayText, text]);

  return (
    <span className={cn('font-display', className)}>
      {displayText}
      <span className="animate-pulse text-purple">{cursor}</span>
    </span>
  );
}

const labelVariants = cva(
  'text-xs uppercase tracking-[0.2em] font-bold text-text-tertiary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-purple text-white hover:bg-purple-light shadow-lg shadow-purple/10',
        destructive: 'bg-accent-error text-white hover:bg-red-600',
        outline:
          'border border-white/5 bg-raised/50 hover:bg-void/5 hover:border-purple/30 text-text-primary',
        secondary: 'bg-ink text-white hover:bg-ink/80 border border-white/5',
        ghost: 'hover:bg-void/5 text-text-secondary hover:text-white',
        link: 'text-purple underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-lg px-4',
        lg: 'h-14 rounded-2xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl border border-white/5 bg-void px-4 py-3 text-sm text-text-primary shadow-inner transition-all placeholder:text-text-tertiary focus-visible:border-purple/50 focus-visible:bg-void/[0.02] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? 'text' : 'password'}
            className={cn('pe-12', className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center text-text-tertiary transition-colors hover:text-purple focus-visible:text-purple focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

function SignInForm() {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('UI: Sign In form submitted');
  };
  return (
    <form onSubmit={handleSignIn} autoComplete="on" className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-display font-semibold text-white">
          Welcome <span className="text-purple-gradient">Back</span>
        </h1>
        <p className="text-sm text-text-tertiary font-body">
          Enter your legal credentials to continue.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Official Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="advocate@justiceai.law"
            required
            autoComplete="email"
          />
        </div>
        <PasswordInput
          name="password"
          label="Security Key"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
        <Button type="submit" variant="default" className="mt-4">
          Sign In to Dashboard
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('UI: Sign Up form submitted');
  };
  return (
    <form onSubmit={handleSignUp} autoComplete="on" className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-display font-semibold text-white">
          Join the <span className="text-purple-gradient">Network</span>
        </h1>
        <p className="text-sm text-text-tertiary font-body">
          Create your secure legal officer profile.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Arjun Sharma"
            required
            autoComplete="name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Official Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="advocate@justiceai.law"
            required
            autoComplete="email"
          />
        </div>
        <PasswordInput
          name="password"
          label="Security Key"
          required
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <Button type="submit" variant="default" className="mt-4">
          Create Account
        </Button>
      </div>
    </form>
  );
}

function AuthFormContainer({ isSignIn, onToggle }: { isSignIn: boolean; onToggle: () => void }) {
  return (
    <div className="mx-auto grid w-full max-w-[400px] gap-8">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center">
          <Scale className="w-6 h-6 text-purple" />
        </div>
      </div>

      {isSignIn ? <SignInForm /> : <SignUpForm />}

      <div className="text-center text-xs font-bold tracking-widest uppercase text-text-tertiary">
        {isSignIn ? 'New to the city?' : 'Already have clinical access?'}{' '}
        <button
          className="text-purple hover:text-purple-light transition-colors ml-1"
          onClick={onToggle}
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

      <Button
        variant="outline"
        type="button"
        className="gap-3"
        onClick={() => console.log('UI: Google clicked')}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-4 w-4"
        />
        Auth via Google Cloud
      </Button>
    </div>
  );
}

const signInContent = {
  image:
    'https://images.unsplash.com/photo-1453919104169-906d4e2d312d?q=80&w=2072&auto=format&fit=crop',
  quote: "Justice is blind, but it's not invisible. I see things the way they really are.",
  author: 'Supreme Co-pilot',
};

const signUpContent = {
  image:
    'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=2070&auto=format&fit=crop',
  quote: 'A man is defined by his choices. I choose to defend this city.',
  author: 'Supreme Co-pilot',
};

export function AuthUI() {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn((prev) => !prev);

  const current = isSignIn ? signInContent : signUpContent;

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-void overflow-hidden">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1 relative z-10 bg-void">
        <AuthFormContainer isSignIn={isSignIn} onToggle={toggleForm} />
      </div>

      {/* Visual Panel */}
      <div className="hidden lg:block relative order-1 lg:order-2 overflow-hidden bg-raised">
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 [background-image:var(--auth-bg)] [filter:brightness(0.5)_saturate(1.1)]"
          style={{ '--auth-bg': `url(${current.image})` } as React.CSSProperties}
          key={current.image}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end p-16 space-y-8">
          <blockquote className="space-y-4 max-w-lg">
            <p className="text-3xl font-display font-semibold text-white leading-tight italic">
              “<Typewriter key={current.quote} text={current.quote} speed={50} />”
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
    </div>
  );
}
