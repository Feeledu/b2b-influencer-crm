# Monitoring Setup - Production Launch

## Monitoring Overview

This document outlines the comprehensive monitoring strategy for Fluencr's production launch, covering error tracking, performance monitoring, uptime monitoring, and user analytics.

## Monitoring Stack

### Error Monitoring
- **Sentry**: Real-time error tracking and alerting
- **LogRocket**: Session replay and user experience monitoring
- **Custom Error Boundaries**: React error handling

### Performance Monitoring
- **Vercel Analytics**: Frontend performance metrics
- **Railway Metrics**: Backend performance monitoring
- **Supabase Monitoring**: Database performance tracking
- **New Relic**: Full-stack performance monitoring

### Uptime Monitoring
- **Uptime Robot**: Service availability monitoring
- **Pingdom**: Advanced uptime monitoring
- **Custom Health Checks**: Application-specific monitoring

### User Analytics
- **Google Analytics 4**: User behavior tracking
- **Mixpanel**: Event tracking and funnels
- **Hotjar**: User session recordings

## Error Monitoring Setup

### Sentry Configuration

#### Frontend Setup
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});

export default Sentry;
```

#### Backend Setup
```python
# backend/app/sentry.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("ENVIRONMENT", "production"),
    integrations=[
        FastApiIntegration(auto_enabling_instrumentations=True),
        SqlalchemyIntegration(),
    ],
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)
```

#### Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import * as Sentry from '@sentry/react';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
      beforeCapture={(scope) => {
        scope.setTag('errorBoundary', true);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
```

### LogRocket Setup

#### Frontend Integration
```typescript
// src/lib/logrocket.ts
import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(process.env.VITE_LOGROCKET_APP_ID);
  
  // Identify users
  LogRocket.identify(userId, {
    name: user.name,
    email: user.email,
  });
}

export default LogRocket;
```

## Performance Monitoring

### Vercel Analytics

#### Setup
```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
      <Analytics />
    </div>
  );
}
```

#### Custom Metrics
```typescript
// src/lib/analytics.ts
import { track } from '@vercel/analytics';

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  track(event, properties);
};

// Usage
trackEvent('campaign_created', {
  campaign_id: campaign.id,
  budget: campaign.budget,
  influencer_count: campaign.influencers.length,
});
```

### Backend Performance Monitoring

#### Custom Middleware
```python
# backend/app/middleware/performance.py
import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class PerformanceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log slow requests
        if process_time > 1.0:
            logger.warning(f"Slow request: {request.url} took {process_time:.2f}s")
        
        return response
```

#### Database Query Monitoring
```python
# backend/app/database/monitoring.py
import time
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def monitor_query(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            execution_time = time.time() - start_time
            
            if execution_time > 0.5:  # Log slow queries
                logger.warning(f"Slow query: {func.__name__} took {execution_time:.2f}s")
            
            return result
        except Exception as e:
            logger.error(f"Query error in {func.__name__}: {str(e)}")
            raise
    return wrapper

# Usage
@monitor_query
async def get_campaigns(user_id: str):
    # Database query
    pass
```

## Uptime Monitoring

### Uptime Robot Setup

#### Health Check Endpoints
```python
# backend/app/api/health.py
from fastapi import APIRouter, Depends
from app.database.connection import get_supabase_client

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@router.get("/health/detailed")
async def detailed_health_check(supabase=Depends(get_supabase_client)):
    try:
        # Test database connection
        result = supabase.table('users').select('id').limit(1).execute()
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow()
        }
```

#### Frontend Health Check
```typescript
// src/api/health.ts
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Usage in app
useEffect(() => {
  const interval = setInterval(async () => {
    const isHealthy = await checkHealth();
    if (!isHealthy) {
      // Show maintenance mode
      setMaintenanceMode(true);
    }
  }, 30000); // Check every 30 seconds

  return () => clearInterval(interval);
}, []);
```

### Custom Uptime Monitoring

#### Service Status Page
```typescript
// src/pages/Status.tsx
import React, { useState, useEffect } from 'react';

const StatusPage = () => {
  const [services, setServices] = useState({
    frontend: { status: 'checking', responseTime: 0 },
    backend: { status: 'checking', responseTime: 0 },
    database: { status: 'checking', responseTime: 0 },
  });

  useEffect(() => {
    const checkServices = async () => {
      // Check frontend
      const frontendStart = Date.now();
      const frontendHealthy = await checkHealth();
      const frontendTime = Date.now() - frontendStart;

      // Check backend
      const backendStart = Date.now();
      const backendHealthy = await fetch('/api/health').then(r => r.ok);
      const backendTime = Date.now() - backendStart;

      // Check database
      const dbStart = Date.now();
      const dbHealthy = await fetch('/api/health/detailed').then(r => r.ok);
      const dbTime = Date.now() - dbStart;

      setServices({
        frontend: { status: frontendHealthy ? 'up' : 'down', responseTime: frontendTime },
        backend: { status: backendHealthy ? 'up' : 'down', responseTime: backendTime },
        database: { status: dbHealthy ? 'up' : 'down', responseTime: dbTime },
      });
    };

    checkServices();
    const interval = setInterval(checkServices, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-page">
      <h1>Service Status</h1>
      {Object.entries(services).map(([service, data]) => (
        <div key={service} className="service-status">
          <span className={`status ${data.status}`}>{data.status}</span>
          <span className="service-name">{service}</span>
          <span className="response-time">{data.responseTime}ms</span>
        </div>
      ))}
    </div>
  );
};
```

## User Analytics

### Google Analytics 4 Setup

#### Configuration
```typescript
// src/lib/gtag.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.VITE_GA_TRACKING_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = (action: string, parameters: Record<string, any>) => {
  window.gtag('event', action, parameters);
};

// Usage
export const trackCampaignCreated = (campaign: Campaign) => {
  event('campaign_created', {
    campaign_id: campaign.id,
    budget: campaign.budget,
    influencer_count: campaign.influencers.length,
  });
};
```

#### Custom Events
```typescript
// src/lib/analytics.ts
export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'user_action',
      ...properties,
    });
  }
};

// Track specific user actions
export const trackInfluencerAdded = (influencerId: string) => {
  trackUserAction('influencer_added', { influencer_id: influencerId });
};

export const trackCampaignViewed = (campaignId: string) => {
  trackUserAction('campaign_viewed', { campaign_id: campaignId });
};
```

### Mixpanel Setup

#### Configuration
```typescript
// src/lib/mixpanel.ts
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.VITE_MIXPANEL_TOKEN, {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
});

export const track = (event: string, properties?: Record<string, any>) => {
  mixpanel.track(event, properties);
};

export const identify = (userId: string, properties?: Record<string, any>) => {
  mixpanel.identify(userId);
  if (properties) {
    mixpanel.people.set(properties);
  }
};
```

## Alerting Configuration

### Sentry Alerts
- **Error Rate**: Alert if error rate > 5%
- **New Issues**: Alert on new error types
- **Performance**: Alert on slow transactions
- **Release Issues**: Alert on deployment problems

### Uptime Alerts
- **Service Down**: Alert if any service is down
- **Response Time**: Alert if response time > 5s
- **SSL Certificate**: Alert 30 days before expiration

### Performance Alerts
- **Database Queries**: Alert on slow queries > 1s
- **API Response**: Alert if 95th percentile > 500ms
- **Memory Usage**: Alert if memory usage > 80%

## Monitoring Dashboards

### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Fluencr Production Monitoring",
    "panels": [
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(sentry_errors_total[5m])",
            "legendFormat": "Errors/sec"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "supabase_connections_active",
            "legendFormat": "Active Connections"
          }
        ]
      }
    ]
  }
}
```

### Custom Dashboard
```typescript
// src/components/MonitoringDashboard.tsx
import React, { useState, useEffect } from 'react';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState({
    errorRate: 0,
    responseTime: 0,
    uptime: 100,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      // Fetch metrics from monitoring APIs
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="monitoring-dashboard">
      <h2>Production Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Error Rate</h3>
          <div className="metric-value">{metrics.errorRate}%</div>
        </div>
        <div className="metric-card">
          <h3>Response Time</h3>
          <div className="metric-value">{metrics.responseTime}ms</div>
        </div>
        <div className="metric-card">
          <h3>Uptime</h3>
          <div className="metric-value">{metrics.uptime}%</div>
        </div>
        <div className="metric-card">
          <h3>Active Users</h3>
          <div className="metric-value">{metrics.activeUsers}</div>
        </div>
      </div>
    </div>
  );
};
```

## Log Management

### Structured Logging
```python
# backend/app/logging.py
import logging
import json
from datetime import datetime

class StructuredLogger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    def log(self, level: str, message: str, **kwargs):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': level,
            'message': message,
            **kwargs
        }
        self.logger.info(json.dumps(log_entry))

# Usage
logger = StructuredLogger('api')
logger.log('info', 'User created campaign', user_id=user_id, campaign_id=campaign_id)
```

### Log Aggregation
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Fluentd**: Log collection and forwarding
- **CloudWatch**: AWS log management
- **Datadog**: Log aggregation and analysis

## Security Monitoring

### Security Event Tracking
```typescript
// src/lib/security.ts
export const trackSecurityEvent = (event: string, details: Record<string, any>) => {
  // Send to security monitoring system
  fetch('/api/security/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      details,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip: 'client-ip', // Get from server
    }),
  });
};

// Track suspicious activities
export const trackFailedLogin = (email: string) => {
  trackSecurityEvent('failed_login', { email });
};

export const trackSuspiciousActivity = (activity: string, details: any) => {
  trackSecurityEvent('suspicious_activity', { activity, details });
};
```

## Monitoring Best Practices

### 1. Alert Fatigue Prevention
- Set appropriate thresholds
- Use alert grouping
- Implement alert escalation
- Regular alert review

### 2. Performance Optimization
- Monitor key metrics only
- Use sampling for high-volume events
- Implement metric retention policies
- Regular cleanup of old data

### 3. Security Considerations
- Encrypt sensitive log data
- Implement access controls
- Regular security audits
- Compliance with data protection regulations

### 4. Cost Management
- Monitor monitoring costs
- Use appropriate retention periods
- Implement data archiving
- Regular cost optimization

## Monitoring Checklist

### Pre-Launch
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring set up
- [ ] User analytics implemented
- [ ] Alerting configured
- [ ] Dashboards created
- [ ] Log management set up
- [ ] Security monitoring active

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Verify all alerts work
- [ ] Check dashboard accuracy
- [ ] Review log data
- [ ] Optimize based on data
- [ ] Document any issues
- [ ] Plan improvements
