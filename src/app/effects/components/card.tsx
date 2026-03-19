"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { EditEffectDialog } from "./edit";
import { Gear } from "@/api/gear/type";
import { Button } from "@/components/ui/button";
import { delGear } from "@/api/gear";
import { TrashIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type EffectCardProps = {
  effect: Gear;
  className?: string;
};

export function EffectCard({
  className,
  effect,
}: EffectCardProps) {
  const { product_name, review, brands, picture } = effect;
  const queryClient = useQueryClient();
  return (
    <article
      className={cn(
        "flex gap-4 rounded-lg border border-[var(--tune-card-border)] bg-white p-4 shadow-none",
        className
      )}
    >
      {/* 左側：圖片（與 Figma 版型一致） */}
      <div className="relative h-80 w-80 shrink-0 overflow-hidden rounded-lg bg-[var(--tune-bg)]">
        <EditEffectDialog className="absolute top-5 left-5 z-10" effect={effect} />
        {picture ? (
          <Image
            src={picture}
            alt=""
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--tune-muted)] text-sm">
            無圖
          </div>
        )}
        <Button variant="outline" size="icon" className="absolute top-5 right-5 bg-red-500 text-white" onClick={async () => {
          await delGear(effect.id)
          toast.success("刪除成功", {
            description: "效果器已成功刪除",
          })
          queryClient.invalidateQueries({ queryKey: ['gear'] })
        }}>
          <TrashIcon className="size-4" />
        </Button>
      </div>

      {/* 右側：第一列 品牌＋型號，第二列 描述；右上可放 action */}
      <div className="flex min-w-0 flex-1 flex-col gap-10 justify-center">
        <div className="flex items-start justify-between">
          <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr_auto_1fr] items-baseline gap-x-3 gap-y-1">
            <span className="text-xl font-medium text-[var(--tune-muted)]">品牌</span>
            <p className="text-lg font-medium text-[var(--tune-text)] truncate">{brands.name}</p>
            <span className="text-xl font-medium text-[var(--tune-muted)]">型號</span>
            <p className="text-lg font-medium text-[var(--tune-text)] truncate">{product_name}</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xl font-medium text-[var(--tune-muted)]">描述</p>
          <p className="mt-1 text-lg leading-[1.4] text-[var(--tune-text)] line-clamp-2">
            {review != null && review !== "" ? review : "—"}
          </p>
        </div>
      </div>
    </article>
  );
}
