"use client";

import { addEmployee, EditService, fetchServicesWithoutPagination } from "@/apollo/server";
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
import { gql, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { MultiSelect } from "react-multi-select-component";
import { Checkbox } from "@/components/ui/checkbox";
import ConfigurableValues from "@/config/constants";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// Define validation schema using Zod
const employeeSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  profileUrl: z.string().url("Invalid URL"),
  services: z.array(z.string().min(1, "Service is required.")),
  weeklyAvailability: z.array(z.string().min(1, "At least one day required.")),
});

const ADD_EMPLOYEES = gql`
  ${addEmployee}
`;

const Edit_EMPLOYEES = gql`
  ${EditService}
`;

// GraphQL Queries
const GET_SERVICES = gql`
  ${fetchServicesWithoutPagination}
`;

// Weekly Availability Options (Checkbox List)
const weekDays = [
  { label: "Sunday", value: "Sun" },
  { label: "Monday", value: "Mon" },
  { label: "Tuesday", value: "Tue" },
  { label: "Wednesday", value: "Wed" },
  { label: "Thursday", value: "Thu" },
  { label: "Friday", value: "Fri" },
  { label: "Saturday", value: "Sat" },
];

// FileUploader Component using react-dropzone
const FileUploader = ({ onUpload, url }) => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(url ?? "");
  const { SERVER_URL } = ConfigurableValues();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("files", file);

      try {
        setUploading(true);
        const response = await axios.post(`${SERVER_URL}file-upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedUrl = response.data?.files?.[0]?.url;
        setFileUrl(uploadedUrl);
        onUpload(uploadedUrl); // Pass URL to parent component
        toast.success("File uploaded successfully!");
      } catch (error) {
        toast.error(error.message ?? "File upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div {...getRootProps()} className="border p-4 rounded-lg cursor-pointer">
      <input {...getInputProps()} />
      <p className="text-center text-sm">{uploading ? "Uploading..." : "Drag & drop an image or click to upload"}</p>
      {fileUrl && <img src={fileUrl} alt="Uploaded Preview" className="mt-2 w-32 h-32 object-cover" />}
    </div>
  );
};

export default function EmployeesForm({ initialData, pageTitle }) {
  const employeeId = initialData?.id;
  const defaultValues = {
    email: initialData?.email || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    profileUrl: initialData?.profileUrl ?? "",
    services: initialData?.services || [],
    weeklyAvailability: initialData?.weeklyAvailability || [],
  };

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    values: defaultValues,
  });

  // Fetch services from the backend
  const { data: servicesData, loading: servicesLoading } = useQuery(GET_SERVICES);

  const [EMPLOYEES, { loading: employeeSaveLoading }] = useMutation(employeeId ? Edit_EMPLOYEES : ADD_EMPLOYEES, {
    onCompleted,
    onError,
    // refetchQueries: [
    //   {
    //     query: GET_ALL_SERVICES,
    //     variables: { page: 1, limit: 10, search: "" },
    //     awaitRefetchQueries: true,
    //   },
    // ],
  });

  function onCompleted(data) {
    // console.log("###_data_### ", data.EditService);
    if (employeeId) {
      toast.success(data?.EditService?.message);
    } else {
      toast.success(data?.AddService?.message);
    }
    redirect("/business/dashboard/employee");
  }

  function onError(parameters) {
    // console.log("###_error ", JSON.parse(JSON.stringify(parameters.message)));
    const error =
      JSON.parse(JSON.stringify(parameters.message)) ?? "Something went wrong!";
    toast.error(error);
  }

  function onSubmit(values) {

    let variables = { ...values };

    if (employeeId) {
      variables = { ...variables, id: employeeId };
    }

    EMPLOYEES({ variables });
  }

  console.log("###_employeeSaveLoading_### ", employeeSaveLoading);

  const ServicesOptions = servicesData?.fetchServicesWithoutPagination?.services ?? [];

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Profile Picture Upload */}
              <FormField
                control={form.control}
                name="profileUrl"
                disable={employeeSaveLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <FileUploader onUpload={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                disable={employeeSaveLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                disable={employeeSaveLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                disable={employeeSaveLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Services Selection (Multiple) */}
              <FormField
                control={form.control}
                name="services"
                disable={employeeSaveLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services</FormLabel>
                    <MultiSelect
                      options={ServicesOptions?.map((service) => ({
                        label: service.name,
                        value: service.id,
                      }))}
                      value={field.value.map((id) => ({
                        label: ServicesOptions?.find((s) => s.id === id)?.name || id,
                        value: id,
                      }))}
                      onChange={(selected) => field.onChange(selected.map((s) => s.value))}
                      isLoading={servicesLoading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Weekly Availability (Checkbox List) */}
            <FormField
              control={form.control}
              name="weeklyAvailability"
              disable={employeeSaveLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekly Availability</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value.includes(day.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, day.value]);
                            } else {
                              field.onChange(field.value.filter((d) => d !== day.value));
                            }
                          }}
                        />
                        <label className="text-sm font-medium">{day.label}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button disable={employeeSaveLoading} type="submit">{employeeId ? "Edit" : "Add"} Employee</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
