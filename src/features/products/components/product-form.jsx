"use client";

import { AddService, EditService } from "@/apollo/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  price: z.string().trim().min(1, {
    message: "Price is requred.",
  }),
  duration: z.string().refine(
    (value) => {
      const duration = Number(value);
      return duration >= 15 && duration <= 30;
    },
    {
      message: "Duration must be between 15 and 30 minutes.",
    }
  ),
});

const ADD_SERVICE = gql`
  ${AddService}
`;

const Edit_SERVICE = gql`
  ${EditService}
`;

export default function ProductForm({ initialData, pageTitle }) {

  const serviceId = initialData?.id;
  const defaultValues = {
    name: initialData?.name || "",
    price: initialData?.price || "",
    duration: initialData?.duration || "",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const [SERVICES] = useMutation(serviceId ? Edit_SERVICE : ADD_SERVICE, { onCompleted, onError });

  function onCompleted(data) {
    // console.log("###_data_### ", data.EditService);
    if (serviceId) {
      toast.success(data?.EditService?.message);
    } else {
      toast.success(data?.AddService?.message);
    }
    redirect("/business/dashboard/services");
  }

  function onError(parameters) {
    // console.log("###_error ", JSON.parse(JSON.stringify(parameters.message)));
    const error = (JSON.parse(JSON.stringify(parameters.message)) ?? "Something went wrong!");
    toast.error(error);
  }

  function onSubmit(values) {
    let variables = values;
    if (serviceId) {
      variables = { ...variables, id: serviceId };
    }
    SERVICES({ variables });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter service duration"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{serviceId ? "Edit" : "Add"} Service</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
