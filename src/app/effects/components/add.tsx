"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth";
import { Brand } from "@/api/brands/type";

import { useBrands } from "@/api/brands";
import { useQueryClient } from "@tanstack/react-query";
import { uploadImg } from "@/api/uploadImg";
import { getImgUrl } from "@/api/uploadImg";

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
import { toast } from "sonner";

const addEffectSchema = z.object({
  brandId: z.string().min(1, "品牌不能為空"),
  product_name: z.string().min(1, "型號不能為空"),
  review: z.string().optional(),
  // 不用 FileList：SSR 時不存在，會報 FileList is not defined
  picture: z.any().optional().nullable(),
});

export function AddEffectDialog({ className, fetchEffects }: { className?: string, fetchEffects?: () => void }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { handleSubmit, formState: { errors, isSubmitting }, register, reset, control } = useForm<z.infer<typeof addEffectSchema>>({
    resolver: zodResolver(addEffectSchema),
    defaultValues: {
      brandId: "",
      product_name: "",
      review: "",
      picture: null,
    },
  });
  const { data: brandsData } = useBrands();
  const queryClient = useQueryClient();
  const onSubmit = async (data: z.infer<typeof addEffectSchema>) => {
    let pictureUrl: string | null = null;
    try {
      const file = data.picture?.length ? data.picture[0] : data.picture;
      if (file instanceof File) {
        const path = await uploadImg(file);
        pictureUrl = getImgUrl(path);
      }
    } catch (e) {
      toast.error("圖片上傳失敗", { description: e instanceof Error ? e.message : "請稍後再試" });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("gear")
      .insert([
        {
          user_id: user?.id,
          menu_id: 1,
          brand_id: Number(data.brandId),
          product_name: data.product_name,
          review: data.review ?? null,
          picture: pictureUrl,
        },
      ])
      .select();
    if (error) {
      toast.error("新增失敗", { description: error.message });
      return;
    }
    reset();
    setOpen(false);
    toast.success("新增成功", { description: "效果器已成功新增" });
    queryClient.invalidateQueries({ queryKey: ["gear"] });
  };

  useEffect(() => {
    setBrands(brandsData ?? []);
  }, [brandsData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <Button variant="outline">新增效果器</Button>
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
              <Label htmlFor="picture">圖片</Label>
              <Input id="picture" type="file" {...register("picture")}/>
            </Field>
            <Field>
              <Label htmlFor="brand">品牌<span className="text-destructive">*</span></Label>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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