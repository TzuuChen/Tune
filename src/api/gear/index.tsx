import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";

export const delGear = async (id: number) => {
    const supabase = createClient()
    const { error } = await supabase.from('gear').delete().eq('id', id)
    if (error) throw error
}

export const useGear = () => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['gear'],
        staleTime: 1000 * 60 * 5, // 5分鐘內不重打
        enabled: !!user?.id,
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase.from('gear').select('id, menu_id, product_name, review, brands(id,name), picture').eq('user_id', user?.id).order('id')
            if (error) throw error
            return data
        },
    })
}