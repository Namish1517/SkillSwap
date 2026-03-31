import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Compass,
  HeartHandshake,
  ArrowRight,
  Shield,
  MessageCircle,
  Sparkles,
  Globe2,
  CalendarClock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, hasSupabaseEnv } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [working, setWorking] = useState(false);
  const authSectionRef = useRef(null);
  const emailInputRef = useRef(null);

  const handleAuth = async (mode, e) => {
    if (e) e.preventDefault();
    setAuthError("");
    setAuthNotice("");

    if (!email || !password) {
      setAuthError("Email and password are required.");
      return;
    }

    setWorking(true);
    const fn = mode === "signup" ? signUp : signIn;
    const { data, error } = await fn({ email: email.trim(), password });
    setWorking(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (mode === "signup") {
      if (data?.session) {
        navigate("/discover");
        return;
      }

      const signinResult = await signIn({ email: email.trim(), password });
      if (signinResult?.error) {
        setAuthNotice(
          "Account created. If email confirmation is enabled, verify your email then sign in.",
        );
      } else {
        navigate("/discover");
      }
      return;
    }

    navigate("/discover");
  };

  const handleCreateAccountClick = (e) => {
    e.preventDefault();
    authSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setTimeout(() => emailInputRef.current?.focus(), 250);
  };

  return (
    <div className="landing-page animate-fade-in container">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-kicker">Barter, But Make It Smart</p>
          <h1 className="hero-title">Swipe Your Way Into Real Skill Trades</h1>
          <p className="hero-subtitle text-muted">
            You teach what you are good at. They teach what you want next. If
            both sides swipe right, SkillSwap opens the match and the
            conversation.
          </p>
        </div>

        <div className="hero-board card">
          <p className="board-label">Live Concept</p>
          <div className="board-line">
            <span className="badge">You teach</span>
            <strong>Sewing</strong>
          </div>
          <div className="board-line">
            <span className="badge">You learn</span>
            <strong>Drawing</strong>
          </div>
          <div className="board-line">
            <span className="badge primary">Mutual Like</span>
            <strong>Match Unlocked</strong>
          </div>
        </div>

        <div className="hero-actions">
          {!user ? (
            <form
              className="auth-panel card"
              onSubmit={(e) => handleAuth("signin", e)}
              ref={authSectionRef}
            >
              <p className="board-label">Auth</p>
              <div className="auth-grid">
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email"
                  value={email}
                  ref={emailInputRef}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="auth-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={working}
                >
                  {working ? "Working..." : "Sign In"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={(e) => handleAuth("signup", e)}
                  disabled={working}
                >
                  Sign Up
                </button>
              </div>
              {!hasSupabaseEnv && (
                <p className="auth-note">
                  Missing Supabase env keys. Add VITE_SUPABASE_URL and
                  VITE_SUPABASE_ANON_KEY.
                </p>
              )}
              {authError && <p className="auth-error">{authError}</p>}
              {authNotice && <p className="auth-note">{authNotice}</p>}
            </form>
          ) : (
            <>
              <Link to="/profile" className="btn btn-primary hero-btn">
                Continue To Profile
                <ArrowRight size={16} />
              </Link>
              <Link to="/discover" className="btn btn-outline hero-btn">
                Open Discover
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="how-it-works container">
        <h2 className="text-center mb-8">How Product Flow Works</h2>
        <div className="steps-grid">
          <div className="step-card card text-center p-6">
            <div className="step-icon">
              <UserPlus size={32} />
            </div>
            <h3>1. Setup Profile</h3>
            <p className="text-muted mt-2">
              Define what you can teach and what you want to learn. This powers
              compatibility.
            </p>
          </div>

          <div className="step-card card text-center p-6">
            <div className="step-icon">
              <Compass size={32} />
            </div>
            <h3>2. Swipe Discover</h3>
            <p className="text-muted mt-2">
              Browse cards ordered by teach/learn overlap. Right swipe means you
              want the trade.
            </p>
          </div>

          <div className="step-card card text-center p-6">
            <div className="step-icon">
              <HeartHandshake size={32} />
            </div>
            <h3>3. Match and Chat</h3>
            <p className="text-muted mt-2">
              Mutual right swipe creates a match so you can coordinate your
              first exchange session.
            </p>
          </div>

          <div className="step-card card text-center p-6">
            <div className="step-icon">
              <CalendarClock size={32} />
            </div>
            <h3>4. Plan and Practice</h3>
            <p className="text-muted mt-2">
              Finalize your learning schedule, share resources, and start your
              first barter session.
            </p>
          </div>
        </div>
      </section>

      <section className="story-strip card">
        <div>
          <p className="board-label">Why SkillSwap</p>
          <h3>
            Courses cost money. Communities have talent. SkillSwap bridges both.
          </h3>
        </div>
        <p className="text-muted">
          Build your portfolio by teaching what you know, and grow into new
          skills through direct peer exchange instead of expensive classes.
        </p>
      </section>

      <section className="value-grid">
        <article className="value-card card">
          <Shield size={24} />
          <h3>Trust and Safety</h3>
          <p className="text-muted">
            Mutual matching before chat reduces spam and keeps interactions
            intent-driven.
          </p>
        </article>
        <article className="value-card card">
          <MessageCircle size={24} />
          <h3>Fast Coordination</h3>
          <p className="text-muted">
            Start from a shared exchange agreement so your first message is
            action-oriented.
          </p>
        </article>
        <article className="value-card card">
          <Sparkles size={24} />
          <h3>Compatibility First</h3>
          <p className="text-muted">
            Ranking favors two-way teach/learn overlap so every swipe has real
            potential.
          </p>
        </article>
        <article className="value-card card">
          <Globe2 size={24} />
          <h3>Community Growth</h3>
          <p className="text-muted">
            Skill marketplaces thrive when users both contribute and learn.
          </p>
        </article>
      </section>

      <section className="final-cta card">
        <h2>Ready to trade sewing for drawing, or coding for design?</h2>
        <p className="text-muted">
          Set your skills, swipe with intention, and build your next capability
          through real people.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/discover" className="btn btn-primary hero-btn">
              Go To Discover
            </Link>
          ) : (
            <button
              className="btn btn-primary hero-btn"
              onClick={handleCreateAccountClick}
            >
              Create Account
            </button>
          )}
          {user && (
            <Link to="/matches" className="btn btn-outline hero-btn">
              Open Matches
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
