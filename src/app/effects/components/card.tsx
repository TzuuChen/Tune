"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { EditEffectDialog } from "./edit";
import { Gear } from "../type"; 

export type EffectCardProps = {
  effect: Gear;
  imageUrl?: string | null;
  className?: string;
  fetchEffects?: () => void;
};

export function EffectCard({
  className,
  effect,
  imageUrl,
  fetchEffects,
}: EffectCardProps) {
  const { id, menu_id, product_name, review, brands } = effect;
  return (
    <article
      className={cn(
        "flex gap-4 rounded-lg border border-[var(--tune-card-border)] bg-white p-4 shadow-none",
        className
      )}
    >
      {/* 左側：圖片（與 Figma 版型一致） */}
      <div className="relative h-80 w-80 shrink-0 overflow-hidden rounded-lg bg-[var(--tune-bg)]">
        <EditEffectDialog className="absolute top-5 left-3" effect={{ id, menu_id, product_name, review, brands }} fetchEffects={fetchEffects} />
        {imageUrl ? (
          <Image
            src={imageUrl}
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
