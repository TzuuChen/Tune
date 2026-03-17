"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
    email: z.string().min(1, "請輸入電子郵件"),
    password: z.string().min(8, "密碼至少 8 個字元"),
    terms: z
        .boolean()
        .refine((v) => v === true, { message: "請同意服務條款與隱私政策" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/** 送出時只帶 name、email、password，不帶 terms */
export type RegisterPayload = Omit<RegisterFormValues, "terms">;

/** 可嵌入的註冊表單（與 LoginForm 同層級），用於首頁切換登入/註冊 */
export function RegisterForm({
    title = "註冊",
    showLoginLink = true,
    onSwitchToLogin,
    className,
}: {
    title?: string;
    showLoginLink?: boolean;
    /** 提供時點「已經有帳號了？」會呼叫此 callback 而非導向 /login */
    onSwitchToLogin?: () => void;
    className?: string;
}) {
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
                        message.type === "error" && "bg-destructive/10 text-destructive",
                        message.type === "success" && "bg-primary/10 text-primary"
                    )}
                >
                    {message.text}
                </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="register-name">
                            名稱<span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="register-name"
                            placeholder="Jordan Lee"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="register-email">
                            電子郵件<span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="register-email"
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
                        <FieldLabel htmlFor="register-password">
                            密碼<span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="register-password"
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
                            <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
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
                                <span className="text-sm font-normal leading-[1.4] text-[var(--tune-text)]">
                                    我同意服務條款與隱私政策
                                </span>
                            </label>
                        )}
                    />
                    {errors.terms && (
                        <p className="mt-1 text-xs text-destructive">{errors.terms.message}</p>
                    )}
                </Field>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full bg-[var(--tune-primary)] text-base font-medium tracking-[0.5px] text-white hover:bg-[#0043ce] focus-visible:ring-[var(--tune-primary)] disabled:opacity-50"
                >
                    {isSubmitting ? "處理中…" : "註冊"}
                </Button>
            </form>
            {showLoginLink && (
                <>
                    <div className="h-px w-full shrink-0 bg-[var(--tune-card-border)]" role="separator" />
                    <p className="text-center text-sm font-normal leading-[1.4] text-[var(--tune-primary-dark)]">
                        {onSwitchToLogin ? (
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2 rounded"
                            >
                                已經有帳號了？
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2 rounded"
                            >
                                已經有帳號了？
                            </Link>
                        )}
                    </p>
                </>
            )}
        </div>
    );
}

/** 完整註冊頁（含 Card 與版面），供 /register 使用 */
export default function RegisterPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--tune-bg)] px-4 py-8 sm:px-6 md:py-12">
            <div
                className={cn(
                    "w-full max-w-[680px] shrink-0 flex flex-col gap-6 overflow-visible",
                    "border border-[var(--tune-card-border)] bg-white rounded-lg shadow-none p-6 sm:p-10 md:p-20"
                )}
            >
                <h1 className="text-center text-3xl font-bold leading-[1.1] text-[var(--tune-text)] sm:text-[42px]">
                    註冊
                </h1>
                <RegisterForm title="" showLoginLink={true} />
            </div>
        </div>
    );
} 