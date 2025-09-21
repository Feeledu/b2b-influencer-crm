# Deployment Guide - Production Launch

## Prerequisites

- GitHub repository with latest code
- Supabase account with production project
- Vercel account (for frontend)
- Railway/Heroku account (for backend)
- Domain name (optional)

## Step 1: Frontend Deployment (Vercel)

### 1.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `Feeledu/b2b-influencer-crm`

### 1.2 Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 1.3 Set Environment Variables
In Vercel dashboard, go to Project Settings > Environment Variables:

```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_API_BASE_URL=https://your-backend-url.com
```

### 1.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test the deployed URL

## Step 2: Backend Deployment (Railway)

### 2.1 Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2.2 Configure Backend
Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

### 2.3 Set Environment Variables
In Railway dashboard, go to Variables:

```
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=8000
```

### 2.4 Deploy
1. Railway will automatically deploy
2. Get the deployment URL
3. Test the API endpoints

## Step 3: Database Production Setup

### 3.1 Create Production Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and name: "fluencr-production"
4. Set strong database password
5. Select region closest to your users

### 3.2 Run Database Migrations
1. Go to SQL Editor in Supabase
2. Run all migration files in order:
   - `001_create_core_tables.sql`
   - `002_create_indexes.sql`
   - `003_create_rls_policies.sql`
   - `004_add_admin_fields.sql`
   - `005_crm_workspace_schema.sql`
   - `006_crm_performance_indexes.sql`
   - `007_admin_analytics_view.sql`
   - `008_intent_discovery_schema.sql`
   - `009_enhance_campaigns_schema.sql`

### 3.3 Configure RLS Policies
```sql
-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_influencers ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = user_id);
```

### 3.4 Set Up Backups
1. Go to Settings > Database
2. Enable "Point in time recovery"
3. Set backup retention to 7 days
4. Test backup restoration

## Step 4: Domain Configuration

### 4.1 Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Domains
2. Add your domain: `app.fluencr.com`
3. Configure DNS records as instructed
4. Wait for SSL certificate (up to 24 hours)

### 4.2 Update Environment Variables
Update frontend environment variables with new domain:
```
VITE_API_BASE_URL=https://api.fluencr.com
```

## Step 5: Testing Deployment

### 5.1 Frontend Tests
```bash
# Test frontend deployment
curl -I https://your-frontend-url.vercel.app
# Should return 200 OK

# Test API connectivity
curl https://your-frontend-url.vercel.app/api/health
# Should return health status
```

### 5.2 Backend Tests
```bash
# Test backend deployment
curl -I https://your-backend-url.railway.app/health
# Should return 200 OK

# Test API endpoints
curl https://your-backend-url.railway.app/api/v1/campaigns
# Should return campaigns (with auth)
```

### 5.3 Database Tests
1. Go to Supabase Dashboard > Table Editor
2. Verify all tables exist
3. Test RLS policies
4. Check data integrity

## Step 6: Monitoring Setup

### 6.1 Error Monitoring (Sentry)
1. Create Sentry account
2. Create new project for React + Python
3. Install Sentry SDK in both frontend and backend
4. Configure error tracking

### 6.2 Performance Monitoring
1. Set up Vercel Analytics
2. Configure Railway metrics
3. Set up Supabase monitoring
4. Create performance dashboards

### 6.3 Uptime Monitoring
1. Use Uptime Robot or similar
2. Set up checks for:
   - Frontend URL
   - Backend API health
   - Database connectivity
3. Configure alerts

## Troubleshooting

### Common Issues

#### Build Failures
- Check environment variables
- Verify build commands
- Check for TypeScript errors
- Review build logs

#### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies
- Test connection from backend
- Review database logs

#### CORS Issues
- Update CORS settings in backend
- Check allowed origins
- Verify frontend URL
- Test API calls

#### Performance Issues
- Check database queries
- Review API response times
- Optimize frontend bundle
- Check CDN configuration

## Rollback Plan

### If Deployment Fails
1. Revert to previous Vercel deployment
2. Rollback database migrations if needed
3. Update environment variables
4. Test all functionality
5. Investigate and fix issues

### Emergency Procedures
1. Disable new user registrations
2. Show maintenance page
3. Notify users of issues
4. Work on fixes
5. Re-enable when ready

## Post-Deployment Checklist

- [ ] All services are running
- [ ] Environment variables are set
- [ ] Database migrations completed
- [ ] RLS policies active
- [ ] Monitoring is working
- [ ] Error tracking is active
- [ ] Performance monitoring is active
- [ ] Uptime monitoring is active
- [ ] SSL certificates are valid
- [ ] All tests are passing
- [ ] User workflows are working
- [ ] Backup systems are active
