# SkillSwap - TASK.md

## 1) Product Summary

SkillSwap is a swipe-based skill barter app.

If User A can teach skill X (ex: sewing) and wants to learn skill Y (ex: drawing), and User B can teach skill Y and wants to learn skill X, both users can swipe right and become a match.

Think: matching flow inspired by Tinder, but for exchanging practical skills instead of dating.

---

## 2) Problem Statement

People want to learn useful skills but courses can be expensive. Many people already have valuable skills they can trade.

SkillSwap solves this by connecting users for fair, mutual skill exchange.

---

## 3) Target Users

- Students who want low-cost learning
- Freelancers/creatives who can exchange expertise
- Hobbyists who want to pick up new skills
- Community members interested in peer-to-peer learning

---

## 4) Core User Flow (MVP)

1. User signs up and creates profile.
2. User selects:
   - Skills I can teach
   - Skills I want to learn
3. App shows discover cards of compatible users.
4. User swipes:
   - Right = Interested
   - Left = Pass
5. If both users swipe right, create a match.
6. Match appears in Matches page.
7. Users can start chatting to coordinate exchange.

---

## 5) MVP Feature List

### A. Authentication + Onboarding

- Email/password or social login
- Basic profile setup:
  - Name
  - Bio
  - Location (optional)
  - Profile photo

### B. Skill Graph / Skill Data

- Skills user can teach
- Skills user wants to learn
- Skill categories (creative, tech, fitness, language, etc.)
- Basic skill level field (Beginner / Intermediate / Advanced)

### C. Discover + Swipe Engine

- Card-based UI for potential matches
- Compatibility logic based on teach/learn overlap
- Swipe interactions (right/left)
- Prevent showing same card repeatedly

### D. Match System

- Mutual right swipe creates match record
- Timestamped match creation
- Match status (active, archived)

### E. Messaging (Basic)

- 1:1 chat only for matched users
- Send/receive text messages
- Last message preview in matches list

### F. Profile & Settings

- Edit profile details
- Update teach/learn skills anytime
- Report/block user (basic safety)

---

## 6) Suggested Pages (aligned with current project structure)

- Landing Page
- Profile Setup
- Discover
- Matches
- Dashboard

Optional additions later:

- Chat detail page
- Settings page
- Report/Support page

---

## 7) Matching Logic (MVP Rules)

A user A is a good candidate for user B if:

- At least 1 skill in A.teach overlaps B.learn
- At least 1 skill in B.teach overlaps A.learn

Scoring suggestion:

- +2 for each mutual overlap
- +1 if same city/timezone
- +1 if similar skill level

Sort discover cards by highest compatibility score first.

---

## 8) Non-Goals (for MVP)

- Payments/in-app currency
- Video calls
- Group classes
- Advanced AI recommendations
- Public marketplace listings

Keep MVP focused on: match + chat + skill exchange setup.

---

## 9) Data Model (High-Level)

### User

- id
- name
- bio
- photoUrl
- location
- teachSkills[]
- learnSkills[]
- createdAt

### Swipe

- id
- fromUserId
- toUserId
- action (left/right)
- createdAt

### Match

- id
- userAId
- userBId
- createdAt
- status

### Message

- id
- matchId
- senderId
- text
- createdAt

---

## 10) Acceptance Criteria (MVP)

- New user can create profile and add teach/learn skills.
- Discover feed shows only relevant users.
- Swiping right on each other creates a match.
- Matches list updates after successful match.
- Matched users can send and receive messages.
- User can edit profile and skill lists.
- Basic abuse controls exist (report/block).

---

## 11) Build Checklist

### Phase 1: Foundation

- [ ] Set up routing and page shells
- [ ] Create shared UI components (card, button, avatar, tag)
- [ ] Define app state shape and mock data

### Phase 2: Auth + Profile

- [ ] Build signup/login screens
- [ ] Build profile setup form
- [ ] Add skill selector UI

### Phase 3: Discover + Swiping

- [ ] Build discover card stack
- [ ] Implement left/right swipe actions
- [ ] Persist swipe decisions
- [ ] Add compatibility filtering

### Phase 4: Matches + Chat

- [ ] Generate match on mutual right swipe
- [ ] Build matches list UI
- [ ] Build chat screen with message thread

### Phase 5: Quality + Safety

- [ ] Add empty states and loading states
- [ ] Add form validation and error handling
- [ ] Add report/block actions
- [ ] Add responsive polish for mobile + desktop

---

## 12) Future Enhancements

- Skill verification badges
- In-app session scheduling
- Video/audio calls
- Reviews and reliability score
- AI-powered match recommendations
- Community events / group exchanges

---

## 13) One-Sentence Product Pitch

SkillSwap helps people learn new skills for free by matching them with others who want to trade knowledge, one swipe at a time.


## 14) Tech Stack:

- Supabase for Database and Auth
- React for Frontend
- Node for Backend