import React, { useState } from "react";
import { Send, CheckCircle, CalendarDays, MessageSquare } from "lucide-react";
import { useSkillSwap } from "../context/SkillSwapContext";
import "./Matches.css";

const Matches = () => {
  const { matches, sendMessage, loading, error } = useSkillSwap();
  const [activeMatchId, setActiveMatchId] = useState(matches[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");

  const activeMatch = matches.find((m) => m.id === activeMatchId) || matches[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="badge success">Active</span>;
      case "Pending":
        return <span className="badge warning">Pending</span>;
      case "Completed":
        return <span className="badge completed">Completed</span>;
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeMatch) return;
    sendMessage(activeMatch.id, newMessage);
    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="matches-page container animate-fade-in empty-state">
        <h2>Loading matches...</h2>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="matches-page container animate-fade-in empty-state">
        <MessageSquare size={34} />
        <h2>No matches yet</h2>
        <p className="text-muted">
          Swipe right on Discover and wait for a mutual like to unlock chat.
        </p>
      </div>
    );
  }

  return (
    <div className="matches-page container animate-fade-in">
      {error && (
        <p className="text-muted text-error" style={{ marginBottom: "0.8rem" }}>
          {error}
        </p>
      )}
      <div className="matches-layout">
        {/* Sidebar */}
        <div className="matches-sidebar card p-0 flex flex-col hidden sm:flex">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Your Matches</h3>
          </div>
          <div className="matches-list flex-1 overflow-y-auto">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`match-list-item ${activeMatchId === match.id ? "active" : ""}`}
                onClick={() => setActiveMatchId(match.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{match.name}</span>
                  {getStatusBadge(match.status)}
                </div>
                <p className="text-muted text-sm truncate">
                  {match.lastMessagePreview}
                </p>
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
                  <div className="user-avatar">
                    {activeMatch.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl mb-1">{activeMatch.name}</h2>
                    {getStatusBadge(activeMatch.status)}
                  </div>
                </div>
                {activeMatch.status === "Active" &&
                  activeMatch.messages.length > 0 && (
                    <button
                      className="btn btn-outline"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                    >
                      <CheckCircle size={16} />
                      Mark Completed
                    </button>
                  )}
              </div>

              <div className="collaboration-info mb-4 p-4 rounded-md">
                <h4
                  className="mb-1 text-sm text-primary uppercase font-bold"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Agreement Summary
                </h4>
                <p className="font-medium mb-3">{activeMatch.agreement}</p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <CalendarDays size={16} />
                    <span>Last updated {activeMatch.updatedAtRelative}</span>
                  </div>
                </div>
              </div>

              <div className="chat-container flex-col flex-1">
                <div className="messages-area flex-1 mb-4">
                  {activeMatch.messages.length === 0 ? (
                    <div className="text-center text-muted mt-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    activeMatch.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`message ${msg.sender === "You" ? "message-sent" : "message-received"}`}
                      >
                        <div className="message-bubble">
                          <p>{msg.text}</p>
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  className="chat-input-area flex gap-2"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary shadow-none"
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-muted">
              Select a match to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Matches;
