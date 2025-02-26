"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { resetPassword } from "@/apollo/server";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    newPassword: z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be less than 100 characters" })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, {
            message: "Password must contain at least one special character",
        }),
    confirmNewPassword: z.string().trim(),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords must match",
        path: ["confirmNewPassword"],
    });

const RESET_PASSWORD = gql`
  ${resetPassword}
`;

const ResetPasswordViewPageComponent = ({ token }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [businessResetPassword] = useMutation(RESET_PASSWORD, { onCompleted, onError });
    const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { newPassword: "", confirmNewPassword: "" } });

    function onCompleted(result) {
        setLoading(false);
        toast.success(result?.resetPassword?.message);
        router.push("/business/sign-in");
    }

    function onError(error) {
        setLoading(false);
        toast.error(JSON.parse(JSON.stringify(error.message)) ?? "Something went wrong!");
    }

    const onSubmit = async (data) => {
        setLoading(true);
        businessResetPassword({ variables: { token, password: data?.newPassword } });
    };

    return (<>
        <div className="relative h-screen flex-col items-center justify-center">
            <div className="flex h-full items-center p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create new password
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Please set a new password
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            className="w-full space-y-5"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter new password..." disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm new password..." disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={loading}
                                className="ml-auto w-full"
                                type="submit"
                            >
                                Continue
                            </Button>
                        </form>
                    </Form>

                </div>
            </div>
        </div>
    </>);
}

export default ResetPasswordViewPageComponent;