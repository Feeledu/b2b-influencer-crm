# Database Design Specification

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    subscription_status VARCHAR(50) DEFAULT 'trial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Influencers Table
```sql
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'linkedin', 'podcast', 'newsletter'
    handle VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    email VARCHAR(255),
    linkedin_url TEXT,
    twitter_url TEXT,
    industry VARCHAR(100),
    audience_size INTEGER,
    engagement_rate DECIMAL(5,2),
    location VARCHAR(100),
    expertise_tags TEXT[], -- Array of expertise areas
    audience_demographics JSONB, -- Age, location, job titles
    contact_info JSONB, -- Additional contact details
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. User Influencers (Junction Table)
```sql
CREATE TABLE user_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'saved', -- 'saved', 'contacted', 'warm', 'cold', 'partnered'
    notes TEXT,
    priority INTEGER DEFAULT 0,
    tags TEXT[],
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, influencer_id)
);
```

### 4. Campaigns Table
```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'completed', 'cancelled'
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    spent DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Campaign Influencers (Junction Table)
```sql
CREATE TABLE campaign_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    utm_url TEXT,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'active', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);
```

### 6. Interactions Table
```sql
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- 'email', 'call', 'meeting', 'note', 'file_upload'
    subject VARCHAR(255),
    content TEXT,
    file_url TEXT,
    interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Pipeline Attribution Table
```sql
CREATE TABLE pipeline_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    opportunity_id VARCHAR(255), -- External CRM opportunity ID
    opportunity_name VARCHAR(255),
    stage VARCHAR(100), -- 'lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
    value DECIMAL(12,2),
    probability DECIMAL(5,2), -- 0-100
    close_date DATE,
    attribution_type VARCHAR(50), -- 'direct', 'assisted', 'influenced'
    attribution_strength DECIMAL(5,2), -- 0-100
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Campaign Outcomes Table
```sql
CREATE TABLE campaign_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'leads', 'demos', 'signups', 'revenue', 'pipeline'
    metric_value DECIMAL(12,2),
    metric_count INTEGER,
    attribution_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes

### Performance Indexes
```sql
-- Influencer search indexes
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_industry ON influencers(industry);
CREATE INDEX idx_influencers_audience_size ON influencers(audience_size);
CREATE INDEX idx_influencers_engagement_rate ON influencers(engagement_rate);
CREATE INDEX idx_influencers_expertise_tags ON influencers USING GIN(expertise_tags);

-- User data indexes
CREATE INDEX idx_user_influencers_user_id ON user_influencers(user_id);
CREATE INDEX idx_user_influencers_status ON user_influencers(status);
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_pipeline_attribution_user_id ON pipeline_attribution(user_id);

-- Campaign indexes
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_outcomes_campaign_id ON campaign_outcomes(campaign_id);

-- Date indexes
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);
CREATE INDEX idx_pipeline_attribution_close_date ON pipeline_attribution(close_date);
```

## Row Level Security

### Users Table RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);
```

### User Influencers RLS
```sql
ALTER TABLE user_influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own influencer lists" ON user_influencers
    FOR ALL USING (auth.uid() = user_id);
```

### Campaigns RLS
```sql
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own campaigns" ON campaigns
    FOR ALL USING (auth.uid() = user_id);
```

### Interactions RLS
```sql
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own interactions" ON interactions
    FOR ALL USING (auth.uid() = user_id);
```

### Pipeline Attribution RLS
```sql
ALTER TABLE pipeline_attribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own attribution data" ON pipeline_attribution
    FOR ALL USING (auth.uid() = user_id);
```

## Mock Data Generation

### Influencer Mock Data
- 200-500 realistic influencers across LinkedIn, podcasts, newsletters
- Realistic follower counts, engagement rates, industry tags
- Diverse geographic locations and expertise areas
- Proper contact information and social links

### User Mock Data
- 10-20 test users with different roles and subscription statuses
- Realistic user profiles and preferences
- Varied campaign and interaction histories

### Campaign Mock Data
- 50-100 campaigns across different users
- Realistic campaign names, budgets, and outcomes
- Proper UTM tracking and attribution data

### Pipeline Attribution Mock Data
- Realistic opportunity data with proper attribution
- Varied stages and values
- Proper attribution strength calculations
