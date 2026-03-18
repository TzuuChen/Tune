"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth";
import { Brand } from "@/type/brand";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gear } from "../type";

const editEffectSchema = z.object({
  brandId: z.string().min(1, "品牌不能為空"),
  product_name: z.string().min(1, "型號不能為空"),
  review: z.string().optional(),
});

export function EditEffectDialog({ className, effect, fetchEffects }: { className?: string, effect: Gear, fetchEffects?: () => void }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { handleSubmit, formState: { errors, isSubmitting }, register, reset, control } = useForm<z.infer<typeof editEffectSchema>>({
    resolver: zodResolver(editEffectSchema),
    defaultValues: {
      brandId: String(effect.brands.id),
      product_name: effect.product_name,
      review: effect.review ?? "",
    },
  });

  // 每次打開 dialog 或 effect 更新時，表單同步為最新資料
  useEffect(() => {
    if (open) {
      reset({
        brandId: String(effect.brands.id),
        product_name: effect.product_name,
        review: effect.review ?? "",
      });
    }
  }, [open, effect, reset]);

  const onSubmit = async (data: z.infer<typeof editEffectSchema>) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('gear')
      .update(
        { user_id: user?.id, menu_id: 1, brand_id: Number(data.brandId), product_name: data.product_name, review: data.review },
      )
      .eq("id", effect.id)
      .select()
    if (error) {
      console.error(error);
      return;
    }
    reset();
    setOpen(false);
    fetchEffects?.();
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("brands").select("id, name").order("name");

      if (error) {
        console.error(error);
        return;
      }

      const normalizedBrands: Brand[] = (data ?? []).map((brand) => ({
        id: brand.id,
        name: brand.name,
      }));

      setBrands(normalizedBrands);
    };

    fetchBrands();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <Button variant="outline">編輯效果器</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>新增效果器</DialogTitle>
            <DialogDescription className="text-sm">
              請填寫效果器品牌、型號、描述等資訊。
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4">
            <Field>
              <Label htmlFor="brand">品牌<span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={field.onChange}>
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="選擇品牌" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>品牌</SelectLabel>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={String(brand.id)}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.brandId && <p className="text-xs text-destructive">{errors.brandId.message}</p>}
            </Field>

            <Field>
              <Label htmlFor="product_name">型號<span className="text-destructive">*</span></Label>
              <Input id="product_name" {...register("product_name")} />
              {errors.product_name && <p className="text-xs text-destructive">{errors.product_name.message}</p>}
            </Field>

            <Field>
              <Label htmlFor="review">描述</Label>
              <Textarea id="review" {...register("review")} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => {
                reset();
              }}>
                取消
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "儲存中..." : "儲存"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}