# Testing Strategy - Production Launch

## Testing Overview

This document outlines the comprehensive testing strategy for Fluencr's production launch, covering unit tests, integration tests, end-to-end tests, load testing, and security testing.

## Testing Pyramid

### Unit Tests (70%)
- Component testing
- Function testing
- Utility testing
- Mock external dependencies

### Integration Tests (20%)
- API endpoint testing
- Database integration
- Authentication flows
- Third-party service integration

### End-to-End Tests (10%)
- Complete user workflows
- Cross-browser testing
- Mobile responsiveness
- Real user scenarios

## Unit Testing Setup

### Frontend Testing (Jest + React Testing Library)

#### Installation
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

#### Configuration
Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Test Examples

**Component Testing:**
```typescript
// src/components/__tests__/CreateCampaignForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateCampaignForm } from '../CreateCampaignForm';

describe('CreateCampaignForm', () => {
  it('renders form fields correctly', () => {
    render(<CreateCampaignForm onSave={jest.fn()} onCancel={jest.fn()} />);
    
    expect(screen.getByLabelText('Campaign Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Budget')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CreateCampaignForm onSave={jest.fn()} onCancel={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Campaign name is required')).toBeInTheDocument();
  });
});
```

**Hook Testing:**
```typescript
// src/hooks/__tests__/useCampaigns.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useCampaigns } from '../useCampaigns';

describe('useCampaigns', () => {
  it('fetches campaigns successfully', async () => {
    const { result } = renderHook(() => useCampaigns());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.campaigns).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

### Backend Testing (pytest)

#### Installation
```bash
cd backend
pip install pytest pytest-asyncio httpx
```

#### Configuration
Create `pytest.ini`:
```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
```

#### Test Examples

**API Testing:**
```python
# backend/tests/test_campaigns_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_campaign():
    response = client.post(
        "/api/v1/campaigns",
        json={
            "name": "Test Campaign",
            "description": "Test Description",
            "budget": 10000
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test Campaign"

def test_get_campaigns():
    response = client.get(
        "/api/v1/campaigns",
        headers={"Authorization": "Bearer test-token"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

**Database Testing:**
```python
# backend/tests/test_database.py
import pytest
from app.database.connection import get_supabase_client

def test_database_connection():
    supabase = get_supabase_client()
    assert supabase is not None

def test_campaign_crud():
    supabase = get_supabase_client()
    
    # Create
    result = supabase.table('campaigns').insert({
        'name': 'Test Campaign',
        'user_id': 'test-user-id'
    }).execute()
    
    assert result.data is not None
    campaign_id = result.data[0]['id']
    
    # Read
    result = supabase.table('campaigns').select('*').eq('id', campaign_id).execute()
    assert len(result.data) == 1
    
    # Update
    result = supabase.table('campaigns').update({
        'name': 'Updated Campaign'
    }).eq('id', campaign_id).execute()
    
    assert result.data[0]['name'] == 'Updated Campaign'
    
    # Delete
    result = supabase.table('campaigns').delete().eq('id', campaign_id).execute()
    assert result.data is not None
```

## Integration Testing

### API Integration Tests

**Test Suite:**
```typescript
// src/__tests__/integration/api.test.ts
import { apiService } from '../lib/api';

describe('API Integration', () => {
  beforeEach(() => {
    // Setup test user
  });

  afterEach(() => {
    // Cleanup test data
  });

  it('should create and retrieve campaigns', async () => {
    const campaign = await apiService.createCampaign({
      name: 'Test Campaign',
      description: 'Test Description',
      budget: 10000
    });
    
    expect(campaign.id).toBeDefined();
    
    const campaigns = await apiService.getCampaigns();
    expect(campaigns.data).toContainEqual(
      expect.objectContaining({ id: campaign.id })
    );
  });

  it('should handle authentication errors', async () => {
    // Test with invalid token
    await expect(apiService.getCampaigns()).rejects.toThrow('Unauthorized');
  });
});
```

### Database Integration Tests

**Test Database Setup:**
```python
# backend/tests/conftest.py
import pytest
from app.database.connection import get_supabase_client

@pytest.fixture
def test_db():
    # Use test database
    return get_supabase_client()

@pytest.fixture
def test_user():
    # Create test user
    return {
        'id': 'test-user-id',
        'email': 'test@example.com'
    }

@pytest.fixture(autouse=True)
def cleanup_test_data(test_db):
    yield
    # Cleanup after each test
    test_db.table('campaigns').delete().eq('user_id', 'test-user-id').execute()
```

## End-to-End Testing

### Playwright Setup

#### Installation
```bash
npm install --save-dev @playwright/test
npx playwright install
```

#### Configuration
Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

#### E2E Test Examples

**User Workflow Tests:**
```typescript
// e2e/campaign-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Campaign Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Login process
  });

  test('should create a new campaign', async ({ page }) => {
    await page.goto('/campaigns');
    
    // Click create campaign button
    await page.click('button:has-text("New Campaign")');
    
    // Fill form
    await page.fill('input[name="name"]', 'E2E Test Campaign');
    await page.fill('input[name="budget"]', '5000');
    await page.fill('textarea[name="description"]', 'E2E test description');
    
    // Select influencers
    await page.click('div:has-text("John Doe")');
    
    // Submit form
    await page.click('button:has-text("Create Campaign")');
    
    // Verify campaign was created
    await expect(page.locator('text=E2E Test Campaign')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/campaigns');
    await page.click('button:has-text("New Campaign")');
    await page.click('button:has-text("Create Campaign")');
    
    await expect(page.locator('text=Campaign name is required')).toBeVisible();
  });
});
```

**Cross-Browser Testing:**
```typescript
// e2e/cross-browser.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility', () => {
  test('should work on Chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox');
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit');
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## Load Testing

### K6 Setup

#### Installation
```bash
npm install -g k6
```

#### Load Test Scripts

**API Load Testing:**
```javascript
// load-tests/api-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function() {
  let response = http.get('https://your-api-url.com/api/v1/campaigns', {
    headers: {
      'Authorization': 'Bearer test-token',
    },
  });
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  sleep(1);
}
```

**Frontend Load Testing:**
```javascript
// load-tests/frontend-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function() {
  let response = http.get('https://your-frontend-url.vercel.app');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'page loads quickly': (r) => r.timings.duration < 3000,
  });
  
  sleep(2);
}
```

## Security Testing

### OWASP ZAP Integration

#### Installation
```bash
# Install OWASP ZAP
# Download from https://www.zaproxy.org/download/
```

#### Security Test Script
```bash
#!/bin/bash
# security-tests/run-security-scan.sh

# Start ZAP
zap.sh -daemon -port 8090 -config api.disablekey=true &

# Wait for ZAP to start
sleep 30

# Run spider scan
curl "http://localhost:8090/JSON/spider/action/scan/?url=https://your-frontend-url.vercel.app"

# Wait for scan to complete
sleep 300

# Run active scan
curl "http://localhost:8090/JSON/ascan/action/scan/?url=https://your-frontend-url.vercel.app"

# Wait for scan to complete
sleep 600

# Generate report
curl "http://localhost:8090/OTHER/core/other/htmlreport/" > security-report.html

# Stop ZAP
pkill -f zap
```

### Authentication Security Tests

```typescript
// security-tests/auth-security.test.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Security', () => {
  test('should not expose sensitive data in localStorage', async ({ page }) => {
    await page.goto('/login');
    // Login process
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Check localStorage
    const localStorage = await page.evaluate(() => window.localStorage);
    expect(localStorage).not.toHaveProperty('password');
    expect(localStorage).not.toHaveProperty('secret');
  });

  test('should require authentication for protected routes', async ({ page }) => {
    await page.goto('/campaigns');
    await expect(page.locator('text=Please log in')).toBeVisible();
  });

  test('should handle invalid tokens gracefully', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'invalid-token');
    });
    
    await page.goto('/campaigns');
    await expect(page.locator('text=Please log in')).toBeVisible();
  });
});
```

## Test Automation

### GitHub Actions CI/CD

Create `.github/workflows/test.yml`:
```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e

  load-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g k6
      - run: k6 run load-tests/api-load.js
      - run: k6 run load-tests/frontend-load.js
```

## Test Coverage Requirements

### Frontend Coverage
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Backend Coverage
- **Statements**: 85%
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%

### Critical Path Coverage
- **Authentication flows**: 100%
- **Campaign CRUD operations**: 100%
- **Payment processing**: 100%
- **Data validation**: 100%

## Test Data Management

### Test Database
- Separate test database instance
- Automated data seeding
- Cleanup after each test
- Isolated test environments

### Mock Data
- Consistent mock data across tests
- Realistic data scenarios
- Edge case data
- Performance test data

## Performance Benchmarks

### Frontend Performance
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

### Backend Performance
- **API Response Time**: <200ms (95th percentile)
- **Database Query Time**: <100ms (95th percentile)
- **Concurrent Users**: 1000+
- **Uptime**: 99.9%

## Test Reporting

### Coverage Reports
- HTML coverage reports
- Coverage badges in README
- Coverage trends over time
- Coverage alerts on regression

### Test Results
- JUnit XML reports
- HTML test reports
- Test result notifications
- Performance metrics

## Continuous Testing

### Pre-commit Hooks
- Lint checks
- Unit test execution
- Type checking
- Security scanning

### PR Validation
- Full test suite execution
- Performance regression checks
- Security vulnerability scanning
- Code quality gates

### Production Monitoring
- Real user monitoring
- Error tracking
- Performance monitoring
- Uptime monitoring
