"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { cn } from "@/lib/utils";

type AuthFormMode = "login" | "register";

export default function Home() {
  const { user } = useAuthStore();
  const [authFormMode, setAuthFormMode] = useState<AuthFormMode>("login");

  return (
    <main
      className={cn(
        "min-h-[calc(100vh-80px)] w-full bg-[var(--tune-bg)]",
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16",
        "px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-16",
        "items-center justify-items-center lg:justify-items-stretch"
      )}
    >
      {/* 左區塊：品牌與說明 */}
      <section
        className={cn(
          "flex flex-col justify-center gap-6 max-w-lg w-full",
          "text-center lg:text-left"
        )}
      >
        <h1 className="text-3xl font-bold leading-tight text-[var(--tune-text)] sm:text-4xl md:text-5xl">
          Tune
        </h1>
        <p className="text-lg text-[var(--tune-muted)] leading-relaxed sm:text-xl">
          記錄你的吉他設備與音色設定，讓每次練團與演出都有據可查。
        </p>
      </section>

      {/* 右區塊：未登入顯示登入表單，已登入顯示歡迎與入口 */}
      <section
        className={cn(
          "w-full max-w-md flex flex-col justify-center",
          "bg-white border border-[var(--tune-card-border)] rounded-lg shadow-none",
          "p-6 sm:p-8 md:p-10"
        )}
      >
        {user ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold leading-[1.1] text-[var(--tune-text)] sm:text-3xl">
              歡迎回來，{user.name || user.email}
            </h2>
            <p className="text-[var(--tune-muted)] leading-relaxed">
              開始管理你的效果器、音箱與吉他吧。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/effects"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--tune-primary)] px-6 text-base font-medium text-white hover:bg-[#0043ce] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2"
              >
                新增效果器
              </Link>
              <Link
                href="/amps"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[var(--tune-border)] bg-white px-6 text-base font-medium text-[var(--tune-text)] hover:bg-[var(--tune-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2"
              >
                新增音箱
              </Link>
              <Link
                href="/guitars"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[var(--tune-border)] bg-white px-6 text-base font-medium text-[var(--tune-text)] hover:bg-[var(--tune-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2"
              >
                新增吉他
              </Link>
              <Link
                href="/accessories"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[var(--tune-border)] bg-white px-6 text-base font-medium text-[var(--tune-text)] hover:bg-[var(--tune-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2"
              >
                新增其他配件
              </Link>
            </div>
          </div>
        ) : authFormMode === "login" ? (
          <LoginForm
            title="登入"
            showRegisterLink={true}
            onSwitchToRegister={() => setAuthFormMode("register")}
          />
        ) : (
          <RegisterForm
            title="註冊"
            showLoginLink={true}
            onSwitchToLogin={() => setAuthFormMode("login")}
          />
        )}
      </section>
    </main>
  );
}
