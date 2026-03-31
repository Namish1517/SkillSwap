# SkillSwap

SkillSwap is a swipe-based skill barter app where users exchange what they can teach for what they want to learn.

Example: you teach sewing, another user teaches drawing. If both users swipe right, a match is created and chat opens for coordination.

## Current Project Status

The app is now frontend + Supabase backed and includes:

- Supabase email/password auth (sign in, sign up, sign out)
- Protected app routes (Discover, Matches, Dashboard, Profile)
- Auto profile bootstrap after first successful auth
- Profile editing with teach/learn skills, city, level, and availability
- Compatibility-ranked discover queue
- Swipe persistence in Postgres
- Match creation on mutual right swipe
- Match list and in-app chat persisted in Postgres
- Discover fallback mode (partial matches when strict mutual pool is empty)
- Reset swipes action to repopulate discover cards
- Light and dark theme toggle with persistence
- Demo seed data (50 Indian profiles) in schema SQL

## Stack

- React 19
- Vite 8
- React Router 7
- Supabase JS 2
- Supabase Postgres + Row Level Security
- Lucide React icons

## Quick Start

1. Install dependencies.
2. Configure environment variables.
3. Apply database schema in Supabase.
4. Start the app.

```bash
npm install
cp .env.example .env
npm run dev
```

Default local URL: http://localhost:5173

## Environment Variables

Create `.env` from `.env.example` and provide real values.

Required for frontend auth/data:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional fallback key supported by current client setup:

- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Optional server/database connection string:

- `DATABASE_URL`

Example:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=[YOUR-PUBLISHABLE-KEY]
```

## One-Time Supabase Setup

1. In Supabase Auth providers, enable Email.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Confirm tables exist: `profiles`, `swipes`, `matches`, `messages`.
4. Confirm RLS policies were created.

The schema also seeds demo discover records for development.

## Scripts

- `npm run dev` starts local dev server
- `npm run build` creates production build
- `npm run preview` serves production build locally
- `npm run lint` runs ESLint

## Implemented Product Flow

1. User signs in or signs up on Landing.
2. App initializes auth session and protects internal routes.
3. App ensures a profile row exists for authenticated user.
4. User edits profile and skills in Profile Setup.
5. Discover shows ranked cards and stores swipe actions.
6. Mutual right swipe creates match.
7. Matches page loads conversations and sends messages.
8. Dashboard summarizes activity from live app data.

## Compatibility Logic (Current)

For each discover candidate:

- `+2` per overlap where candidate teaches what current user wants
- `+2` per overlap where candidate wants what current user teaches
- `+1` same city
- `+1` same level

Queue behavior:

- Priority 1: strict mutual matches (both overlap directions)
- Priority 2: partial matches if strict queue is exhausted

## Data Model (Current)

`profiles`

- `id` UUID PK
- `auth_user_id` UUID unique (linked to `auth.users`)
- `email`, `name`, `bio`, `city`, `level`, `availability`
- `teach_skills` text[]
- `learn_skills` text[]
- `likes_you` boolean
- `is_demo` boolean
- timestamps

`swipes`

- `swiper_profile_id`, `target_profile_id`
- `action` in `left | right`
- unique pair constraint

`matches`

- `profile_a_id`, `profile_b_id`
- `status` in `Active | Pending | Completed | Archived`
- `agreement`, `created_at`

`messages`

- `match_id`, `sender_profile_id`, `body`, `created_at`

## Security and Access

RLS is enabled on all app tables.

- Users can update only their own profile.
- Users can insert/select only their own swipes.
- Users can read matches they participate in.
- Users can insert/select messages only within their matches.

## Known Gaps (Not Implemented Yet)

- Realtime subscriptions for message updates
- Report/block safety workflow
- Dedicated scheduling/session booking
- Automated tests
- Admin moderation tools

## Troubleshooting

Auth does not work:

- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart `npm run dev` after editing `.env`
- Ensure Supabase Email auth provider is enabled

Discover is empty:

- Ensure schema seed was executed
- Update profile skills for better overlap
- Use the Reset Swipes button in Discover

Chat or matches not loading:

- Verify schema and RLS policies were applied
- Verify authenticated user has a profile row

## Security Notes

- Do not commit real credentials in `.env`.
- Frontend must only use public/anon keys.
- Rotate exposed keys immediately.
