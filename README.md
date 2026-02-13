# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Login**: Secure sign-in with your Google account.
- **Private Bookmarks**: Your bookmarks are only visible to you.
- **Real-time Updates**: Add a bookmark in one tab, see it instantly in another.
- **Responsive Design**: Beautiful, glassmorphic UI that works on all devices.
- **Delete Functionality**: Easily remove unwanted bookmarks.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to **Project Settings > API** and copy the `Project URL` and `anon public` key.

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Database & Policies

Go to the **SQL Editor** in your Supabase dashboard and run the following script to set up the database schema and security policies:

```sql
-- Create the bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid default auth.uid() references auth.users
);

-- Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Policy: Users can view their own bookmarks
create policy "Users can view their own bookmarks"
on bookmarks for select
using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
on bookmarks for insert
with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
on bookmarks for delete
using (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
alter publication supabase_realtime add table bookmarks;
```

### 4. Configure Google Auth

1. Go to **Authentication > Providers** in Supabase.
2. Enable **Google**.
3. You will need to set up a Google Cloud Project to get the `Client ID` and `Client Secret`.
   - Authorized Redirect URI should be: `https://<your-project>.supabase.co/auth/v1/callback`
4. Add the Client ID and Secret to Supabase.

### 5. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the project.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4. Deploy!

### Vercel URL Configuration

In Supabase Authentication > URL Configuration:
- Set **Site URL** to your Vercel deployment URL (e.g., `https://smart-bookmarks.vercel.app`).
- Add `https://smart-bookmarks.vercel.app/auth/callback` to **Redirect URLs**.

For local development, ensure `http://localhost:3000` is in the Redirect URLs.
