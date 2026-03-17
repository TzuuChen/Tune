"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

type BrandOption = {
  id: string;
  name: string;
};

export function AddEffectDialog() {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchBrands = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("brands").select("id, name").order("name");

      if (error) {
        console.error(error);
        return;
      }

      const normalizedBrands: BrandOption[] = (data ?? []).map((brand) => ({
        id: String(brand.id),
        name: brand.name,
      }));

      setBrands(normalizedBrands);
    };

    fetchBrands();
  }, []);

  return (
    // TODO: dialog 改成 modal
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">新增效果器</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("selectedBrandId:", selectedBrandId);
          }}
        >
          <DialogHeader>
            <DialogTitle>新增效果器</DialogTitle>
            <DialogDescription>
              請填寫效果器名稱、品牌、型號、價格、描述等資訊。
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">名稱</Label>
              <Input id="name" name="name" />
            </Field>
            <Field>
              <Label htmlFor="brand">品牌</Label>
              <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="選擇品牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>品牌</SelectLabel>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="model">型號</Label>
              <Input id="model" name="model" />
            </Field>

            <Field>
              <Label htmlFor="description">描述</Label>
              <Textarea id="description" name="description" />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                取消
              </Button>
            </DialogClose>
            <Button type="submit">儲存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}