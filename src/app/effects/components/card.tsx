"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { EditEffectDialog } from "./edit";
import { Gear } from "@/api/gear/type";
import { Button } from "@/components/ui/button";
import { delGear } from "@/api/gear";
import { TrashIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-is-mobile";

export type EffectCardProps = {
  effect: Gear;
  className?: string;
  onDeleteSuccess: () => void;
};

export function EffectCard({
  className,
  effect,
  onDeleteSuccess
}: EffectCardProps) {
  const { product_name, review, brands, picture } = effect;
  const queryClient = useQueryClient();
  const [openDetail, setOpenDetail] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <article
        className={cn(
          "flex cursor-pointer flex-col gap-4 rounded-lg border border-[var(--tune-card-border)] bg-white p-4 shadow-none md:flex-row",
          className
        )}
        onClick={() => setOpenDetail(true)}
      >
        {/* 左側：圖片（與 Figma 版型一致） */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--tune-bg)] md:h-80 md:w-80">
          <div
            className="absolute top-5 left-5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <EditEffectDialog effect={effect} />
          </div>
          {picture ? (
            <Image
              src={picture}
              alt=""
              fill
              className="object-cover"
              sizes="120px"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--tune-muted)] text-sm">
              無圖
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-5 right-5 bg-red-500 text-white"
            onClick={async (e) => {
              e.stopPropagation();
              await delGear(effect.id);
              toast.success("刪除成功", {
                description: "效果器已成功刪除",
              });
              queryClient.invalidateQueries({ queryKey: ["gear"] });
              onDeleteSuccess();
            }}
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>

        {/* 右側：第一列 品牌＋型號，第二列 描述；右上可放 action */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 justify-center md:gap-10">
          <div className="flex items-start justify-between">
            <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1 md:grid-cols-[auto_1fr_auto_1fr]">
              <span className="text-xl font-medium text-[var(--tune-muted)]">品牌</span>
              <p className="text-lg font-medium text-[var(--tune-text)] truncate">{brands.name}</p>
              <span className="text-xl font-medium text-[var(--tune-muted)]">型號</span>
              <p className="text-lg font-medium text-[var(--tune-text)] truncate">{product_name}</p>
            </div>
          </div>
          <div className="hidden min-w-0 md:block">
            <p className="text-xl font-medium text-[var(--tune-muted)]">描述</p>
            <p className="mt-1 text-lg leading-[1.4] text-[var(--tune-text)] line-clamp-2">
              {review != null && review !== "" ? review : "—"}
            </p>
          </div>
        </div>
      </article>

      <Dialog open={openDetail && isMobile} onOpenChange={setOpenDetail}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{`${brands.name} ${product_name}`}</DialogTitle>
            <DialogDescription>完整效果器資訊</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-base">
            <p>
              <span className="text-[var(--tune-muted)]">品牌：</span>
              <span className="text-[var(--tune-text)]">{brands.name}</span>
            </p>
            <p>
              <span className="text-[var(--tune-muted)]">型號：</span>
              <span className="text-[var(--tune-text)]">{product_name}</span>
            </p>
            <p className="whitespace-pre-wrap break-words text-[var(--tune-text)]">
              <span className="text-[var(--tune-muted)]">描述：</span>
              {review != null && review !== "" ? review : "—"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
