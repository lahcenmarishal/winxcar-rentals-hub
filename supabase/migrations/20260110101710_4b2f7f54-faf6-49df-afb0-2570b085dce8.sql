-- Create table for category images
CREATE TABLE public.category_images (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;

-- Create policies for category images
CREATE POLICY "Category images are viewable by everyone" 
ON public.category_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert category images" 
ON public.category_images 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update category images" 
ON public.category_images 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete category images" 
ON public.category_images 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_category_images_updated_at
BEFORE UPDATE ON public.category_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true);

-- Create storage policies for category images
CREATE POLICY "Category images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'category-images');

CREATE POLICY "Admins can upload category images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'category-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update category images in storage" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'category-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete category images from storage" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'category-images' AND has_role(auth.uid(), 'admin'::app_role));