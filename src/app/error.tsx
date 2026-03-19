"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>正在開發中...</h1>
            <Button onClick={() => router.push("/")}>回到首頁</Button>
        </div>
    );
}