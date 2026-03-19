import { createClient } from "@/lib/supabase/client";

export const uploadImg = async (file: File) => {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('gear').upload(fileName, file);
    if (error) throw error;
    return data.path;
}

export const getImgUrl = (path: string) => {
    const supabase = createClient();
    const { data } = supabase.storage.from('gear').getPublicUrl(path);
    return data.publicUrl;
}