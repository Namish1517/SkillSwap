import React, { useState } from 'react';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [offeredSkills, setOfferedSkills] = useState(['React', 'Node.js']);
  const [wantedSkills, setWantedSkills] = useState(['Figma', 'UI Design']);
  const [newOffered, setNewOffered] = useState('');
  const [newWanted, setNewWanted] = useState('');

  const addOffered = (e) => {
    e.preventDefault();
    if (newOffered && !offeredSkills.includes(newOffered)) {
      setOfferedSkills([...offeredSkills, newOffered]);
      setNewOffered('');
    }
  };

  const removeOffered = (skill) => {
    setOfferedSkills(offeredSkills.filter(s => s !== skill));
  };

  const addWanted = (e) => {
    e.preventDefault();
    if (newWanted && !wantedSkills.includes(newWanted)) {
      setWantedSkills([...wantedSkills, newWanted]);
      setNewWanted('');
    }
  };

  const removeWanted = (skill) => {
    setWantedSkills(wantedSkills.filter(s => s !== skill));
  };

  return (
    <div className="profile-setup container animate-slide-up">
      <div className="setup-header text-center mb-8">
        <h2>Complete Your Profile</h2>
        <p className="text-muted">Tell us what you can teach and what you want to learn.</p>
      </div>

      <div className="card setup-card mx-auto">
        <form className="setup-form">
          
          <div className="form-section">
            <label className="input-label mb-2" style={{display: 'block'}}>Skills You Can Offer</label>
            <div className="chip-group mb-4">
              {offeredSkills.map(skill => (
                <span key={skill} className="chip active" onClick={() => removeOffered(skill)}>
                  {skill} &times;
                </span>
              ))}
            </div>
            <div className="input-with-button">
              <input 
                type="text" 
                className="input-field flex-1" 
                placeholder="e.g., Python, Piano" 
                value={newOffered}
                onChange={(e) => setNewOffered(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addOffered(e); }}
              />
              <button className="btn btn-outline" onClick={addOffered}>Add</button>
            </div>
          </div>

          <div className="form-section">
            <label className="input-label mb-2" style={{display: 'block'}}>Skills You Want to Learn</label>
            <div className="chip-group mb-4">
              {wantedSkills.map(skill => (
                <span key={skill} className="chip" style={{backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1'}} onClick={() => removeWanted(skill)}>
                  {skill} &times;
                </span>
              ))}
            </div>
            <div className="input-with-button">
              <input 
                type="text" 
                className="input-field flex-1" 
                placeholder="e.g., Public Speaking, Spanish" 
                value={newWanted}
                onChange={(e) => setNewWanted(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addWanted(e); }}
              />
              <button className="btn btn-outline" onClick={addWanted}>Add</button>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group flex-1">
              <label className="input-label">Your Overall Skill Level</label>
              <select className="input-field">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
            
            <div className="input-group flex-1">
              <label className="input-label">Availability</label>
              <select className="input-field">
                <option>2-5 hours / week</option>
                <option>5-10 hours / week</option>
                <option>10+ hours / week</option>
                <option>Weekends only</option>
              </select>
            </div>
          </div>

          <div className="setup-actions mt-8">
            <button className="btn btn-primary w-full" onClick={(e) => e.preventDefault()}>Save Profile</button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default ProfileSetup;
