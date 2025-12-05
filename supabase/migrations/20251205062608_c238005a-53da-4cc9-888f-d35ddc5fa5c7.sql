-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('voitures-images', 'voitures-images', true);

-- Allow anyone to view images
CREATE POLICY "Public can view car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'voitures-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'voitures-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update images
CREATE POLICY "Admins can update car images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'voitures-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete images
CREATE POLICY "Admins can delete car images"
ON storage.objects FOR DELETE
USING (bucket_id = 'voitures-images' AND has_role(auth.uid(), 'admin'));