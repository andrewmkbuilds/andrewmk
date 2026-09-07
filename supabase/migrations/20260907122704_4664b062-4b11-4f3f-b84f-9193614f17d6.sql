CREATE POLICY "Admins can read media files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));