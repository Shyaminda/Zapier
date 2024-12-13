"use client"

import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@repo/ui/dark-button";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@repo/ui/link-button";
import { useRouter } from "next/navigation";

// interface Zap {
//     "id": string,
//     "triggerId": string,
//     "userId": number,
//     "actions": {
//         "id": string,
//         "actionId": string,
//         "zapId": string,
//         "sortingOrder": number,
//         "type":{
//             "id": string,
//             "name": string,
//         }
//     }[],
//     "trigger": {
//         "id": string,
//         "zapId": string,
//         "triggerId": string,
//         "type": {
//             "id": string,
//             "name": string
//         }
//     },
// }

// interface Zap {
//     id: string;
//     triggerId: string | null;
//     userId: number;
//     actionId: string | null;
//     trigger: {
//         id: string;
//         zapId: string;
//         triggerId: string;
//         type: {
//             id: string;
//             name: string;
//         };
//     };
//     actions: {
//         id: string;
//         zapId: string;
//         actionId: string;
//         sortingOrder: number;
//         type: {
//             id: string;
//             name: string;
//         };
//     }[];
// }

interface Zap {
    id: string;
    triggerId: string | null;
    userId: number;
    actionId: string | null;
    trigger: {
        id: string;
        zapId: string;
        triggerId: string;
        type: {
            id: string;
            name: string;
            image: string;
        };
    };
    actions: {
        id: string;
        zapId: string;
        actionId: string;
        sortingOrder: number;
        type: {
            id: string;
            name: string;
            image: string;
        };
    }[];
}


function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    // useEffect(() => {
    //     axios.get(`${BACKEND_URL}/api/v1/zap`, {
    //         headers: {
    //             "Authorization": localStorage.getItem("token")
    //         }
    //     })
    //         .then(res => {
    //             console.log("API Response:", res.data)
    //             setZaps(Array.isArray(res.data) ? res.data : []); 
    //             setLoading(false);
    //         })
    // }, []);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`${BACKEND_URL}/api/v1/zap`, {
                    headers: { Authorization: token },
                })
                .then((res) => {
                    if (res.data && res.data.zaps) {
                        setZaps(res.data.zaps);
                    } else {
                        console.error("Unexpected API response format:", res.data);
                        setZaps([]);
                    }
                })
                .catch((err) => console.log("Error fetching Zaps:", err))
                .finally(() => setLoading(false));
        }
    }, []);
    return{
        loading,
        zaps
    }
}

export default function() {
    const {loading, zaps} = useZaps();
    const router = useRouter();

    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg w-full">
                <div className="flex justify-between pr-8">
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zap/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading...":<div className="flex justify-center"> <ZapTable zaps={zaps} /></div>}
    </div>
}

function ZapTable({zaps}: {zaps: Zap[]}) {
    const router = useRouter();
    return <div className="p-8 max-w-screen-2xl w-full">
            <div className="flex">
                <div className="flex-1">Name</div>
                <div className="flex-1">Id</div>
                <div className="flex-1">Created at</div>
                <div className="flex-1">Webhook URL</div>
                <div className="flex-1">Go</div>
            </div>
            {zaps.map(z => (
                <div className="flex border-b border-t py-4" key={z.id}>
                    {/* <div className="flex-1">{z.trigger.type.name} {z.actions.map(x => x.type.name + " ")}</div> */}
                    <div className="flex-1 flex"><img className="w-[40px] h-[30px] pr-2" src={z.trigger.type.image}  />
                        {z.actions.map((x, i) => (
                            <img key={i} src={x.type.image} className="w-[40px] h-[30px] pr-1" alt={`Action Image ${i + 1}`} />
                        ))}
                    </div>
                    <div className="flex-1">{z.id}</div>
                    <div className="flex-1">December</div>
                    <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>  {/* this is the link we will be adding to the github */}
                    <div className="flex-1"><LinkButton onClick={() => {
                        router.push("/zap/" + z.id);
                    }}>Go</LinkButton></div>
                </div>
            ))}
        </div>
    
}