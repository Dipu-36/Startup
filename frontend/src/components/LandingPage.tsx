import React, { useState, useEffect, useMemo } from 'react';
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../config/appConfig';
import ContinuousCounter from './shared/ContinuousCounter';
import FloatingCard from './shared/FloatingCard';
import AnimatedCard from './shared/AnimatedCard';
import MagicalBackground from './shared/MagicalBackground';

const LandingPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);
  // Typewriter effect for rotating brand text
  const brandTexts = useMemo(() => [
    'Brands',
    'Beauty Brands',
    'Gaming Companies'
  ], []);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typewriterTimer = setTimeout(() => {
      const fullText = brandTexts[currentTextIndex];
      
      if (isTyping) {
        if (charIndex < fullText.length) {
          setCurrentText(fullText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing, wait before deleting
          setTimeout(() => setIsTyping(false), 1500);
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(fullText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting, move to next text
          setIsTyping(true);
          setCurrentTextIndex((currentTextIndex + 1) % brandTexts.length);
        }
      }
    }, isTyping ? 100 : 50); // Typing speed vs deleting speed

    return () => clearTimeout(typewriterTimer);
  }, [currentTextIndex, charIndex, isTyping, brandTexts]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-dynamic bg-background relative overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-display font-bold text-primary tracking-tight">
                {APP_NAME}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="btn-primary animate-pulse-glow">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 animate-fadeIn">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground animate-float">
              Trusted by 10,000+ Creators & Brands
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fadeIn tracking-tight">
            Connect Creators with{" "}
            <span className="text-gradient relative">
              {currentText}
              <span className="animate-typewriter-cursor text-primary ml-1">|</span>
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fadeIn">
            AdFluence is the professional platform where content creators and brands collaborate on authentic influencer
            marketing campaigns. Build trust, track performance, and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="btn-primary animate-pulse-glow flex items-center justify-center space-x-2">
                <span>Join as Creator</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </SignUpButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="btn-secondary bg-transparent backdrop-blur-sm">
                Join as Brand
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 backdrop-blur-sm relative">
        <MagicalBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-gradient">AdFluence</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for transparency, trust, and successful collaborations between creators and brands.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FloatingCard index={0} className="card bg-card/50 backdrop-blur-sm border-border/50 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary group-hover:text-purple-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Verified Profiles</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                All creators link their social accounts for verification. Brands see real metrics and engagement data.
              </p>
            </FloatingCard>

            <FloatingCard index={1} className="card bg-card/50 backdrop-blur-sm border-border/50 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary group-hover:text-purple-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Smart Matching</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Our algorithm matches creators with relevant brand campaigns based on audience, niche, and performance.
              </p>
            </FloatingCard>

            <FloatingCard index={2} className="card bg-card/50 backdrop-blur-sm border-border/50 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary group-hover:text-purple-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Performance Analytics</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Track campaign performance, engagement rates, and ROI with comprehensive analytics and reporting.
              </p>
            </FloatingCard>

            <FloatingCard index={3} className="card bg-card/50 backdrop-blur-sm border-border/50 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary group-hover:text-purple-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Trust & Safety</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Public reputation scores and payment reliability ratings help both sides make informed decisions.
              </p>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start <span className="text-gradient">Collaborating</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators and brands already using AdFluence to build successful partnerships.
          </p>
          <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
            <button className="btn-primary animate-pulse-glow flex items-center justify-center space-x-2 mx-auto">
              <span>Get Started Today</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </SignUpButton>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard index={0} className="text-center">
              <ContinuousCounter 
                startValue={250} 
                interval={3000}
                suffix="+" 
                className="text-4xl font-bold text-primary mb-2" 
              />
              <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">BRANDS</div>
            </AnimatedCard>
            <AnimatedCard index={1} className="text-center">
              <ContinuousCounter 
                startValue={150} 
                interval={4000}
                suffix="+" 
                className="text-4xl font-bold text-primary mb-2" 
              />
              <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">CREATORS</div>
            </AnimatedCard>
            <AnimatedCard index={2} className="text-center">
              <ContinuousCounter 
                startValue={30} 
                interval={5000}
                suffix="+" 
                className="text-4xl font-bold text-primary mb-2" 
              />
              <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">SUCCESSFUL CAMPAIGNS</div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-lg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 text-primary">
            {APP_NAME}
          </h3>
          <p className="text-muted-foreground">
            Connecting creators and brands for authentic influencer marketing campaigns.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
