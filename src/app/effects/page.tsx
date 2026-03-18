"use client";
import { useEffect, useState, useCallback } from "react";
import { AddEffectDialog } from "./components/add";
import { EffectCard } from "./components/card";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { Gear } from "./type";


export default function EffectsPage() {
  const [effects, setEffects] = useState<Gear[]>([]);
  const { user } = useAuthStore();



  const fetchEffects = useCallback(async () => {
    if (!user) {
      setEffects([]);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gear")
      .select("id, menu_id, product_name, review, brands(id,name)")
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setEffects((data ?? []) as unknown as Gear[]);
  }, [user?.id]);


  useEffect(() => {
    fetchEffects();
  }, [user?.id]);

  return (
    <div className="px-10">
      <div className="flex justify-end mb-4">
        <AddEffectDialog fetchEffects={fetchEffects} />
      </div>
      <div className="grid grid-cols-1 gap-4">{effects.map((effect) => (
        <EffectCard key={effect.id} effect={effect} fetchEffects={fetchEffects} />
      ))}</div>
    </div>
  );
}
