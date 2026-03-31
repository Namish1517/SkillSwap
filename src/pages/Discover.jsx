import React, { useState } from "react";
import { X, Heart, Sparkles, MapPin } from "lucide-react";
import { useSkillSwap } from "../context/SkillSwapContext";
import "./Discover.css";

const Discover = () => {
  const { discoverQueue, performSwipe, loading, error, resetDiscoverSwipes } =
    useSkillSwap();
  const [direction, setDirection] = useState(null); // 'left' | 'right' | 'up' | null

  const activeProfile = discoverQueue[0];

  if (loading) {
    return (
      <div
        className="discover-page container flex items-center justify-center flex-col animate-fade-in"
        style={{ minHeight: "70vh" }}
      >
        <h2>Loading discover queue...</h2>
      </div>
    );
  }

  const handleAction = (action) => {
    setDirection(action);
    setTimeout(() => {
      if (activeProfile) {
        performSwipe(activeProfile.id, action);
      }
      setDirection(null);
    }, 260);
  };

  if (!activeProfile) {
    return (
      <div
        className="discover-page container flex items-center justify-center flex-col animate-fade-in"
        style={{ minHeight: "70vh" }}
      >
        <h2>No more compatible cards right now.</h2>
        <p className="text-muted mt-2">
          Try updating your skills in Profile to unlock new matches.
        </p>
        <button className="btn btn-outline mt-4" onClick={resetDiscoverSwipes}>
          Reset Swipes
        </button>
      </div>
    );
  }

  const offerList =
    activeProfile.compatibility.teachOverlap.length > 0
      ? activeProfile.compatibility.teachOverlap
      : activeProfile.teachSkills.slice(0, 2);

  const learnList =
    activeProfile.compatibility.learnOverlap.length > 0
      ? activeProfile.compatibility.learnOverlap
      : activeProfile.learnSkills.slice(0, 2);

  return (
    <div className="discover-page container">
      <div className="discover-header text-center mb-6">
        <h2>Discover Swap Partners</h2>
        <p className="text-muted">
          {activeProfile.matchMode === "mutual"
            ? "Showing mutual skill matches first."
            : "Showing partial matches because mutual cards are exhausted."}
        </p>
        {error && <p className="text-muted mt-2 discover-error">{error}</p>}
      </div>

      <div className="swipe-container">
        <div
          className={`card swipe-card ${direction ? `swipe-${direction}` : ""}`}
        >
          <div className="card-header justify-between flex items-center mb-6">
            <div className="compatibility-badge">
              {activeProfile.compatibility.percent}% Match
            </div>
            <div className="rating flex items-center gap-2 text-muted">
              <MapPin size={16} />
              <span className="font-semibold" style={{ fontSize: "0.9rem" }}>
                {activeProfile.city}
              </span>
            </div>
          </div>

          <h3 className="candidate-name">{activeProfile.name}</h3>
          <p className="text-muted candidate-bio">{activeProfile.bio}</p>

          <div className="skills-exchange flex flex-col gap-4 mb-6">
            <div className="skill-box offer-box">
              <span className="text-muted text-sm">Can offer:</span>
              <h3 className="skill-title">{offerList.join(", ")}</h3>
            </div>

            <div className="exchange-icon flex justify-center text-muted">
              <span>&#8645;</span>
            </div>

            <div className="skill-box wanted-box">
              <span className="text-muted text-sm">Wants to learn:</span>
              <h3 className="skill-title">{learnList.join(", ")}</h3>
            </div>
          </div>

          <div className="time-commitment flex items-center justify-center gap-2 mb-6">
            <span className="badge" style={{ fontSize: "0.75rem" }}>
              {activeProfile.availability}
            </span>
            <span className="badge" style={{ fontSize: "0.75rem" }}>
              {activeProfile.level}
            </span>
          </div>

          <div className="ai-explanation mb-8 p-4 rounded-md flex gap-3">
            <Sparkles
              size={20}
              className="text-primary flex-shrink-0"
              style={{ marginTop: "2px" }}
            />
            <div>
              <p className="font-semibold match-why-title">Why this match?</p>
              <p className="text-muted text-sm mt-1 leading-relaxed">
                {activeProfile.matchMode === "mutual"
                  ? `You can learn ${offerList[0]} from ${activeProfile.name.split(" ")[0]} and teach ${learnList[0]} back.`
                  : `This profile partially overlaps your goals. You can still explore a skill exchange around ${offerList[0]} and ${learnList[0]}.`}
              </p>
            </div>
          </div>

          <div className="swipe-actions flex justify-center gap-6">
            <button
              className="action-btn skip"
              onClick={() => handleAction("left")}
              title="Skip"
            >
              <X size={28} />
            </button>
            <button
              className="action-btn interested"
              onClick={() => handleAction("right")}
              title="Interested"
            >
              <Heart size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Discover;
