import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    staleTime: 1000 * 60 * 5, // 5分鐘內不重打
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('brands').select('id, name')
      if (error) throw error
      return data
    },
  })
}