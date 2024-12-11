"use client";

import { ReactNode } from "react";

export const LinkButton = ({ children, onClick }: {children: ReactNode, onClick: () => void}) => {
    return <div className="px-2 py-4 pointer" onClick={onClick}>
        {children}
    </div>
};

