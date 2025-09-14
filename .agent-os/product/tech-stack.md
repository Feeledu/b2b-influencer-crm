# Technical Stack

## Frontend

- **JavaScript Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **CSS Framework:** Tailwind CSS 3.x
- **UI Component Library:** shadcn/ui
- **Font Provider:** Inter (Google Fonts)
- **Icon Library:** Lucide React
- **Import Strategy:** node

## Backend

- **Application Framework:** FastAPI (Python 3.11+)
- **Task Queue:** Celery with Redis
- **API Documentation:** FastAPI auto-generated OpenAPI/Swagger

## Database & Storage

- **Database System:** PostgreSQL (via Supabase)
- **Database Hosting:** Supabase
- **File Storage:** Supabase Storage
- **Search Engine:** Algolia

## Authentication & Payments

- **Authentication:** Supabase Auth (Email + Google OAuth)
- **Payment Processing:** Stripe
- **Subscription Management:** Stripe Subscriptions

## Hosting & Deployment

- **Application Hosting:** Vercel (Frontend) / Railway (Backend)
- **Asset Hosting:** Vercel CDN
- **Deployment Solution:** Vercel + Railway with GitHub Actions
- **Code Repository:** GitHub

## Development Tools

- **Package Manager:** npm (Frontend) / pip (Backend)
- **Linting:** ESLint + Prettier (Frontend) / Black + isort (Backend)
- **Type Checking:** TypeScript (Frontend) / mypy (Backend)
- **Testing:** Jest + React Testing Library (Frontend) / pytest (Backend)

## Monitoring & Analytics

- **Error Tracking:** Sentry
- **Analytics:** PostHog or Mixpanel
- **Uptime Monitoring:** UptimeRobot

## Security

- **HTTPS:** Everywhere (handled by hosting providers)
- **CORS:** Configured for production domains
- **Rate Limiting:** FastAPI rate limiting
- **Data Privacy:** GDPR-compliant data handling
