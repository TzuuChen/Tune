import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { Gear } from "./type";

export const delGear = async (id: number) => {
  const supabase = createClient();
  const { error } = await supabase.from("gear").delete().eq("id", id);
  if (error) throw error;
};

export const useGear = (page: number, pageSize: number) => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["gear", page, pageSize],
    staleTime: 1000 * 60 * 5, // 5分鐘內不重打
    enabled: !!user?.id,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error, count } = await supabase
        .from("gear")
        .select("id, menu_id, product_name, review, brands(id,name), picture", { count: "exact" })
        .eq("user_id", user?.id)
        .order("id")
        .range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { data: data as unknown as Gear[], error, count };
    },
    placeholderData: (previousData) => previousData,
  });
};
