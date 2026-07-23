-- Allow public reads, uploads, and deletes on the wedding-images bucket
-- This is required because the admin panel is unauthenticated and uploads
-- photos/KHQR images directly from the browser to Supabase Storage.

CREATE POLICY "Public read access on wedding-images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'wedding-images');

CREATE POLICY "Public upload access on wedding-images"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'wedding-images');

CREATE POLICY "Public delete access on wedding-images"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'wedding-images');
