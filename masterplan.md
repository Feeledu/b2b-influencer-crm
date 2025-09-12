# masterplan.md

## Elevator Pitch  
A web app for B2B SaaS marketers to **find, track, and measure ROI** from LinkedIn creators, podcast hosts, and newsletter writers who influence their target buyers. Think *CRM + discovery engine* for non-paid influencer marketing.  

---

## Problem & Mission  
- **Problem:** Marketers struggle to prove ROI from LinkedIn shoutouts, podcast features, and newsletter partnerships. Tracking is ad hoc and scattered.  
- **Mission:** Centralize discovery, relationship management, and ROI tracking of B2B influencers—lightweight, intuitive, and ROI-focused.  

---

## Target Audience  
- **In-house SaaS marketers** (demand gen, brand, growth).  
- **Founder-led SaaS teams** running scrappy outreach campaigns.  
- **RevOps/brand teams** needing to report on non-paid channels.  

---

## Core Features  
- **Homepage / Landing**: Focused value prop + free trial CTA.  
- **Influencer Discovery/Search**: Preloaded, searchable DB of LinkedIn creators, podcasters, newsletter writers. Fast, typo-tolerant.  
- **Add to My List**: Save influencers to a private CRM-style workspace.  
- **CRM Workspace**:  
  - Contact info storage (LinkedIn, email, site, podcast link).  
  - Notes, status tags (Active/Warm/Cold/Partnered).  
  - Engagement timeline + file uploads (briefs, contracts).  
- **Campaign & ROI Tracking**:  
  - Track campaigns per influencer.  
  - Generate/log UTMs.  
  - Manually enter outcomes (signups, demos, revenue).  
  - Dashboard showing ROI per influencer and campaign.  
- **Account & Billing**:  
  - Marketer accounts only.  
  - Email + Google login.  
  - Trial → €79/mo subscription.  

---

## High-Level Tech Stack  
- **Front-End:** React + TypeScript + Vite, Tailwind + shadcn/ui (minimal, crisp, Airtable/Linear-inspired).  
- **Back-End:** FastAPI (or Django) for APIs + business logic.  
- **Database/Auth/Storage:** Supabase (Postgres-based, with built-in auth + file storage).  
- **Search:** Algolia or Elasticsearch for fast, fuzzy discovery.  
- **Task Queue:** Celery (future async jobs like reporting, outreach).  
- **Payments:** Stripe (subscription, free trial).  

---

## Conceptual Data Model (words as ERD)  
- **User**: id, email, subscription status.  
- **Influencer**: id, name, platform (LinkedIn/podcast/newsletter), bio, audience metrics, contact info.  
- **UserInfluencer (pivot)**: user_id, influencer_id, status, notes, files.  
- **Campaign**: id, user_id, influencer_id, name, start/end, UTM links, results.  
- **Interaction**: id, influencer_id, date, type (call, email, note), details.  
- **Billing**: Stripe customer id, subscription status.  

---

## UI Design Principles  
- **Don’t make me think**: crisp cards, whitespace, obvious CTAs.  
- **Mobile-first**: responsive grids, tap-friendly.  
- **Hierarchy**: Primary = discovery & workspace, Secondary = analytics.  
- **Tone**: corporate but friendly, like Airtable/Linear.  

---

## Security & Compliance  
- Supabase Auth (email + Google OAuth).  
- Stripe for billing (PCI handled externally).  
- HTTPS everywhere.  
- Store only business emails and public influencer data (GDPR-light footprint).  
- File uploads secured per user.  

---

## Phased Roadmap  
- **MVP (Marketer-only V1):**  
  - Preloaded influencer DB (manual upload).  
  - Search + fuzzy filters.  
  - “Add to My List” + CRM workspace.  
  - Campaign tracking (manual inputs).  
  - Stripe subscription flow.  
- **V1.1 (UX polish):**  
  - Better dashboards & ROI visualization.  
  - Admin tool for dataset refreshes.  
- **V2 (Enhancements):**  
  - AI-powered influencer suggestions.  
  - Outreach templates (emails, DMs).  
  - Automated UTM tracking via GA integration.  
- **V3 (Expansion):**  
  - Team accounts & collaboration.  
  - Semi-automated influencer discovery (scraping/API).  
  - API integrations with HubSpot, Salesforce.  

---

## Risks & Mitigations  
- **Data freshness**: Manual uploads → Mitigation: admin tools & periodic refreshes.  
- **Adoption risk**: Marketers may default to spreadsheets → Mitigation: emphasize ROI dashboards as unique differentiator.  
- **Search scaling**: Large datasets may slow down → Mitigation: Algolia/Elasticsearch from day one.  
- **Compliance**: Storing influencer contact data → Mitigation: focus on publicly available info + user-uploaded contacts only.  

---

## Future Expansion Ideas  
- Chrome extension for quick “Add influencer from LinkedIn.”  
- Marketplaces for sponsored posts / partnerships.  
- AI-powered lookalike influencer discovery.  
- Automated engagement tracking (email/LI activity).  
