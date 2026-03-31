import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Compass, Handshake } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page animate-fade-in">
      <section className="hero-section text-center">
        <h1 className="hero-title">Exchange Skills, Not Money</h1>
        <p className="hero-subtitle text-muted">Join a professional community where you can teach what you know and learn what you need through structured, one-on-one collaboration.</p>
        <div className="hero-actions">
          <Link to="/profile" className="btn btn-primary hero-btn">Start Swapping</Link>
          <Link to="/discover" className="btn btn-outline hero-btn">Explore Skills</Link>
        </div>
      </section>

      <section className="how-it-works container">
        <h2 className="text-center mb-8">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card card text-center p-6">
            <div className="step-icon">
              <UserPlus size={32} />
            </div>
            <h3>1. Create Profile</h3>
            <p className="text-muted mt-2">List the skills you can offer and the skills you want to learn. Set your availability and proficiency level.</p>
          </div>
          
          <div className="step-card card text-center p-6">
            <div className="step-icon">
              <Compass size={32} />
            </div>
            <h3>2. Discover Matches</h3>
            <p className="text-muted mt-2">Our matching algorithm finds users with complementary skills. Review profiles, compatibility scores, and send swap requests.</p>
          </div>
          
          <div className="step-card card text-center p-6">
             <div className="step-icon">
              <Handshake size={32} />
            </div>
            <h3>3. Collaborate</h3>
            <p className="text-muted mt-2">Connect via structured exchanges. Agree on timelines, track progress, and build your professional network.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
