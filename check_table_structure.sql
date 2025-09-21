-- Check if audience_demographics column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'influencers' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
