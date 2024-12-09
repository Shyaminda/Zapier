import { z } from "zod";

export const SignupSchema = z.object({
    id: z.number(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    userName: z.string().min(3, "Username must be at least 3 characters long"),
});

export const LoginSchema = z.object({
    id: z.number(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    userName: z.string().min(3, "Username must be at least 3 characters long"),
});

export interface User {
    id: number;
    email: string;
    userName: string;
    password: string;
}

export type LoginData = z.infer<typeof LoginSchema>;
export type SignupData = z.infer<typeof SignupSchema>;
