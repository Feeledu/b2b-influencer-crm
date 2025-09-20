# 🚀 Supabase Setup Guide

## Quick Start

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Fill in:
   - **Name:** `b2b-influencer-crm`
   - **Database Password:** Create strong password (save this!)
   - **Region:** Choose closest location
   - **Plan:** Free tier

### 2. Get Credentials
1. Go to **Settings → API**
2. Copy:
   - **Project URL** (https://your-project-id.supabase.co)
   - **anon public** key (eyJ...)
   - **service_role** key (eyJ...)
3. Go to **Settings → Database**
4. Copy your **Database Password**

### 3. Update Credentials
```bash
./update-supabase-credentials.sh
```
Follow the prompts to enter your credentials.

### 4. Run Database Migrations
```bash
./run-migrations.sh
```
This creates all the required database tables.

### 5. Restart Servers
```bash
# Stop current servers (Ctrl+C)
# Then restart:

# Backend
cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (in new terminal)
npm run dev
```

### 6. Test the Setup
1. Open http://localhost:8081
2. You should now see real data instead of mock data
3. Check http://localhost:8000/docs for API documentation

## What Gets Created

### Database Tables:
- **users** - User accounts and authentication
- **influencers** - B2B influencers across platforms
- **user_influencers** - User's saved influencer lists
- **campaigns** - Marketing campaigns
- **campaign_influencers** - Influencers assigned to campaigns
- **interactions** - User interactions with influencers
- **pipeline_attribution** - Revenue attribution tracking
- **campaign_outcomes** - Campaign performance metrics

### Features Enabled:
- ✅ Real user authentication
- ✅ Database persistence
- ✅ API endpoints working
- ✅ Influencer CRUD operations
- ✅ User relationship management

## Troubleshooting

### Common Issues:
1. **"Client.__init__() got an unexpected keyword argument 'proxy'"**
   - This is a Supabase client version issue
   - The app will still work, just ignore this error

2. **"Authentication required"**
   - Make sure you're logged in to the frontend
   - Check that Supabase credentials are correct

3. **"Failed to fetch influencers"**
   - Check backend server is running
   - Verify database connection in backend logs

### Getting Help:
- Check the terminal output for error messages
- Verify all environment variables are set correctly
- Make sure both servers are running

## Next Steps After Setup

1. **Populate Sample Data:**
   ```bash
   cd backend
   python scripts/populate_simple.py
   ```

2. **Test All Features:**
   - User registration/login
   - Influencer discovery
   - Add to My List functionality
   - Campaign creation

3. **Deploy to Production:**
   - Frontend: Vercel/Netlify
   - Backend: Railway/Heroku
   - Database: Supabase (already hosted)
