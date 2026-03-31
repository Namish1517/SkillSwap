import React, { useState } from 'react';
import { Send, CheckCircle, Clock, CalendarDays } from 'lucide-react';
import './Matches.css';

const MOCK_MATCHES = [
  {
    id: 1,
    name: 'Aisha',
    status: 'Active',
    agreement: 'Exchange UI/UX Design for React.js tutoring',
    timeline: 'April 1 - May 15 (5 hrs/wk)',
    messages: [
      { sender: 'Aisha', text: 'Hi! Im excited to start learning React.', time: '10:00 AM' },
      { sender: 'You', text: 'Hello! Same here. Lets schedule our first session.', time: '10:15 AM' },
      { sender: 'Aisha', text: 'Would tomorrow at 5 PM work for you? We can start with the basics.', time: '10:20 AM' }
    ]
  },
  {
    id: 2,
    name: 'Rahul',
    status: 'Pending',
    agreement: 'Digital Marketing strategy for Video Editing',
    timeline: 'April 5 - April 30',
    messages: []
  },
  {
    id: 3,
    name: 'Vikram',
    status: 'Completed',
    agreement: 'SEO optimization for Python Scripting',
    timeline: 'Feb 1 - March 1',
    messages: [
      { sender: 'Vikram', text: 'Thanks for the python scripts!', time: '12:00 PM' }
    ]
  }
];

const Matches = () => {
  const [activeMatchId, setActiveMatchId] = useState(MOCK_MATCHES[0].id);
  const [newMessage, setNewMessage] = useState('');

  const activeMatch = MOCK_MATCHES.find(m => m.id === activeMatchId);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <span className="badge success">Active</span>;
      case 'Pending': return <span className="badge warning">Pending</span>;
      case 'Completed': return <span className="badge" style={{backgroundColor: '#e2e8f0'}}>Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="matches-page container animate-fade-in">
      <div className="matches-layout">
        
        {/* Sidebar */}
        <div className="matches-sidebar card p-0 flex flex-col hidden sm:flex">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Your Matches</h3>
          </div>
          <div className="matches-list flex-1 overflow-y-auto">
            {MOCK_MATCHES.map(match => (
              <div 
                key={match.id} 
                className={`match-list-item ${activeMatchId === match.id ? 'active' : ''}`}
                onClick={() => setActiveMatchId(match.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{match.name}</span>
                  {getStatusBadge(match.status)}
                </div>
                <p className="text-muted text-sm truncate">{match.agreement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="match-details card flex-col">
          {activeMatch ? (
            <>
              <div className="details-header flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="user-avatar">{activeMatch.name.charAt(0)}</div>
                  <div>
                    <h2 className="text-xl mb-1">{activeMatch.name}</h2>
                    {getStatusBadge(activeMatch.status)}
                  </div>
                </div>
                {activeMatch.status === 'Active' && (
                  <button className="btn btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
                    <CheckCircle size={16} />
                    Mark Completed
                  </button>
                )}
              </div>

              <div className="collaboration-info mb-4 p-4 rounded-md">
                <h4 className="mb-1 text-sm text-primary uppercase font-bold" style={{letterSpacing: '0.05em'}}>Agreement Summary</h4>
                <p className="font-medium mb-3">{activeMatch.agreement}</p>
                <div className="flex gap-6">
                   <div className="flex items-center gap-2 text-sm text-muted">
                    <CalendarDays size={16} />
                    <span>{activeMatch.timeline}</span>
                  </div>
                </div>
              </div>

              <div className="chat-container flex-col flex-1">
                <div className="messages-area flex-1 mb-4">
                  {activeMatch.messages.length === 0 ? (
                    <div className="text-center text-muted mt-8">No messages yet. Start the conversation!</div>
                  ) : (
                    activeMatch.messages.map((msg, idx) => (
                      <div key={idx} className={`message ${msg.sender === 'You' ? 'message-sent' : 'message-received'}`}>
                        <div className="message-bubble">
                          <p>{msg.text}</p>
                          <span className="message-time">{msg.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-input-area flex gap-2">
                  <input 
                    type="text" 
                    className="input-field flex-1" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="btn btn-primary shadow-none" style={{borderRadius: 'var(--radius-md)'}}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-muted">Select a match to view details</div>
          )}
        </div>

      </div>
    </div>
  );
};
export default Matches;
