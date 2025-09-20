-- Migration: Add Admin Fields for Curation Panel
-- Created: 2025-01-15
-- Description: Add verification and admin management fields to influencers table

-- Add admin fields to influencers table
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES users(id);
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS import_source VARCHAR(50);
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0;

-- Create import_batches table for tracking bulk imports
CREATE TABLE IF NOT EXISTS import_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL,
    processed_rows INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_influencers_verified_at ON influencers(verified_at);
CREATE INDEX IF NOT EXISTS idx_influencers_verified_by ON influencers(verified_by);
CREATE INDEX IF NOT EXISTS idx_influencers_data_quality ON influencers(data_quality_score);
CREATE INDEX IF NOT EXISTS idx_influencers_import_source ON influencers(import_source);
CREATE INDEX IF NOT EXISTS idx_import_batches_admin_user ON import_batches(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_import_batches_status ON import_batches(status);
CREATE INDEX IF NOT EXISTS idx_import_batches_created_at ON import_batches(created_at);

-- Add comments for documentation
COMMENT ON COLUMN influencers.verified_at IS 'Timestamp when influencer was verified by admin';
COMMENT ON COLUMN influencers.verified_by IS 'Admin user who verified the influencer';
COMMENT ON COLUMN influencers.verification_notes IS 'Admin notes about verification process';
COMMENT ON COLUMN influencers.admin_notes IS 'General admin notes about the influencer';
COMMENT ON COLUMN influencers.import_source IS 'Source of influencer data (manual, csv_import, api, etc.)';
COMMENT ON COLUMN influencers.data_quality_score IS 'Data completeness score (0-100)';

COMMENT ON TABLE import_batches IS 'Tracks bulk import operations for admin panel';
COMMENT ON COLUMN import_batches.filename IS 'Original filename of uploaded CSV';
COMMENT ON COLUMN import_batches.total_rows IS 'Total number of rows in CSV file';
COMMENT ON COLUMN import_batches.processed_rows IS 'Number of rows processed so far';
COMMENT ON COLUMN import_batches.success_count IS 'Number of successfully imported rows';
COMMENT ON COLUMN import_batches.error_count IS 'Number of rows with errors';
COMMENT ON COLUMN import_batches.status IS 'Current status of import operation';
COMMENT ON COLUMN import_batches.error_details IS 'Detailed error information for failed imports';
