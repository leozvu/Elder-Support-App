-- This migration fixes the issue with helper_profiles already being a member of supabase_realtime
-- First, we'll try to remove it from the publication if it exists
DO $$
BEGIN
  -- Check if the table is part of the publication
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'helper_profiles'
  ) THEN
    -- Remove the table from the publication
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE helper_profiles';
  END IF;

  -- Now we can safely add it back
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE helper_profiles';
EXCEPTION WHEN OTHERS THEN
  -- If there's an error, we'll just continue
  RAISE NOTICE 'Error managing helper_profiles in publication: %', SQLERRM;
END;
$$;
