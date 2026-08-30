CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source_path TEXT,
  user_agent TEXT,
  client_hash TEXT,
  spam_score INTEGER NOT NULL DEFAULT 0,
  delivery_status TEXT NOT NULL DEFAULT 'stored',
  delivery_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);
CREATE INDEX contact_messages_client_hash_idx ON public.contact_messages (client_hash, created_at DESC);

GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;