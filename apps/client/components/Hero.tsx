"use client"

import { PrimaryButton } from "@repo/ui/primary-button";
import { SecondaryButton } from "@repo/ui/secondary-button";
import { Features } from "./Features";
import { useRouter } from "next/navigation";

export const Hero = () => {
    const router = useRouter();
    return <div>
        <div className="flex justify-center">
            <div className="text-2xl font-semibold text-center pt-8 max-w-xl">
                Automate as fast as you type
            </div>
        </div>

        <div className="flex justify-center pt-2">
            <div className="text-xl font-normal text-center pt-8 max-w-2xl">
            Turn chaos into smooth operations by automating workflows yourself—no developers, 
            no IT tickets, no delays. The only limit is your imagination.
            </div>
        </div>

        <div className="flex justify-center py-4">
            <div className="flex">
                <PrimaryButton onClick={() => {
                    router.push("/signup")
                }} size="large">Get started free</PrimaryButton>
                <div className="pl-4">
                    <SecondaryButton onClick={() => {}} size="large">Contact Sales</SecondaryButton>
                </div>
            </div>
        </div>

        <div className="flex justify-center pt-4">
            <Features title="Free Forever" subtitle="for core features" />
            <Features title="More apps" subtitle="than any other platform" />
            <Features title="Cutting Edge" subtitle="Ai features" />
        </div>

    </div>
};