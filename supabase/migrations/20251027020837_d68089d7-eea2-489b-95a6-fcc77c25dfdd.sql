-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily credit reset at midnight UTC (12:00 AM UTC)
SELECT cron.schedule(
  'reset-user-credits-daily',
  '0 0 * * *', -- Every day at 00:00 UTC
  $$
  SELECT reset_daily_credits();
  $$
);

-- Enable realtime for user_credits table
ALTER TABLE user_credits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE user_credits;