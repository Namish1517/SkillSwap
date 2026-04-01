-- SkillSwap schema for Supabase
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text,
  name text not null,
  bio text default '',
  city text default '',
  level text default 'Beginner',
  availability text default '2-5 hours / week',
  teach_skills text[] not null default '{}',
  learn_skills text[] not null default '{}',
  likes_you boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.swipes (
  id bigint generated always as identity primary key,
  swiper_profile_id uuid not null references public.profiles(id) on delete cascade,
  target_profile_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in ('left', 'right')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (swiper_profile_id, target_profile_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  profile_a_id uuid not null references public.profiles(id) on delete cascade,
  profile_b_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'Active' check (status in ('Active', 'Pending', 'Completed', 'Archived')),
  agreement text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (profile_a_id, profile_b_id)
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_auth_user_id on public.profiles (auth_user_id);
create index if not exists idx_swipes_swiper_target on public.swipes (swiper_profile_id, target_profile_id);
create index if not exists idx_swipes_target_swiper on public.swipes (target_profile_id, swiper_profile_id);
create index if not exists idx_matches_profile_a on public.matches (profile_a_id);
create index if not exists idx_matches_profile_b on public.matches (profile_b_id);
create index if not exists idx_messages_match_created on public.messages (match_id, created_at desc);

-- Enable Supabase Realtime for the messages table so clients receive
-- live INSERT events via postgres_changes subscriptions.
alter publication supabase_realtime add table public.messages;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_touch_updated_at on public.profiles;
create trigger trg_profiles_touch_updated_at
before update on public.profiles
for each row
execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- Profiles: readable by all authenticated users for discover; mutable only by owner.
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

-- Swipes: owner can insert/select their own swipes.
drop policy if exists "swipes_select_own" on public.swipes;
create policy "swipes_select_own"
on public.swipes
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = swipes.swiper_profile_id
      and p.auth_user_id = auth.uid()
  )
);

drop policy if exists "swipes_insert_own" on public.swipes;
create policy "swipes_insert_own"
on public.swipes
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = swipes.swiper_profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- Matches: user can read matches involving their profile, and create matches involving their profile.
drop policy if exists "matches_select_participant" on public.matches;
create policy "matches_select_participant"
on public.matches
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.id = matches.profile_a_id or p.id = matches.profile_b_id)
  )
);

drop policy if exists "matches_insert_participant" on public.matches;
create policy "matches_insert_participant"
on public.matches
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.id = matches.profile_a_id or p.id = matches.profile_b_id)
  )
);

-- Messages: participants can read/send in their matches.
drop policy if exists "messages_select_participant" on public.messages;
create policy "messages_select_participant"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.matches m
    join public.profiles p on p.auth_user_id = auth.uid()
    where m.id = messages.match_id
      and (p.id = m.profile_a_id or p.id = m.profile_b_id)
  )
);

drop policy if exists "messages_insert_sender_participant" on public.messages;
create policy "messages_insert_sender_participant"
on public.messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    join public.matches m on m.id = messages.match_id
    where p.id = messages.sender_profile_id
      and p.auth_user_id = auth.uid()
      and (p.id = m.profile_a_id or p.id = m.profile_b_id)
  )
);

-- Optional demo records for discover in development.
insert into public.profiles (
  name,
  city,
  bio,
  teach_skills,
  learn_skills,
  level,
  availability,
  is_demo,
  likes_you
)
select
  seed.name,
  seed.city,
  seed.bio,
  seed.teach_skills,
  seed.learn_skills,
  seed.level,
  seed.availability,
  true,
  seed.likes_you
from (
  values
    ('Aarav Mehta', 'Mumbai', 'Fashion illustrator focused on expressive sketching and character lines.', ARRAY['Drawing','Illustration','Fashion Sketching'], ARRAY['Sewing','Pattern Cutting'], 'Intermediate', '5-10 hours / week', true),
    ('Diya Kapoor', 'Delhi', 'Bridal mehendi artist who wants to learn stitching for custom sleeves.', ARRAY['Mehendi','Calligraphy','Canva'], ARRAY['Sewing','Embroidery'], 'Intermediate', 'Weekends only', true),
    ('Rohan Nair', 'Bengaluru', 'Frontend engineer exploring hand-made fashion as a creative hobby.', ARRAY['React','JavaScript','Figma'], ARRAY['Sewing','Tailoring'], 'Advanced', '2-5 hours / week', false),
    ('Ananya Iyer', 'Chennai', 'Carnatic vocalist building a personal costume line.', ARRAY['Carnatic Vocal','Tamil','Public Speaking'], ARRAY['Sewing','Pattern Making'], 'Beginner', '5-10 hours / week', true),
    ('Kabir Singh', 'Pune', 'Street photographer with a strong eye for composition.', ARRAY['Photography','Color Grading','Video Editing'], ARRAY['Drawing','Illustration'], 'Intermediate', '2-5 hours / week', true),
    ('Sneha Reddy', 'Hyderabad', 'Yoga coach who designs activewear concepts.', ARRAY['Yoga','Strength Training','Nutrition Basics'], ARRAY['Sewing','Fashion Illustration'], 'Intermediate', '10+ hours / week', false),
    ('Ishaan Das', 'Kolkata', 'Bengali calligrapher transitioning to digital creative work.', ARRAY['Calligraphy','Content Writing','Canva'], ARRAY['Drawing','Digital Art'], 'Beginner', '5-10 hours / week', true),
    ('Mira Joshi', 'Ahmedabad', 'Textile enthusiast who can teach embroidery motifs.', ARRAY['Embroidery','Crochet','Color Theory'], ARRAY['Drawing','Storyboarding'], 'Intermediate', 'Weekends only', true),
    ('Pranav Kulkarni', 'Nagpur', 'Data analyst interested in practical fabric construction.', ARRAY['Excel','Data Analysis','SQL'], ARRAY['Sewing','Tailoring'], 'Advanced', '2-5 hours / week', false),
    ('Tanya Malhotra', 'Jaipur', 'Wedding content creator with a design-first mindset.', ARRAY['Video Editing','Content Strategy','Canva'], ARRAY['Sewing','Drawing'], 'Intermediate', '5-10 hours / week', true),
    ('Aditya Rao', 'Surat', 'E-commerce seller exploring custom apparel production.', ARRAY['SEO','Product Photography','Spoken English'], ARRAY['Sewing','Pattern Making'], 'Intermediate', '5-10 hours / week', true),
    ('Ritika Sharma', 'Lucknow', 'Classical dancer building performance costume prototypes.', ARRAY['Kathak','Stage Expression','Hindi'], ARRAY['Sewing','Embroidery'], 'Intermediate', 'Weekends only', true),
    ('Nikhil Bansal', 'Noida', 'Backend developer interested in creative sketch-based thinking.', ARRAY['Node.js','Python','SQL'], ARRAY['Drawing','Storyboarding'], 'Advanced', '2-5 hours / week', false),
    ('Pooja Menon', 'Kochi', 'Home baker who loves handcraft projects.', ARRAY['Baking','Food Styling','Instagram Reels'], ARRAY['Sewing','Crochet'], 'Beginner', '5-10 hours / week', true),
    ('Yash Patil', 'Nashik', 'Mechanical student practicing visual communication.', ARRAY['C++','CAD Basics','Marathi'], ARRAY['Drawing','Illustration'], 'Beginner', '2-5 hours / week', false),
    ('Lavanya Krishnan', 'Coimbatore', 'Design student with strong draping knowledge.', ARRAY['Draping','Textile Basics','Fashion Styling'], ARRAY['Drawing','Figure Sketching'], 'Intermediate', '10+ hours / week', true),
    ('Harsh Vardhan', 'Indore', 'Podcast host interested in handcrafted merchandise.', ARRAY['Public Speaking','Audio Editing','Branding'], ARRAY['Sewing','Embroidery'], 'Intermediate', '2-5 hours / week', false),
    ('Naina Chawla', 'Chandigarh', 'Marketing executive and weekend craft hobbyist.', ARRAY['Digital Marketing','Copywriting','Canva'], ARRAY['Sewing','Pattern Cutting'], 'Intermediate', 'Weekends only', true),
    ('Arjun Pillai', 'Thiruvananthapuram', 'Guitarist who needs better visual storytelling for content.', ARRAY['Guitar','Music Theory','Malayalam'], ARRAY['Drawing','Video Editing'], 'Intermediate', '5-10 hours / week', true),
    ('Sana Qureshi', 'Bhopal', 'Henna artist expanding into fabric design.', ARRAY['Mehendi','Color Harmony','Urdu'], ARRAY['Sewing','Drawing'], 'Beginner', '5-10 hours / week', true),
    ('Devansh Arora', 'Gurugram', 'Startup operator improving product visuals.', ARRAY['Figma','Product Strategy','Excel'], ARRAY['Drawing','Illustration'], 'Advanced', '2-5 hours / week', false),
    ('Ira Banerjee', 'Kolkata', 'Illustrator looking to convert concepts into real garments.', ARRAY['Drawing','Watercolor','Storyboarding'], ARRAY['Sewing','Tailoring'], 'Advanced', '10+ hours / week', true),
    ('Karan Khanna', 'Delhi', 'Fitness coach planning athleisure prototypes.', ARRAY['Strength Training','Mobility','Nutrition Basics'], ARRAY['Sewing','Pattern Making'], 'Intermediate', 'Weekends only', false),
    ('Shreya Kulshrestha', 'Agra', 'Hindi tutor and handmade journal creator.', ARRAY['Hindi','Calligraphy','Paper Craft'], ARRAY['Drawing','Embroidery'], 'Intermediate', '5-10 hours / week', true),
    ('Omkar Jadhav', 'Pune', 'Video producer needing costume basics for shoots.', ARRAY['Video Editing','Photography','Color Grading'], ARRAY['Sewing','Fabric Selection'], 'Intermediate', '2-5 hours / week', true),
    ('Aditi Bhat', 'Mysuru', 'Classical singer wanting to design stage outfits.', ARRAY['Carnatic Vocal','Kannada','Public Speaking'], ARRAY['Sewing','Embroidery'], 'Beginner', '5-10 hours / week', true),
    ('Rudra Chatterjee', 'Howrah', 'Chess coach who enjoys visual learning tools.', ARRAY['Chess','Teaching Basics','Bengali'], ARRAY['Drawing','Storyboarding'], 'Intermediate', '2-5 hours / week', false),
    ('Kiara Sethi', 'Amritsar', 'Content creator building a handmade fashion channel.', ARRAY['Content Writing','Instagram Reels','Photography'], ARRAY['Sewing','Pattern Cutting'], 'Intermediate', '10+ hours / week', true),
    ('Vaibhav Tiwari', 'Kanpur', 'Engineering student and beginner guitarist.', ARRAY['C++','Python','Guitar'], ARRAY['Drawing','Sewing'], 'Beginner', '2-5 hours / week', false),
    ('Neha Walia', 'Ludhiana', 'Boutique assistant strong in customer styling.', ARRAY['Fashion Styling','Sales Communication','Punjabi'], ARRAY['Drawing','Digital Art'], 'Intermediate', 'Weekends only', true),
    ('Reyansh Jain', 'Udaipur', 'Travel vlogger with a passion for handmade accessories.', ARRAY['Vlogging','Video Editing','SEO'], ARRAY['Sewing','Embroidery'], 'Intermediate', '5-10 hours / week', true),
    ('Bhavya Nanda', 'Patna', 'School teacher exploring creative textile projects.', ARRAY['Spoken English','Lesson Planning','Hindi'], ARRAY['Sewing','Crochet'], 'Beginner', '5-10 hours / week', true),
    ('Amanpreet Gill', 'Jalandhar', 'Drummer and event manager wanting better sketch skills.', ARRAY['Event Planning','Music Production','Punjabi'], ARRAY['Drawing','Illustration'], 'Intermediate', '2-5 hours / week', false),
    ('Sanya Oberoi', 'Dehradun', 'Lifestyle blogger with strong visual curation.', ARRAY['Content Writing','Photography','Brand Collaborations'], ARRAY['Sewing','Pattern Making'], 'Intermediate', 'Weekends only', true),
    ('Vihan Agnihotri', 'Varanasi', 'Student building a personal streetwear concept.', ARRAY['Canva','Social Media','Hindi'], ARRAY['Sewing','Drawing'], 'Beginner', '5-10 hours / week', true),
    ('Trisha Sen', 'Siliguri', 'Watercolor artist wanting to build wearable art.', ARRAY['Watercolor','Illustration','Color Theory'], ARRAY['Sewing','Tailoring'], 'Advanced', '10+ hours / week', true),
    ('Rajat Saxena', 'Meerut', 'Corporate trainer exploring design communication.', ARRAY['Public Speaking','Presentation Design','Excel'], ARRAY['Drawing','Storyboarding'], 'Advanced', '2-5 hours / week', false),
    ('Palak Grover', 'Faridabad', 'Beauty creator experimenting with costume content.', ARRAY['Makeup','Skincare Basics','Video Editing'], ARRAY['Sewing','Embroidery'], 'Intermediate', '5-10 hours / week', true),
    ('Manav Desai', 'Vadodara', 'Finance analyst with a creative side project.', ARRAY['Excel','Financial Modeling','Gujarati'], ARRAY['Drawing','Sewing'], 'Intermediate', '2-5 hours / week', false),
    ('Ishita Prabhu', 'Mangaluru', 'Dance teacher creating custom class uniforms.', ARRAY['Bharatanatyam','Kannada','Teaching'], ARRAY['Sewing','Pattern Cutting'], 'Intermediate', 'Weekends only', true),
    ('Vedant Choksi', 'Rajkot', 'Photography enthusiast learning garment basics.', ARRAY['Photography','Lightroom','Gujarati'], ARRAY['Sewing','Fabric Selection'], 'Beginner', '5-10 hours / week', true),
    ('Anvi Purohit', 'Jodhpur', 'Handcraft seller with strong threadwork knowledge.', ARRAY['Embroidery','Crochet','Color Palettes'], ARRAY['Drawing','Digital Art'], 'Intermediate', '10+ hours / week', true),
    ('Naman Ghosh', 'Durgapur', 'Software engineer interested in analog creativity.', ARRAY['React','Node.js','Problem Solving'], ARRAY['Drawing','Sewing'], 'Advanced', '2-5 hours / week', false),
    ('Simran Luthra', 'Mohali', 'Community manager planning handmade merch drops.', ARRAY['Community Building','Copywriting','Canva'], ARRAY['Sewing','Embroidery'], 'Intermediate', '5-10 hours / week', true),
    ('Tejaswini Rao', 'Visakhapatnam', 'UI designer exploring costume sketching.', ARRAY['Figma','UI Design','Prototyping'], ARRAY['Drawing','Pattern Making'], 'Advanced', '2-5 hours / week', true),
    ('Arpit Nagar', 'Gwalior', 'YouTube editor building a side fashion channel.', ARRAY['Video Editing','Motion Graphics','SEO'], ARRAY['Sewing','Drawing'], 'Intermediate', 'Weekends only', true),
    ('Mehak Arvind', 'Madurai', 'Tamil literature student creating handcrafted gifts.', ARRAY['Tamil','Calligraphy','Crafting'], ARRAY['Sewing','Illustration'], 'Beginner', '5-10 hours / week', true),
    ('Keshav Bedi', 'Shimla', 'Travel photographer wanting outfit customization skills.', ARRAY['Photography','Travel Planning','Storytelling'], ARRAY['Sewing','Embroidery'], 'Intermediate', '2-5 hours / week', false),
    ('Rhea Mahajan', 'Srinagar', 'Visual artist expanding into functional products.', ARRAY['Drawing','Digital Art','Watercolor'], ARRAY['Sewing','Tailoring'], 'Advanced', '10+ hours / week', true),
    ('Dhruv Awasthi', 'Prayagraj', 'College debater with interest in design thinking.', ARRAY['Public Speaking','Hindi','Debate Coaching'], ARRAY['Drawing','Storyboarding'], 'Intermediate', '5-10 hours / week', false),
    ('Zara Thomas', 'Goa', 'Lifestyle creator who loves experimental fashion.', ARRAY['Content Creation','Photography','Spoken English'], ARRAY['Sewing','Pattern Cutting'], 'Intermediate', 'Weekends only', true)
) as seed(name, city, bio, teach_skills, learn_skills, level, availability, likes_you)
where not exists (
  select 1
  from public.profiles p
  where p.is_demo = true
    and p.name = seed.name
    and p.city = seed.city
);
