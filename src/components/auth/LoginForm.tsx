"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
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

export function LoginForm({
  title = "歡迎回來！",
  showRegisterLink = true,
  onSwitchToRegister,
  className,
}: {
  title?: string;
  showRegisterLink?: boolean;
  /** 提供時點「註冊」會呼叫此 callback 而非導向 /register */
  onSwitchToRegister?: () => void;
  className?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "error"; text: string } | null>(null);
  const router = useRouter();
  const { setUser } = useAuthStore();

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
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user) {
      const u = userData.user;
      setUser({
        id: u.id,
        email: u.email ?? "",
        name: (u.user_metadata?.user_name ?? u.user_metadata?.name) ?? "",
        created_at: u.created_at ?? "",
        updated_at: u.updated_at ?? "",
      });
    }

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    router.refresh();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {title && (
        <h2 className="text-2xl font-bold leading-[1.1] text-[var(--tune-text)] sm:text-3xl">
          {title}
        </h2>
      )}
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">
              電子郵件<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
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
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox name="remember" aria-label="記住我" />
            <span className="text-sm font-normal leading-[1.4] text-[var(--tune-text)]">
              記住我
            </span>
          </label>
          <Link
            href="#"
            className="text-sm font-normal leading-[1.4] text-[var(--tune-primary-dark)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2"
          >
            忘記密碼？
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full bg-[var(--tune-primary)] text-base font-medium tracking-[0.5px] text-white hover:bg-[#0043ce] focus-visible:ring-[var(--tune-primary)] disabled:opacity-50"
        >
          {isSubmitting ? "登入中…" : "登入"}
        </Button>
      </form>
      {showRegisterLink && (
        <>
          <div className="h-px w-full shrink-0 bg-[var(--tune-card-border)]" role="separator" />
          <p className="text-center text-sm font-normal leading-[1.4] text-[var(--tune-primary-dark)]">
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2 rounded"
              >
                註冊
              </button>
            ) : (
              <Link
                href="/register"
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2 rounded"
              >
                註冊
              </Link>
            )}
          </p>
        </>
      )}
    </div>
  );
}
