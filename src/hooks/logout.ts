import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export const useLogout = () => {
    const router = useRouter();
    const { setUser, setIsAuthenticated } = useAuthStore();

    return async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
        router.push("/");
    };
};