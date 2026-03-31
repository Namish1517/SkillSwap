import React from "react";
import {
  Share2,
  Users,
  Star,
  TrendingUp,
  Target,
  CheckCircle,
} from "lucide-react";
import { useSkillSwap } from "../context/SkillSwapContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { currentUser, matches, swipes } = useSkillSwap();
  const completed = matches.filter(
    (item) => item.status === "Completed",
  ).length;
  const active = matches.filter((item) => item.status === "Active").length;
  const profileHealth = Math.min(
    100,
    45 +
      currentUser.teachSkills.length * 8 +
      currentUser.learnSkills.length * 8,
  );

  return (
    <div className="dashboard-page container animate-slide-up">
      <div className="dashboard-header mb-8">
        <h2 style={{ fontSize: "2rem" }}>Welcome back, {currentUser.name}</h2>
        <p className="text-muted mt-2" style={{ fontSize: "1.1rem" }}>
          Frontend-first progress panel for your barter activity.
        </p>
      </div>

      <div className="stats-grid mb-8">
        <div className="stat-card card flex items-center gap-4">
          <div className="stat-icon bg-primary-light">
            <Share2 size={24} className="text-primary" />
          </div>
          <div>
            <p
              className="text-muted text-sm font-semibold uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              Total Swaps
            </p>
            <h3 style={{ fontSize: "1.8rem", marginTop: "0.25rem" }}>
              {swipes.length}
            </h3>
          </div>
        </div>

        <div className="stat-card card flex items-center gap-4">
          <div className="stat-icon bg-success-light">
            <Users size={24} className="text-success" />
          </div>
          <div>
            <p
              className="text-muted text-sm font-semibold uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              Active Collaborations
            </p>
            <h3 style={{ fontSize: "1.8rem", marginTop: "0.25rem" }}>
              {active}
            </h3>
          </div>
        </div>

        <div className="stat-card card flex items-center gap-4">
          <div className="stat-icon bg-warning-light">
            <Star size={24} className="text-warning" />
          </div>
          <div>
            <p
              className="text-muted text-sm font-semibold uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              Your Rating
            </p>
            <h3 style={{ fontSize: "1.8rem", marginTop: "0.25rem" }}>
              {(4.2 + active * 0.2).toFixed(1)}{" "}
              <span className="text-sm font-normal text-muted">/ 5.0</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ padding: "2rem" }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
              Recent Activity
            </h3>
            <button className="btn btn-ghost text-sm p-0 text-primary font-bold">
              View All
            </button>
          </div>
          <div className="activity-list flex-col gap-5 mt-4">
            <div className="activity-item flex items-start gap-4 pb-5 border-b">
              <div
                className="activity-icon bg-secondary rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 48, height: 48 }}
              >
                <CheckCircle size={24} className="text-muted" />
              </div>
              <div style={{ marginTop: "2px" }}>
                <p
                  className="font-semibold text-lg"
                  style={{ fontSize: "1.05rem" }}
                >
                  Profile updated with {currentUser.teachSkills.length} teach
                  skills
                </p>
                <p className="text-muted text-sm mt-1">
                  Discover queue now uses your latest skills
                </p>
              </div>
            </div>

            <div className="activity-item flex items-start gap-4 pb-5 border-b">
              <div
                className="activity-icon bg-secondary rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 48, height: 48 }}
              >
                <Target size={24} className="text-muted" />
              </div>
              <div style={{ marginTop: "2px" }}>
                <p
                  className="font-semibold text-lg"
                  style={{ fontSize: "1.05rem" }}
                >
                  {matches.length} mutual matches unlocked
                </p>
                <p className="text-muted text-sm mt-1">
                  Open Matches to start or continue chat
                </p>
              </div>
            </div>

            <div className="activity-item flex items-start gap-4 pb-2">
              <div
                className="activity-icon bg-secondary rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 48, height: 48 }}
              >
                <TrendingUp size={24} className="text-muted" />
              </div>
              <div style={{ marginTop: "2px" }}>
                <p
                  className="font-semibold text-lg"
                  style={{ fontSize: "1.05rem" }}
                >
                  Completion streak
                </p>
                <p className="text-muted text-sm mt-1">
                  {completed} completed collaborations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold" style={{ fontSize: "1.25rem" }}>
              Skill Proficiency Progress
            </h3>
          </div>
          <div className="progress-list flex-col gap-6 mt-4">
            <div className="progress-item">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">
                  Profile Completeness
                </span>
                <span className="text-sm text-primary font-bold">
                  {profileHealth}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${profileHealth}%`,
                    backgroundColor: "var(--primary)",
                  }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">Teach Portfolio</span>
                <span className="text-sm text-success font-bold">
                  {Math.min(99, 28 + currentUser.teachSkills.length * 18)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(99, 28 + currentUser.teachSkills.length * 18)}%`,
                    backgroundColor: "var(--success)",
                  }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">Learning Intent</span>
                <span className="text-sm text-primary font-bold">
                  {Math.min(95, 20 + currentUser.learnSkills.length * 16)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(95, 20 + currentUser.learnSkills.length * 16)}%`,
                    backgroundColor: "var(--primary)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary-light dashboard-tip rounded-md flex gap-4 items-center">
            <Target size={28} className="text-primary flex-shrink-0" />
            <p
              className="text-sm font-semibold dashboard-tip-text"
              style={{ lineHeight: "1.5" }}
            >
              Tip: Add more specific skill names to increase two-way overlap and
              unlock more cards in Discover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
