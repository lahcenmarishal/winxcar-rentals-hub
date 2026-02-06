import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  published: boolean;
  author: string;
  created_at: string;
  updated_at: string;
}

export function useBlogs(publishedOnly = false) {
  return useQuery({
    queryKey: ["blogs", publishedOnly],
    queryFn: async () => {
      let query = supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (publishedOnly) {
        query = query.eq("published", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Blog[];
    },
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data as Blog;
    },
    enabled: !!slug,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blog: Omit<Blog, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("blogs").insert(blog).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...blog }: Partial<Blog> & { id: string }) => {
      const { data, error } = await supabase.from("blogs").update(blog).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export async function uploadBlogImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
  return data.publicUrl;
}
