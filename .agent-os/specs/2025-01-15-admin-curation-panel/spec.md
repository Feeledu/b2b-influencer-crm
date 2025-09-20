# Admin Curation Panel Specification

## Overview
Admin-only interface for manual influencer management, verification, and bulk import capabilities. This tool enables quality control and curation of the B2B influencer database.

## User Stories

### Admin User Stories
- **As an admin**, I want to add new influencers manually so I can expand the database with verified contacts
- **As an admin**, I want to verify influencer information so I can ensure data quality
- **As an admin**, I want to bulk import influencers from CSV so I can efficiently populate the database
- **As an admin**, I want to edit influencer details so I can keep information up-to-date
- **As an admin**, I want to delete invalid influencers so I can maintain database quality
- **As an admin**, I want to see verification status so I can track curation progress

## Features

### Core Features
1. **Influencer Management**
   - Add new influencers with full profile data
   - Edit existing influencer information
   - Delete invalid or duplicate influencers
   - View influencer verification status

2. **Verification System**
   - Mark influencers as verified/unverified
   - Add verification notes
   - Track verification history
   - Bulk verification actions

3. **Bulk Import**
   - CSV upload with validation
   - Template download for proper formatting
   - Import preview with error handling
   - Batch processing with progress tracking

4. **Quality Control**
   - Duplicate detection
   - Data validation rules
   - Missing field identification
   - Data completeness scoring

### Technical Requirements
- Admin-only access with role-based permissions
- File upload handling for CSV imports
- Real-time validation and error reporting
- Responsive design for desktop and tablet use
- Integration with existing influencer API

## API Endpoints

### Admin Influencer Management
```
POST /api/v1/admin/influencers - Create new influencer
PUT /api/v1/admin/influencers/{id} - Update influencer
DELETE /api/v1/admin/influencers/{id} - Delete influencer
GET /api/v1/admin/influencers - List all influencers with admin fields
POST /api/v1/admin/influencers/bulk-import - Bulk import from CSV
GET /api/v1/admin/influencers/import-template - Download CSV template
```

### Verification Endpoints
```
PUT /api/v1/admin/influencers/{id}/verify - Mark as verified
PUT /api/v1/admin/influencers/{id}/unverify - Mark as unverified
POST /api/v1/admin/influencers/bulk-verify - Bulk verification
GET /api/v1/admin/influencers/verification-stats - Verification statistics
```

## Database Schema Updates

### New Fields for Influencers Table
```sql
ALTER TABLE influencers ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE influencers ADD COLUMN verified_by UUID REFERENCES users(id);
ALTER TABLE influencers ADD COLUMN verification_notes TEXT;
ALTER TABLE influencers ADD COLUMN admin_notes TEXT;
ALTER TABLE influencers ADD COLUMN import_source VARCHAR(50);
ALTER TABLE influencers ADD COLUMN data_quality_score INTEGER DEFAULT 0;
```

### New Table: Import Batches
```sql
CREATE TABLE import_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id),
    filename VARCHAR(255),
    total_rows INTEGER,
    processed_rows INTEGER,
    success_count INTEGER,
    error_count INTEGER,
    status VARCHAR(50) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

## UI Components

### Admin Dashboard
- Verification statistics overview
- Recent imports summary
- Data quality metrics
- Quick actions panel

### Influencer Management Table
- Sortable columns (name, platform, verified status, quality score)
- Bulk selection and actions
- Advanced filtering options
- Pagination with large datasets

### Add/Edit Influencer Form
- All influencer fields with validation
- Platform-specific field sets
- AI analysis preview
- Verification status controls

### Bulk Import Interface
- File upload with drag-and-drop
- CSV template download
- Import preview with validation errors
- Progress tracking and results summary

## Security & Permissions

### Admin Role Requirements
- Super admin role for full access
- Admin role for influencer management
- Read-only admin role for viewing

### Data Validation
- Input sanitization for all fields
- File type validation for uploads
- Size limits for CSV files
- Rate limiting for bulk operations

## Success Metrics
- Time to add new influencer: < 2 minutes
- Bulk import processing: 1000+ records in < 5 minutes
- Data quality score improvement: > 20%
- Admin user satisfaction: > 4.5/5 rating

## Dependencies
- Existing influencer API endpoints
- File upload service (Supabase Storage)
- Admin authentication system
- CSV parsing library
- Data validation framework
