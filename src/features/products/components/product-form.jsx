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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { GET_ALL_SERVICES } from "./product-listing";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  price: z.string().trim().min(1, {
    message: "Price is requred.",
  }),
  hours: z.string().trim(),
  minutes: z.string().trim(),
}).refine(
  (data) => parseInt(data.hours) >= 1 || parseInt(data.minutes) >= 15,
  {
    message: "Duration must be at least 15 minutes",
    path: ["minutes"],
  }
);

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
    hours: initialData?.duration?.split(":")?.[0] || "00",
    minutes: initialData?.duration?.split(":")?.[1] || "00",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const [SERVICES] = useMutation(serviceId ? Edit_SERVICE : ADD_SERVICE, {
    onCompleted,
    onError,
    refetchQueries: [
      {
        query: GET_ALL_SERVICES,
        variables: { page: 1, limit: 10, search: "" },
        awaitRefetchQueries: true,
      },
    ],
  });

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
    const { hours, minutes, ...rest } = values;
    const duration = `${hours?.padStart(2, "0")}:${minutes}`;

    let variables = { ...rest, duration };

    if (serviceId) {
      variables = { ...variables, id: serviceId };
    }

    SERVICES({ variables });
  }

  const hours = Array.from({ length: 12 }, (_, i) => (i.toString().padStart(2, "0")).toString());
  const minutes = ["00", "15", "30", "45"];

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

            <div className="mb-2 space-y-2 lg:mb-0">
              <label className="text-sm font-medium leading-none">Duration</label>
              <div className="flex items-center gap-2">
                {/* Hour Picker */}
                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`${field.value} Hour`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour}>{`${hour} Hour`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>{form.formState.errors.minutes?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Minute Picker */}
                <FormField
                  control={form.control}
                  name="minutes"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`${field.value} Minute`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute}>{`${minute} Minute`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="opacity-0">{form.formState.errors.minutes?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit">{serviceId ? "Edit" : "Add"} Service</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
