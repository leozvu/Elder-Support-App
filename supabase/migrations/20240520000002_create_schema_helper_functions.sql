-- Create functions to help with schema diagnostics

-- Function to get table columns
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' AND
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- Function to check foreign key constraints
CREATE OR REPLACE FUNCTION check_foreign_keys(table_name text)
RETURNS TABLE (
  constraint_name text,
  column_name text,
  referenced_table text,
  referenced_column text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.constraint_name::text,
    kcu.column_name::text,
    ccu.table_name::text AS referenced_table,
    ccu.column_name::text AS referenced_column
  FROM 
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE 
    tc.constraint_type = 'FOREIGN KEY' AND
    tc.table_schema = 'public' AND
    tc.table_name = table_name;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text)
RETURNS boolean AS $$
DECLARE
  exists_val boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND 
          table_name = table_name
  ) INTO exists_val;
  
  RETURN exists_val;
END;
$$ LANGUAGE plpgsql;

-- Function to create all schema helper functions
CREATE OR REPLACE FUNCTION create_schema_helper_functions()
RETURNS void AS $$
BEGIN
  -- This function exists just to call the other functions
  -- It's a convenience for the client
  PERFORM get_table_columns('users');
  PERFORM check_foreign_keys('users');
  PERFORM table_exists('users');
END;
$$ LANGUAGE plpgsql;