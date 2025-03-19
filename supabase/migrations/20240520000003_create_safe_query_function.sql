-- Create a function to safely run SELECT queries
CREATE OR REPLACE FUNCTION run_select_query(query_text text)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if the query is a SELECT query
  IF NOT (query_text ~* '^SELECT') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  -- Check for dangerous operations
  IF query_text ~* 'DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE|GRANT|REVOKE' THEN
    RAISE EXCEPTION 'Query contains disallowed operations';
  END IF;
  
  -- Execute the query and return the result
  EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || query_text || ') t' INTO result;
  
  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Query error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION run_select_query(text) TO authenticated;