"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(1, "請輸入名稱"),
  email: z
    .string()
    .min(1, "請輸入電子郵件"),
  password: z.string().min(8, "密碼至少 8 個字元"),
  terms: z
    .boolean()
    .refine((v) => v === true, { message: "請同意服務條款與隱私政策" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/** 送出時只帶 name、email、password，不帶 terms */
export type RegisterPayload = Omit<RegisterFormValues, "terms">;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setMessage(null);
    const { terms: _terms, name, email, password } = data;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { user_name: name },
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({
      type: "success",
      text: "註冊成功！",
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f2f4f8] px-4 py-8 sm:px-6 md:py-12">
      <Card
        className={cn(
          "w-full max-w-[680px] shrink-0 flex flex-col gap-6 overflow-visible",
          "border-[#dde1e6] bg-white p-6 shadow-none sm:p-10 md:p-20"
        )}
      >
        <CardHeader className="flex flex-col gap-2 pb-6 p-0 sm:pb-6">
          <h1 className="text-center text-3xl font-bold leading-[1.1] text-[#21272a] sm:text-[42px]">
            註冊
          </h1>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 p-0 pt-0">
          {message && (
            <p
              className={cn(
                "rounded-md px-3 py-2 text-sm",
                message.type === "error" && "bg-destructive/10 text-destructive",
                message.type === "success" && "bg-primary/10 text-primary"
              )}
            >
              {message.text}
            </p>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fieldgroup-name">
                  名稱<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="fieldgroup-name"
                  placeholder="Jordan Lee"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="fieldgroup-email">
                  電子郵件<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="fieldgroup-email"
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="inline-end-input">
                  密碼<span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="inline-end-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="至少 8 個字元"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <Field>
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start gap-2">
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      onBlur={field.onBlur}
                      aria-label="同意服務條款"
                      aria-invalid={!!errors.terms}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-sm font-normal leading-[1.4] text-[#21272a]">
                      我同意服務條款與隱私政策
                    </span>
                  </label>
                )}
              />
              {errors.terms && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.terms.message}
                </p>
              )}
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-[#0f62fe] text-base font-medium tracking-[0.5px] text-white hover:bg-[#0043ce] focus-visible:ring-[#0f62fe] disabled:opacity-50"
            >
              {isSubmitting ? "處理中…" : "註冊"}
            </Button>
          </form>
        </CardContent>

        <div className="h-px w-full shrink-0 bg-[#dde1e6]" role="separator" />

        <p className="text-center text-sm font-normal leading-[1.4] text-[#001d6c]">
          <Link
            href="/login"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f62fe] focus-visible:ring-offset-2 rounded"
          >
            已經有帳號了？
          </Link>
        </p>
      </Card>
    </div>
  );
}
