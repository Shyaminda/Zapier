import { z } from "zod";

export const SignupData = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
});

export const LoginData = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
});

