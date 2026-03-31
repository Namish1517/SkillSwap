import React, { useState } from "react";
import { Save, Plus } from "lucide-react";
import { useSkillSwap } from "../context/SkillSwapContext";
import "./ProfileSetup.css";

const RECOMMENDED_SKILLS = [
  "Sewing",
  "Drawing",
  "Illustration",
  "Embroidery",
  "Pattern Cutting",
  "Storyboarding",
];

const ProfileSetup = () => {
  const { currentUser, setCurrentUser, loading, error } = useSkillSwap();
  const [offeredSkills, setOfferedSkills] = useState(currentUser.teachSkills);
  const [wantedSkills, setWantedSkills] = useState(currentUser.learnSkills);
  const [newOffered, setNewOffered] = useState("");
  const [newWanted, setNewWanted] = useState("");
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [level, setLevel] = useState(currentUser.level);
  const [availability, setAvailability] = useState(currentUser.availability);
  const [saved, setSaved] = useState(false);

  const normalizeSkill = (value) => value.trim().replace(/\s+/g, " ");

  const addOffered = (e) => {
    e.preventDefault();
    const formatted = normalizeSkill(newOffered);
    if (formatted && !offeredSkills.includes(formatted)) {
      setOfferedSkills([...offeredSkills, formatted]);
      setNewOffered("");
    }
  };

  const removeOffered = (skill) => {
    setOfferedSkills(offeredSkills.filter((s) => s !== skill));
  };

  const addWanted = (e) => {
    e.preventDefault();
    const formatted = normalizeSkill(newWanted);
    if (formatted && !wantedSkills.includes(formatted)) {
      setWantedSkills([...wantedSkills, formatted]);
      setNewWanted("");
    }
  };

  const removeWanted = (skill) => {
    setWantedSkills(wantedSkills.filter((s) => s !== skill));
  };

  const handleQuickAdd = (skill, bucket) => {
    if (bucket === "teach" && !offeredSkills.includes(skill)) {
      setOfferedSkills((prev) => [...prev, skill]);
    }

    if (bucket === "learn" && !wantedSkills.includes(skill)) {
      setWantedSkills((prev) => [...prev, skill]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await setCurrentUser({
      ...currentUser,
      name: name.trim() || currentUser.name,
      bio: bio.trim(),
      city,
      level,
      availability,
      teachSkills: offeredSkills,
      learnSkills: wantedSkills,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="profile-setup container animate-slide-up">
      <div className="setup-header text-center mb-8">
        <h2>Shape Your Swap Identity</h2>
        <p className="text-muted">
          Your profile now saves to Supabase and updates discover compatibility.
        </p>
      </div>

      {error && <p className="save-toast text-error">{error}</p>}

      <div className="card setup-card mx-auto">
        <form className="setup-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="input-group flex-1">
              <label className="input-label">Name</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group flex-1">
              <label className="input-label">City</label>
              <input
                className="input-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Bio</label>
            <textarea
              className="input-field"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What can you teach and what are you excited to learn?"
            />
          </div>

          <div className="form-section">
            <label className="input-label mb-2" style={{ display: "block" }}>
              Skills You Can Offer
            </label>
            <div className="chip-group mb-4">
              {offeredSkills.map((skill) => (
                <span
                  key={skill}
                  className="chip active"
                  onClick={() => removeOffered(skill)}
                >
                  {skill} &times;
                </span>
              ))}
            </div>
            <div className="input-with-button">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="e.g., Sewing, React, Guitar"
                value={newOffered}
                onChange={(e) => setNewOffered(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addOffered(e);
                }}
              />
              <button className="btn btn-outline" onClick={addOffered}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div className="form-section">
            <label className="input-label mb-2" style={{ display: "block" }}>
              Skills You Want to Learn
            </label>
            <div className="chip-group mb-4">
              {wantedSkills.map((skill) => (
                <span
                  key={skill}
                  className="chip"
                  onClick={() => removeWanted(skill)}
                >
                  {skill} &times;
                </span>
              ))}
            </div>
            <div className="input-with-button">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="e.g., Drawing, Public Speaking"
                value={newWanted}
                onChange={(e) => setNewWanted(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addWanted(e);
                }}
              />
              <button className="btn btn-outline" onClick={addWanted}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div className="quick-suggestions">
            <p className="input-label mb-2">Quick Suggestions</p>
            <div className="suggestion-grid">
              {RECOMMENDED_SKILLS.map((skill) => (
                <div key={skill} className="suggestion-row">
                  <span>{skill}</span>
                  <div className="suggestion-actions">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(skill, "teach")}
                    >
                      Teach
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(skill, "learn")}
                    >
                      Learn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group flex-1">
              <label className="input-label">Your Overall Skill Level</label>
              <select
                className="input-field"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>

            <div className="input-group flex-1">
              <label className="input-label">Availability</label>
              <select
                className="input-field"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option>2-5 hours / week</option>
                <option>5-10 hours / week</option>
                <option>10+ hours / week</option>
                <option>Weekends only</option>
              </select>
            </div>
          </div>

          <div className="setup-actions mt-8">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              <Save size={14} /> {loading ? "Saving..." : "Save Profile"}
            </button>
            {saved && (
              <p className="save-toast">
                Saved. Discover cards are now updated with your new skills.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProfileSetup;
