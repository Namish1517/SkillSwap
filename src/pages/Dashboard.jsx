import React from 'react';
import { Share2, Users, Star, TrendingUp, Target, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page container animate-slide-up">
      <div className="dashboard-header mb-8">
        <h2 style={{fontSize: '2rem'}}>Welcome back, Namish</h2>
        <p className="text-muted mt-2" style={{fontSize: '1.1rem'}}>Here's your skill exchange activity.</p>
      </div>

      <div className="stats-grid mb-8">
        <div className="stat-card card flex items-center gap-4">
          <div className="stat-icon bg-primary-light">
            <Share2 size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-muted text-sm font-semibold uppercase" style={{letterSpacing: '0.05em'}}>Total Swaps</p>
            <h3 style={{fontSize: '1.8rem', marginTop: '0.25rem'}}>12</h3>
          </div>
        </div>

        <div className="stat-card card flex items-center gap-4">
          <div className="stat-icon bg-success-light">
            <Users size={24} className="text-success" />
          </div>
          <div>
            <p className="text-muted text-sm font-semibold uppercase" style={{letterSpacing: '0.05em'}}>Active Collaborations</p>
            <h3 style={{fontSize: '1.8rem', marginTop: '0.25rem'}}>2</h3>
          </div>
        </div>

        <div className="stat-card card flex items-center gap-4">
          <div className="stat-icon bg-warning-light">
            <Star size={24} className="text-warning" />
          </div>
          <div>
            <p className="text-muted text-sm font-semibold uppercase" style={{letterSpacing: '0.05em'}}>Your Rating</p>
            <h3 style={{fontSize: '1.8rem', marginTop: '0.25rem'}}>4.9 <span className="text-sm font-normal text-muted">/ 5.0</span></h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{padding: '2rem'}}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold" style={{fontSize: '1.25rem'}}>Recent Activity</h3>
            <button className="btn btn-ghost text-sm p-0 text-primary font-bold">View All</button>
          </div>
          <div className="activity-list flex-col gap-5 mt-4">
            <div className="activity-item flex items-start gap-4 pb-5 border-b">
               <div className="activity-icon bg-secondary rounded-full flex items-center justify-center flex-shrink-0" style={{width: 48, height: 48}}>
                 <CheckCircle size={24} className="text-muted" />
               </div>
               <div style={{marginTop: '2px'}}>
                  <p className="font-semibold text-lg" style={{fontSize: '1.05rem'}}>Completed session with Vikram</p>
                  <p className="text-muted text-sm mt-1">SEO optimization for Python Scripting • 2 days ago</p>
               </div>
            </div>
            
            <div className="activity-item flex items-start gap-4 pb-5 border-b">
               <div className="activity-icon bg-secondary rounded-full flex items-center justify-center flex-shrink-0" style={{width: 48, height: 48}}>
                 <Target size={24} className="text-muted" />
               </div>
               <div style={{marginTop: '2px'}}>
                  <p className="font-semibold text-lg" style={{fontSize: '1.05rem'}}>New match request from Rahul</p>
                  <p className="text-muted text-sm mt-1">Digital Marketing strategy • 5 days ago</p>
               </div>
            </div>
            
             <div className="activity-item flex items-start gap-4 pb-2">
               <div className="activity-icon bg-secondary rounded-full flex items-center justify-center flex-shrink-0" style={{width: 48, height: 48}}>
                 <TrendingUp size={24} className="text-muted" />
               </div>
               <div style={{marginTop: '2px'}}>
                  <p className="font-semibold text-lg" style={{fontSize: '1.05rem'}}>Profile view milestone</p>
                  <p className="text-muted text-sm mt-1">100+ views on your skill offerings this week</p>
               </div>
            </div>
          </div>
        </div>

        <div className="card" style={{padding: '2rem'}}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold" style={{fontSize: '1.25rem'}}>Skill Proficiency Progress</h3>
          </div>
          <div className="progress-list flex-col gap-6 mt-4">
            <div className="progress-item">
               <div className="flex justify-between mb-2">
                 <span className="font-semibold text-sm">React.js (Learning)</span>
                 <span className="text-sm text-primary font-bold">40%</span>
               </div>
               <div className="progress-bar">
                 <div className="progress-fill" style={{width: '40%', backgroundColor: 'var(--primary)'}}></div>
               </div>
            </div>

            <div className="progress-item">
               <div className="flex justify-between mb-2">
                 <span className="font-semibold text-sm">UI/UX Design (Teaching)</span>
                 <span className="text-sm text-success font-bold">95%</span>
               </div>
               <div className="progress-bar">
                 <div className="progress-fill" style={{width: '95%', backgroundColor: 'var(--success)'}}></div>
               </div>
            </div>

            <div className="progress-item">
               <div className="flex justify-between mb-2">
                 <span className="font-semibold text-sm">Video Editing (Learning)</span>
                 <span className="text-sm text-primary font-bold">15%</span>
               </div>
               <div className="progress-bar">
                 <div className="progress-fill" style={{width: '15%', backgroundColor: 'var(--primary)'}}></div>
               </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-primary-light rounded-md flex gap-4 items-center" style={{border: '1px solid #bfdbfe'}}>
             <Target size={28} className="text-primary flex-shrink-0" />
             <p className="text-sm font-semibold" style={{color: '#1e3a8a', lineHeight: '1.5'}}>Tip: Keeping your available time updated increases your match compatibility score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
