# Supabase Edge Function: test-connection

This edge function is used to test the connection to Supabase services. It verifies:

1. Database connectivity
2. Auth system connectivity
3. Environment variable configuration

## Deployment

To deploy this function, make sure you have the Supabase CLI installed and run:

```bash
supabase functions deploy test-connection --project-ref YOUR_PROJECT_REF
```

## Troubleshooting

If the function is not working, check the following:

1. Make sure the function is deployed to your Supabase project
2. Verify that the CORS headers are correctly configured
3. Check that the environment variables are set correctly
4. Ensure your Supabase URL and API keys are correct

## CORS Configuration

This function includes CORS headers to allow requests from any origin. If you're experiencing CORS issues, make sure the headers are being properly applied:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

## Environment Variables

The function requires the following environment variables:

- `SUPABASE_URL`: The URL of your Supabase project
- `SUPABASE_SERVICE_ROLE_KEY`: The service role key for your Supabase project

You can set these variables using the Supabase CLI:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key --project-ref YOUR_PROJECT_REF
```

Note that `SUPABASE_URL` is automatically available in the edge function environment.
