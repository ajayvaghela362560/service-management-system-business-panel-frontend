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
import { forgotPassword } from "@/apollo/server";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().trim().email({ message: "Enter a valid email address" }),
});

const FORGOT_PASSWORD = gql`
  ${forgotPassword}
`;

const ForgotPasswordViewPageComponent = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [businessForgotPassword] = useMutation(FORGOT_PASSWORD, { onCompleted, onError });
    const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { email: "" } });

    function onCompleted(result) {
        setLoading(false);
        toast.success(result?.forgotPassword?.message);
        router.push("/business/sign-in");
    }

    function onError(error) {
        setLoading(false);
        toast.error(JSON.parse(JSON.stringify(error.message)) ?? "Something went wrong!");
    }

    const onSubmit = async (data) => {
        setLoading(true);
        businessForgotPassword({ variables: { ...data } });
    };

    return (<>
        <div className="relative h-screen flex-col items-center justify-center">
            <div className="flex h-full items-center p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Forgot your password
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            We will send you an email to forgot your password
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            className="w-full space-y-5"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email..."
                                                disabled={loading}
                                                {...field}
                                            />
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

export default ForgotPasswordViewPageComponent;