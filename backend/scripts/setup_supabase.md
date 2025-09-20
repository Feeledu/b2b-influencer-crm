# Supabase Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign up/Login with your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Project name: `b2b-influencer-crm`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a progress indicator

## Step 2: Get Project Credentials

1. **Go to Project Settings**
   - Click the gear icon (Settings) in the left sidebar
   - Click "API" in the settings menu

2. **Copy These Values**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Get Database Credentials**
   - Go to "Database" in settings
   - Copy **Host**, **Database name**, **Port**, **Username**
   - Use the password you created in Step 1

## Step 3: Configure Environment Variables

1. **Create .env file in backend directory**
2. **Add these variables:**

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Database Connection (for migrations)
SUPABASE_HOST=db.your-project-id.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-database-password

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://app.b2binfluencer.com

# Environment
ENVIRONMENT=development
LOG_LEVEL=INFO
```

## Step 4: Install Supabase CLI

1. **Install via npm:**
   ```bash
   npm install -g supabase
   ```

2. **Verify installation:**
   ```bash
   supabase --version
   ```

## Step 5: Test Connection

1. **Run the connection test:**
   ```bash
   cd backend
   python scripts/test_connection.py
   ```

2. **You should see:**
   ```
   ✅ Supabase connection successful
   ✅ Database connection successful
   ✅ Ready to run migrations
   ```

## Next Steps

Once you've completed these steps, we'll:
1. Run the database migrations
2. Generate and seed mock data
3. Test the complete database setup

## Troubleshooting

### Common Issues:
- **Connection failed**: Check your credentials in .env
- **Permission denied**: Make sure you're using the service role key
- **Project not found**: Verify the project URL is correct

### Getting Help:
- Check Supabase docs: https://supabase.com/docs
- Join Supabase Discord: https://discord.supabase.com
