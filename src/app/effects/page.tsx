"use client";
import { useMemo, useState } from "react";
import { AddEffectDialog } from "./components/add";
import { EffectCard } from "./components/card";
import { useGear } from "@/api/gear";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

export default function EffectsPage() {
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const { data: gearData } = useGear(page, pageSize);

  const effects = useMemo(() => {
    return gearData?.data ?? [];
  }, [gearData]);

  const totalPages = useMemo(() => {
    return Math.ceil((gearData?.count ?? 0) / pageSize);
  }, [gearData?.count]);

  return (
    <div className="px-10">
      <div className="flex justify-end mb-4">
        <AddEffectDialog />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {effects.map((effect) => (
          <EffectCard
            key={effect.id}
            effect={effect}
            onDeleteSuccess={() => {
              if (effects.length === 1 && page > 1) {
                setPage(page - 1);
              }
            }}
          />
        ))}
      </div>
      {effects.length === 0 && page === 1 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">該買第一顆效果器了吧！</p>
        </div>
      )}
      <div className="flex justify-center items-center gap-2 mt-4 mb-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(page - 1)} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => setPage(p)} isActive={page === p}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
