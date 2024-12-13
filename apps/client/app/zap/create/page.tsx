"use client"

import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@repo/ui/primary-button";
import axios from "axios";
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
    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

    return (
        <div>
            <Appbar />
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
                                image: ""
                            }]);
                        }}><div className="text-2xl text-black">
                            +
                        </div></PrimaryButton>
                    </div>
                </div>
            </div>
            {selectedModalIndex && (<Modal availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions} 
                onSelect={(props: null | { name: string; id: string; image: string }) => {
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
                                image: props.image
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

function Modal({index, onSelect, availableItems}: {index:number, onSelect: (props: null | { name: string; id: string; image: string })
    => void, availableItems: { name: string; id: string; image: string; }[]}) {
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
                            {availableItems.map(({id,name,image}) => {
                                return <div key={id} onClick={() => {
                                    onSelect({name, id, image});
                                }} className="flex border p-4 cursor-pointer hover:bg-slate-800">
                                    <img className="rounded-full" src={image} width={30} /> <div className="flex flex-col justify-center pl-10">{name}</div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
}