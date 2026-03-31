# SkillSwap

SkillSwap is a swipe-based skill barter app.

Instead of dating, users match to exchange skills. Example: you teach sewing, someone teaches drawing, and a mutual right swipe creates a match so both users can chat and coordinate learning sessions.

## Quick Start (Start the App in 5 Minutes)

If you only want to run the app quickly, follow this exact order.

1. Install dependencies.
2. Configure environment variables.
3. Run the Supabase schema SQL once.
4. Start the dev server.

Commands:

```bash
npm install
cp .env.example .env
npm run dev
```

Open the app at http://localhost:5173.

Important: The app uses Supabase Auth + database. Without valid Supabase values and the schema applied, signup/login and data features will not work.

## What Is Implemented

- Email/password authentication (Supabase Auth)
- Profile creation and editing
- Discover feed ordered by compatibility
- Left/right swipe actions persisted to database
- Mutual right-swipe match creation
- Match list and chat messages persisted to database
- Route protection for authenticated pages
- Row Level Security policies for app tables

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Supabase JS 2
- Supabase Postgres + RLS
- Lucide React icons

## Prerequisites

Install these first:

- Node.js 20+ recommended
- npm 10+ recommended
- A Supabase project

Check versions:

```bash
node -v
npm -v
```

## Environment Setup

Create your local environment file:

```bash
cp .env.example .env
```

Then fill in .env.

Required frontend keys:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Also supported by the app:

- VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

Optional server key in the project template:

- DATABASE_URL

Example format:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key
```

Notes:

- For frontend code, always use VITE_SUPABASE_URL in the https://project-ref.supabase.co format.
- The Postgres host format db.project-ref.supabase.co is for database connections, not for the frontend Supabase client URL.

## Supabase Project Setup (One-Time)

### 1) Enable email/password auth

In Supabase dashboard:

1. Go to Authentication.
2. Open Providers.
3. Enable Email provider.
4. Choose whether email confirmation is required.

### 2) Apply database schema

Run the SQL file in Supabase SQL Editor:

- supabase/schema.sql

This creates:

- profiles
- swipes
- matches
- messages
- indexes
- RLS policies
- demo profile seed rows

### 3) Verify RLS behavior

The schema includes policies so:

- users can update only their profile
- users can insert/select their own swipes
- users can read matches they are part of
- users can send/read messages only in their matches

## Start the App

Development server:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## App Flow

### Authentication flow

1. User signs up or signs in on the landing page.
2. Auth session is loaded and tracked by AuthContext.
3. Protected routes redirect unauthenticated users to landing.

### Profile flow

1. On first login, a profile row is created automatically.
2. User updates name, bio, city, level, availability, skills.
3. Changes persist to profiles and refresh app state.

### Discover flow

1. Candidate profiles are fetched from database.
2. Compatibility is computed using mutual teach/learn overlap.
3. User swipes left or right and swipe is saved.
4. If a mutual right is detected, a match is created.

### Matches + chat flow

1. Matches involving current user are fetched.
2. Messages for those matches are fetched and grouped.
3. Sending a message writes to messages table.

## Project Structure

```text
SkillSwap/
	src/
		context/
			AuthContext.jsx
			SkillSwapContext.jsx
		lib/
			supabase.js
		pages/
			LandingPage.jsx
			ProfileSetup.jsx
			Discover.jsx
			Matches.jsx
			Dashboard.jsx
		App.jsx
		main.jsx
	supabase/
		schema.sql
	.env.example
	package.json
```

## Core Files Explained

- src/lib/supabase.js
  - Initializes Supabase client using VITE environment values.
- src/context/AuthContext.jsx
  - Handles session boot, auth state updates, signin/signup/signout.
- src/context/SkillSwapContext.jsx
  - Handles profile bootstrap, discover queue, swipes, matches, messages.
- supabase/schema.sql
  - Creates tables, indexes, trigger, and RLS policies.

## Compatibility Logic

Current scoring model in app state:

- +2 per teach overlap (candidate teaches what I want)
- +2 per learn overlap (candidate wants what I teach)
- +1 city match
- +1 level match

Then score is converted to a visible percentage and cards are sorted descending.

## Data Model Summary

### profiles

- id
- auth_user_id
- email
- name
- bio
- city
- level
- availability
- teach_skills text[]
- learn_skills text[]
- likes_you boolean
- is_demo boolean
- timestamps

### swipes

- swiper_profile_id
- target_profile_id
- action left/right
- unique pair constraint

### matches

- profile_a_id
- profile_b_id
- status
- agreement

### messages

- match_id
- sender_profile_id
- body
- created_at

## Troubleshooting

### 1) App opens but auth buttons fail

Check:

- .env exists
- VITE_SUPABASE_URL is valid
- VITE_SUPABASE_ANON_KEY is valid
- Restart dev server after changing env

### 2) Signup works but no profile/matches appear

Check:

- supabase/schema.sql was executed successfully
- RLS policies were created
- tables exist under public schema

### 3) No discover cards

Possible reasons:

- no compatible profiles in database
- only your own profile exists
- swipes already consumed available cards

Fix:

- keep demo rows from schema
- create another user account and profile
- adjust teach/learn skills for overlap

### 4) Build works but runtime errors in browser

Check browser console and network tab for:

- invalid Supabase URL
- auth provider disabled
- RLS policy rejections

## Security Notes

- Never commit real secrets.
- Keep .env local only.
- Use least-privilege keys for frontend.
- Keep service-role keys server-side only.
- Rotate credentials if they were exposed accidentally.

## Recommended Next Improvements

1. Add Supabase Realtime subscriptions for messages and matches.
2. Add onboarding guard requiring minimum profile completion before discover.
3. Add report/block tables and policy rules.
4. Add pagination/infinite loading for discover queue.
5. Add integration tests for auth and match creation flow.

## Scripts Reference

- npm run dev: start local dev server
- npm run build: production build
- npm run preview: preview built app
- npm run lint: run ESLint

## License

This project currently has no explicit license file. Add one before public distribution.
