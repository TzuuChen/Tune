"use client";
import { useMemo } from "react";
import { AddEffectDialog } from "./components/add";
import { EffectCard } from "./components/card";
import { useGear } from "@/api/gear";
import { Gear } from "@/api/gear/type";


export default function EffectsPage() {
  const { data: gearData } = useGear();

  const effects = useMemo(() => {
    return (gearData as unknown as Gear[] | null) ?? [];
  }, [gearData]);

  return (
    <div className="px-10">
      <div className="flex justify-end mb-4">
        <AddEffectDialog />
      </div>
      <div className="grid grid-cols-1 gap-4">{effects.map((effect) => (
        <EffectCard key={effect.id} effect={effect} />
      ))}
      </div>
      {effects.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">該買第一顆效果器了吧！</p>
        </div>
      )}
    </div>
  );
}
