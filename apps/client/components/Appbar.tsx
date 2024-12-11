"use client"

import { LinkButton } from "@repo/ui/link-button";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@repo/ui/primary-button";

export const Appbar = () => {
    const router = useRouter();
    return <div className="flex border-b justify-between p-4">
        <div className="flex flex-col justify-center text-2xl font-bold">
            zapier
        </div>
        <div className="flex">
            <div className="pr-4">
                <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
            </div>
            <div className="pr-4">
                <LinkButton onClick={() => {
                    router.push("/login");
                }}>Login</LinkButton>
            </div>
            
            

        <PrimaryButton onClick={() => {
            router.push("/signup");
        }}> Sign Up
        </PrimaryButton>
        </div>
    </div>
};