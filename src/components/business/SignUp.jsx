"use client";
import Link from "next/link";
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
import { GoogleLogin } from "@react-oauth/google";
import { gql, useMutation } from "@apollo/client";
import { register } from "@/apollo/server";
import { useSaveTokenStore } from "@/store/login";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be less than 50 characters" }),

    lastName: z
        .string()
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be less than 50 characters" }),

    email: z.string().trim().email({ message: "Enter a valid email address" }),

    password: z
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
});

const REGISTER = gql`
  ${register}
`;

export default function BusinessSignUpViewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [businessRegister] = useMutation(REGISTER, { onCompleted, onError });
    const form = useForm({ resolver: zodResolver(formSchema) });
    const SaveToken = useSaveTokenStore((state) => state.setToken);

    function onCompleted({ registerUser }) {
        setLoading(false);
        SaveToken(registerUser?.token);
        toast.success("Signed Up Successfully!");
        router.push("/business/dashboard/overview");
    }

    function onError(parameters) {
        // console.log("###_error ", JSON.parse(JSON.stringify(parameters.message)));
        setLoading(false);
        toast.error(JSON.parse(JSON.stringify(parameters.message)) ?? "Something went wrong!");
    }

    const onSubmit = async (data) => {
        setLoading(true);
        // console.log("###_data_### ", data);
        businessRegister({ variables: { ...data, loginType: "EmailAndPassword", userRole: "Business" } });
    };

    return (
        <div className="relative h-screen flex-col items-center justify-center">
            <div className="flex h-full items-center p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an business account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            className="w-full space-y-2"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your firstName..."
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your lastName..."
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password..."
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
                                Continue to Signup
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            console.log(credentialResponse);
                        }}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />

                    <p className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Link className="text-black font-medium" href={"/business/sign-in"}>
                            SignIn
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
