# SkillSwap - TASK.md

## 1) Product Summary

SkillSwap is a swipe-based skill barter app where users trade teachable skills for new skills they want to learn.

Core interaction:

1. Build profile with teach/learn skills.
2. Swipe discover cards.
3. Mutual right swipe creates a match.
4. Matched users chat and coordinate their exchange.

## 2) Current Build Status (As Implemented)

### Completed

- Landing page with product narrative and working auth form
- Email/password signup and signin via Supabase Auth
- Protected routes for app pages
- Profile bootstrap and profile editing persisted to Supabase
- Discover queue with compatibility scoring and swipe actions
- Swipe persistence in `swipes` table
- Automatic match creation on mutual right swipe
- Matches list with status badge + agreement summary
- In-app chat backed by `messages` table
- Dashboard showing activity metrics from live app state
- Light/dark theme toggle with persistence
- Discover fallback (partial matches when strict mutual cards are exhausted)
- Reset Swipes action in Discover
- Supabase schema with RLS + indexes + demo seed data (50 Indian profiles)

### Not Implemented Yet

- Social auth providers
- Profile photos / uploads
- Report or block workflow
- Realtime subscriptions for messages
- Scheduling/calendar workflow
- Automated integration tests

## 3) MVP Scope Definition (Updated)

### In Scope (Current MVP)

- Authenticated user journeys end-to-end
- Persistent profile/discover/match/chat workflow
- Compatibility-based ranking for discover cards
- Responsive UI across Landing, Profile, Discover, Matches, Dashboard
- Theme support (light and dark)

### Out of Scope (Current MVP)

- Payments or escrow
- Video/audio calls
- Group sessions
- Public marketplace listings
- AI recommendation engine

## 4) Implemented User Flow

1. User signs in or creates account on Landing.
2. App initializes session and ensures profile record exists.
3. User updates teach/learn skills in Profile Setup.
4. Discover displays ranked cards.
5. Swipe left/right is stored.
6. Mutual right swipe generates match.
7. Match appears in Matches and chat is enabled.
8. Dashboard reflects active stats.

## 5) Matching Rules (Current Logic)

For each candidate:

- `+2` per skill where candidate teaches what user wants to learn
- `+2` per skill where candidate wants what user can teach
- `+1` city match
- `+1` level match

Card ordering:

- Strict mutual compatibility first
- Partial compatibility fallback when strict pool is empty

## 6) Data Model (Implemented)

### `profiles`

- `id` UUID PK
- `auth_user_id` UUID unique (linked to Supabase auth user)
- `email`, `name`, `bio`, `city`, `level`, `availability`
- `teach_skills` text[]
- `learn_skills` text[]
- `likes_you` boolean
- `is_demo` boolean
- timestamps

### `swipes`

- identity `id`
- `swiper_profile_id`
- `target_profile_id`
- `action` (`left` or `right`)
- unique pair constraint
- timestamp

### `matches`

- `id` UUID PK
- `profile_a_id`, `profile_b_id`
- `status` (`Active`, `Pending`, `Completed`, `Archived`)
- `agreement`
- timestamp

### `messages`

- identity `id`
- `match_id`
- `sender_profile_id`
- `body`
- timestamp

## 7) RLS and Security Status

Implemented policies enforce:

- Profile read for authenticated users; write only by owner
- Swipe read/insert only by owner of swipe row
- Match read/insert only for participants
- Message read/insert only for match participants

## 8) Acceptance Criteria (Updated)

- [x] New user can sign up/sign in and access protected routes.
- [x] Profile record is created and can be updated.
- [x] Discover feed is populated from Supabase profiles.
- [x] Swipe choices persist and are not repeatedly resurfaced.
- [x] Mutual right swipes create a match.
- [x] Matches page lists connected partners.
- [x] Matched users can send chat messages.
- [x] Dashboard displays activity metrics.
- [x] Dark mode toggle is available and persisted.
- [ ] Report/block safety controls.
- [ ] Realtime messaging updates.

## 9) Build Checklist (Progress)

### Phase 1: Foundation

- [x] Routing and page shells
- [x] Shared design system and reusable UI patterns
- [x] App state scaffolding

### Phase 2: Auth + Profile

- [x] Signup/login integration with Supabase
- [x] Profile setup and editing form
- [x] Skill selector and quick-add interactions

### Phase 3: Discover + Swiping

- [x] Discover card experience
- [x] Left/right swipe actions
- [x] Swipe persistence
- [x] Compatibility filtering and ranking
- [x] Partial-match fallback and swipe reset

### Phase 4: Matches + Chat

- [x] Match generation on mutual right swipe
- [x] Matches list UI
- [x] Chat thread and message send

### Phase 5: Quality + UX

- [x] Empty/loading/error states on core pages
- [x] Theme toggle and contrast pass across pages
- [x] Responsive improvements
- [ ] Report/block actions
- [ ] Realtime subscriptions

## 10) Next Priority Tasks

1. Add report/block tables, UI actions, and RLS policies.
2. Add Supabase Realtime for match/message live updates.
3. Add onboarding completeness guard before enabling Discover.
4. Add end-to-end tests for auth, swipe, match, and messaging flows.
5. Add pagination/infinite loading to Discover for larger datasets.

## 11) One-Sentence Product Pitch

SkillSwap helps people learn skills for free by matching them with others for two-way knowledge exchange, one swipe at a time.

## 12) Tech Stack

- React + Vite frontend
- Supabase Auth + Postgres + RLS
- React Router for navigation
- Lucide icons and CSS variable based theming
