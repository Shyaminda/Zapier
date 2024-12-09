import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    userName: z.string().min(3),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional(),
    })),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
export type SignupSchema = z.infer<typeof SignupSchema>;
export type ZapCreateSchema = z.infer<typeof ZapCreateSchema>;
