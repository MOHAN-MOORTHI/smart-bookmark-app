**Smart Bookmark App**
======================

**Overview**
------------

A modern, full-stack bookmark manager designed for speed, security, and simplicity. Built with the T3-inspired stack (Next.js App Router, Supabase, Tailwind CSS, TypeScript), this application provides a robust solution for managing your personal links with real-time synchronization across devices.

The core philosophy is simple: **One secure place for all your bookmarks, instantly accessible everywhere.**

**Features**
------------

- **Secure Authentication**: powered by Supabase Auth with Google and GitHub OAuth integration. Supports secure sessions and automatic token refreshing.
- **Real-time Synchronization**: Leveraging Supabase Realtime, any bookmark added or removed updates instantly across all open tabs and devices without a page refresh.
- **Privacy First**: Implements Row Level Security (RLS) policies at the database level. User data is strictly isolated—User A can never access User B's bookmarks.
- **Modern UI/UX**:
    - Responsive design using **Tailwind CSS**.
    - Smooth, fluid interactions powered by **Framer Motion**.
    - Glassmorphic aesthetic with a polished dark mode interface.
- **Type Safety**: End-to-end type safety with **TypeScript** and generated database types.

**Tech Stack**
--------------

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (for animations)
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime)
- **Deployment**: Vercel

**Getting Started**
-------------------

**Prerequisites**
-----------------

- Node.js 18+
- npm or yarn
- A Supabase account

**Installation**
----------------

1.  **Clone the repository:**
    git clone https://github.com/MOHAN-MOORTHI/smart-bookmark-app.git
    cd smart-bookmark-app

2.  **Install dependencies:**
    npm install

3.  **Environment Setup:**
    Create a .env.local file in the root directory:
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4.  **Database Migration:**
    Run the SQL script (provided below) in your Supabase SQL Editor to set up the schema and security policies.

5.  **Run Development Server:**
    npm run dev

    Open http://localhost:3000 to view it in the browser.

**Database Schema & Policies**
------------------------------

Run this SQL in your Supabase Dashboard to initialize the backend:

```sql
-- 1. Create the bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid default auth.uid() references auth.users
);

-- 2. Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- 3. Create Security Policies
-- Policy: Users can view ONLY their own bookmarks
create policy "Users can view their own bookmarks"
on bookmarks for select
using (auth.uid() = user_id);

-- Policy: Users can insert ONLY their own bookmarks
create policy "Users can insert their own bookmarks"
on bookmarks for insert
with check (auth.uid() = user_id);

-- Policy: Users can delete ONLY their own bookmarks
create policy "Users can delete their own bookmarks"
on bookmarks for delete
using (auth.uid() = user_id);

-- 4. Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

**Google Auth Setup**
---------------------

1.  Go to Supabase Dashboard -> **Authentication** -> **Providers**.
2.  Enable **Google**.
3.  Configure your Google Cloud Project credentials (Client ID / Secret).
4.  Ensure your **Redirect URL** matches your deployment (e.g., https://your-app.vercel.app/auth/callback).

**Deployment**
--------------

Changes pushed to the main branch are automatically deployed to Vercel.

**Live URL**: https://smart-bookmark-app-sooty.vercel.app
