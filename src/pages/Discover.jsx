import React, { useState } from 'react';
import { X, Heart, Bookmark, Star, Info } from 'lucide-react';
import './Discover.css';

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Aisha',
    offered: 'UI/UX Design',
    wanted: 'React.js',
    rating: 4.8,
    time: '5 hours/week',
    compatibility: 92,
    explanation: 'Aisha is an expert in your wanted skill (UI/UX) and is looking for a beginner in React.js, matching your profile perfectly.'
  },
  {
    id: 2,
    name: 'Rahul',
    offered: 'Digital Marketing',
    wanted: 'Video Editing',
    rating: 4.6,
    time: '3 hours/week',
    compatibility: 85,
    explanation: 'You both share similar availability and complement each others creative skill sets.'
  },
];

const Discover = () => {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [direction, setDirection] = useState(null); // 'left' | 'right' | 'up' | null
  
  const activeProfile = profiles[0];

  const handleAction = (action) => {
    setDirection(action);
    setTimeout(() => {
      setProfiles(prev => prev.slice(1));
      setDirection(null);
    }, 400); // Wait for animation
  };

  if (!activeProfile) {
    return (
      <div className="discover-page container flex items-center justify-center flex-col animate-fade-in" style={{minHeight: '70vh'}}>
        <h2 className="text-muted">No more matches left for today!</h2>
        <button className="btn btn-primary mt-6" onClick={() => setProfiles(MOCK_PROFILES)}>Refresh Matches</button>
      </div>
    );
  }

  return (
    <div className="discover-page container">
      <div className="discover-header text-center mb-6">
        <h2>Discover Matches</h2>
        <p className="text-muted">Find the perfect professional swap partner.</p>
      </div>

      <div className="swipe-container">
        <div className={`card swipe-card ${direction ? `swipe-${direction}` : ''}`}>
          
          <div className="card-header justify-between flex items-center mb-6">
            <div className="compatibility-badge">
              {activeProfile.compatibility}% Match
            </div>
            <div className="rating flex items-center gap-2">
              <Star size={18} fill="#eab308" color="#eab308" />
              <span className="font-semibold" style={{fontSize: '1.1rem'}}>{activeProfile.rating}</span>
            </div>
          </div>

          <div className="skills-exchange flex flex-col gap-4 mb-6">
            <div className="skill-box offer-box">
              <span className="text-muted text-sm">Can offer:</span>
              <h3 className="skill-title">{activeProfile.offered}</h3>
            </div>
            
            <div className="exchange-icon flex justify-center text-muted">
              <span>&#8645;</span>
            </div>

            <div className="skill-box wanted-box">
              <span className="text-muted text-sm">Wants to learn:</span>
              <h3 className="skill-title">{activeProfile.wanted}</h3>
            </div>
          </div>

          <div className="time-commitment flex items-center justify-center gap-2 mb-6">
            <span className="badge" style={{fontSize: '0.85rem'}}>{activeProfile.time}</span>
          </div>

          <div className="ai-explanation mb-8 p-4 rounded-md flex gap-3">
            <Info size={24} className="text-primary flex-shrink-0" style={{marginTop: '2px'}} />
            <div>
              <p className="font-semibold" style={{color: '#1e3a8a'}}>Why this match?</p>
              <p className="text-muted text-sm mt-1 leading-relaxed">{activeProfile.explanation}</p>
            </div>
          </div>

          <div className="swipe-actions flex justify-center gap-6">
            <button className="action-btn skip" onClick={() => handleAction('left')} title="Skip">
              <X size={28} />
            </button>
            <button className="action-btn save" onClick={() => handleAction('up')} title="Save for later">
              <Bookmark size={24} />
            </button>
            <button className="action-btn interested" onClick={() => handleAction('right')} title="Interested">
              <Heart size={28} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Discover;
