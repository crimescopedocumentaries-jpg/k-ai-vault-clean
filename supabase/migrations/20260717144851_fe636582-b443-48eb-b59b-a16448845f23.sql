
CREATE TABLE public.kai_cloud_kv (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, bucket, entry_key)
);

CREATE INDEX kai_cloud_kv_user_bucket_idx
  ON public.kai_cloud_kv (user_id, bucket);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kai_cloud_kv TO authenticated;
GRANT ALL ON public.kai_cloud_kv TO service_role;

ALTER TABLE public.kai_cloud_kv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own kv rows"
  ON public.kai_cloud_kv
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.kai_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER kai_cloud_kv_touch
  BEFORE UPDATE ON public.kai_cloud_kv
  FOR EACH ROW
  EXECUTE FUNCTION public.kai_touch_updated_at();
