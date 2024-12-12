"use client"

import { Appbar } from "@/components/Appbar";
import { ZapCell } from "@/components/ZapCell";
import { LinkButton } from "@repo/ui/link-button";
import { PrimaryButton } from "@repo/ui/primary-button";
import { useState } from "react";

export default function() {
    const [selectedTrigger, setSelectedTrigger] = useState("");
    const [selectedAction, setSelectedAction] = useState<{
        availableActionId: string;
        availableActionName: string;
    }[]>([]);

    return (
        <div>
            <Appbar />
            <div className="w-full flex min-h-screen bg-slate-200 flex-col justify-center">
                <div className="flex justify-center w-full">
                    <ZapCell name={selectedTrigger ? selectedTrigger : "Trigger"} index={1} />
                </div>
                <div className="w-full pt-2 pb-2">
                    {selectedAction.map((action,index) =><div className="pt-2 flex justify-center"> 
                        <ZapCell name={action.availableActionName ? action.availableActionName : "Action"} 
                        index={2 + index} /> </div>)} 
                </div>
                <div className="flex justify-center">
                    <div>
                        <PrimaryButton onClick={() => {
                            setSelectedAction(a =>[...a, {
                                availableActionId: "",
                                availableActionName: ""
                            }]);
                        }}><div className="text-2xl max-w-2 text-black">
                            +
                        </div></PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}