"use client"

import { BACKEND_URL } from "@/app/config";
import { metadata } from "@/app/layout";
import { Appbar } from "@/components/Appbar";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@repo/ui/primary-button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState([]);
    const [availableTriggers, setAvailableTriggers] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
        .then((response) => {setAvailableTriggers(response.data.availableTriggers)});

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
        .then((response) => {setAvailableActions(response.data.availableActions)});
    }, []);
    return {availableActions, availableTriggers};
}

export default function() {
    const router = useRouter();
    const {availableActions, availableTriggers} = useAvailableActionsAndTriggers();
    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string;
        name: string
        image: string;
    }>();
    const [selectedAction, setSelectedAction] = useState<{
        index: number;
        availableActionId: string;
        availableActionName: string;
        image: string;
        metadata: any;
    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

    return (
        <div>
            <Appbar />
            <div className="flex justify-end bg-slate-200 p-4">
                <PrimaryButton onClick={async () => {
                    if (!selectedTrigger?.id) {
                        return;
                    }

                    const response = await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                        "availableTriggerId": selectedTrigger.id,
                        "triggerMetadata": {},
                        "actions": selectedAction.map(action => ({
                            "availableActionId": action.availableActionId,
                            "actionMetadata": action.metadata
                        }))
                    }, {
                        headers: {
                            Authorization : localStorage.getItem("token")
                        }
                    });
                    router.push(`/dashboard`);
                }}>Publish</PrimaryButton>
            </div>
            <div className="w-full flex min-h-screen bg-slate-200 flex-col justify-center">
                <div className="flex justify-center w-full">
                    <ZapCell name={selectedTrigger?.name ? selectedTrigger?.name : "Trigger"} index={1} image={selectedTrigger?.image} onClick={() => {
                    setSelectedModalIndex(1);
                }}/>
                </div>
                <div className="w-full pt-2 pb-2">
                    {selectedAction.map((action,index) =><div key={index} className="pt-2 flex justify-center"> 
                        <ZapCell name={action.availableActionName ? action.availableActionName : "Action"} 
                        index={action.index} image={action.image} onClick={() => {
                            setSelectedModalIndex(action.index);
                        }}/> </div>)} 
                </div>
                <div className="flex justify-center">
                    <div>
                        <PrimaryButton onClick={() => {
                            setSelectedAction(a =>[...a, {
                                index: a.length + 2,
                                availableActionId: "",
                                availableActionName: "",
                                image: "",
                                metadata: {}
                            }]);
                        }}><div className="text-2xl text-black">
                            +
                        </div></PrimaryButton>
                    </div>
                </div>
            </div>
            {selectedModalIndex && (<Modal availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions} 
                onSelect={(props: null | { name: string; id: string; image: string; metadata: any }) => {
                    if (props === null) {
                        setSelectedModalIndex(null);
                        return;
                    }
                    if (selectedModalIndex === 1) {
                        setSelectedTrigger({
                            id: props.id,
                            name: props.name,
                            image: props.image
                        });
                    } else {
                        setSelectedAction(a => {
                            let newActions = [...a];
                            newActions[selectedModalIndex - 2] = {
                                index: selectedModalIndex,
                                availableActionId: props.id,
                                availableActionName: props.name,
                                image: props.image,
                                metadata: props.metadata
                            };
                            return newActions;
                        })
                    }
                    setSelectedModalIndex(null);
                }}
                    index={selectedModalIndex}
                />
            )}
        </div>
    );
}

function Modal({index, onSelect, availableItems}: {index:number, onSelect: (props: null | { name: string; id: string; image: string; metadata: any })
    => void, availableItems: { name: string; id: string; image: string; }[]}) {
        
        const [step, setStep] = useState(0);
        const [selectedAction, setSelectedAction] = useState<{
            name: string;
            id: string;
            image: string;      //this is the state temporary data that is stored until the metadata is reached and then sent to the onSelect function
        }>();
        const isTrigger = index === 1;

    return <div id="default-modal" className="fixed top-0 right-0 left-0 z-50 
            justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <div className="text-xl">
                                Select {index === 1 ? "Trigger" : "Action"}
                            </div>
                            <button onClick={() => {
                                onSelect(null);
                            }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">
                        {step === 1 && selectedAction?.id === "email" && <EmailSelector setMetadata={(metadata) => {
                            onSelect({
                                ...selectedAction,
                                metadata
                            })
                        }} /> }

                        {step === 1 && selectedAction?.id === "send-sol" && <SolanaSelector setMetadata={(metadata) => {
                            onSelect({
                                ...selectedAction,
                                metadata
                            })
                        }} /> }

                        {step === 0 && <div>{availableItems.map(({id,name,image}) => {
                                return <div key={id} onClick={() => {
                                    if(isTrigger){
                                        onSelect({name, id, image, metadata: {}});  //reason we added metadata to trigger is explained in the video 34.2 | Zapier Finishing Frontend and Backend 1.09h
                                    } else {
                                        setStep(s => s + 1);
                                        setSelectedAction({name, id, image});   //this state temporary data is stored until the metadata is reached and then sent to the onSelect function 
                                    }                                           //watch 34.2 | Zapier Finishing Frontend and Backend 1.03h
                                }} className="flex border p-4 cursor-pointer hover:bg-slate-800">
                                    <img className="rounded-full" src={image} width={30} /> <div className="flex flex-col justify-center pl-10">{name}</div>
                                </div>
                            })}</div>}
                        </div>
                    </div>
                </div>
            </div>
}

function EmailSelector({setMetadata}: {
    setMetadata: (params: any) => void
}) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");
    return <div>
        <Input  label={"To"} type={"text"} placeholder={"To"} onChange={(e) => setEmail(e.target.value)}></Input>
        <Input label={"Body"} type={"text"} placeholder={"Body"} onChange={(e) => setBody(e.target.value)}></Input>
        <div className="p-4">
            <PrimaryButton onClick={() => {
                setMetadata({email, body});
            }}> Submit </PrimaryButton>
        </div>
    </div>
}

function SolanaSelector({setMetadata}: {
    setMetadata: (params: any) => void
}) {
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    return <div>
        <Input  label={"To"} type={"text"} placeholder={"To"} onChange={(e) => setAddress(e.target.value)}></Input>
        <Input label={"Amount"} type={"text"} placeholder={"Amount"} onChange={(e) => setAmount(e.target.value)}></Input>
        <div className="p-4">
            <PrimaryButton onClick={() => {
                setMetadata({address, amount});
            }}> Submit </PrimaryButton>
        </div>
    </div>
}



















// Current Flow Explanation:
// The user selects an action in step === 0, and the basic information (name, id, image) is saved in selectedAction in the Modal.
// If the action requires metadata (e.g., "Email" or "Send SOL"), the modal transitions to step === 1, where the metadata form is shown.
// Once the user submits the metadata in forms like EmailSelector, the onSelect callback is called with the full data (name, id, image, and metadata).
// The parent component (index.tsx) receives this data and updates the selectedAction array with all the necessary details.


// When is Metadata Required?
// Parent Component (index.tsx):
// The selectedAction state in the parent component requires metadata because it needs complete details to publish the zap (trigger + actions + metadata).
// Modal Component (Modal):
// The selectedAction in the Modal does not need metadata since it’s a temporary state used while navigating the modal steps.
