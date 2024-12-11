"use client"

import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@repo/ui/primary-button";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="flex pt-8 max-w-4xl">
                <div className="flex-1 pt-20 px-4">
                    <div className="font-semibold text-3xl pb-4">
                        Join millions worldwide who automate their work using zapier
                    </div>
                    <div className="pb-6 pt-4">
                        <CheckFeature label={"Connect your apps and automate tasks"} />
                    </div>
                    <div className="pb-6">
                        <CheckFeature label={"Save time and effort"} />
                    </div>
                    <div>
                        <CheckFeature label={"Automate repetitive tasks"} />
                    </div>
                </div>

                <div className="flex-1 pt-6 pb-6 mt-12 rounded px-4 border">
                    <Input label={"Username"} placeholder="Enter your username" onChange={e => {
                        setUsername(e.target.value);
                    }} type="text" />
                    <Input label={"Email"} placeholder="Enter your email" onChange={e => {
                        setEmail(e.target.value);
                    }} type="text" />
                    <Input label={"Password"} placeholder="Enter your password" onChange={e => {
                        setPassword(e.target.value);
                    }} type="text" />
                    <div className="pt-4">
                        <PrimaryButton onClick={async () => {
                            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signUp`, {
                                username,
                                email,
                                password
                            });
                            router.push("/login");
                        }} size="large">Get started free</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    
}