"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

const loginSchema = z.object({
  email: z.string().min(1, "請輸入電子郵件"),
  password: z.string().min(1, "請輸入密碼"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "error"; text: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    router.push("/");
    router.refresh();
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
            歡迎回來！
          </h1>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 p-0 pt-0">
          {message && (
            <p
              className={cn(
                "rounded-md px-3 py-2 text-sm",
                message.type === "error" && "bg-destructive/10 text-destructive"
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
                <FieldLabel htmlFor="login-email">
                  電子郵件<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
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
                <FieldLabel htmlFor="login-password">
                  密碼<span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="請輸入密碼"
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

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox name="remember" aria-label="記住我" />
                <span className="text-sm font-normal leading-[1.4] text-[#21272a]">
                  記住我
                </span>
              </label>
              <Link
                href="#"
                className="text-sm font-normal leading-[1.4] text-[#001d6c] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f62fe] focus-visible:ring-offset-2"
              >
                忘記密碼？
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-[#0f62fe] text-base font-medium tracking-[0.5px] text-white hover:bg-[#0043ce] focus-visible:ring-[#0f62fe] disabled:opacity-50"
            >
              {isSubmitting ? "登入中…" : "登入"}
            </Button>
          </form>
        </CardContent>

        <div className="h-px w-full shrink-0 bg-[#dde1e6]" role="separator" />

        <p className="text-center text-sm font-normal leading-[1.4] text-[#001d6c]">
          <Link
            href="/register"
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f62fe] focus-visible:ring-offset-2 rounded"
          >
            註冊
          </Link>
        </p>
      </Card>
    </div>
  );
}
