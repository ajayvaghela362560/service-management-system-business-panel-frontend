"use client";
import { notFound } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { getServiceById } from "@/apollo/server";
import EmployeesForm from "./employees-form";

const GET_SERVICE_BY_ID = gql`
  ${getServiceById}
`;

export default function EmployeesViewPage({ employeeId }) {
  // Default values
  let employee = null;
  let pageTitle = "Create New Employees";

  // Only fetch data if employeeId is NOT "new"
  const { data, loading, error } = useQuery(GET_SERVICE_BY_ID, {
    skip: employeeId === "new", // Skip query when creating a new product
    variables: { id: employeeId },
    fetchPolicy: "network-only", // Ensures fresh data every time
  });

  // Handle loading state
  if (loading) {
    return <p className="text-center text-gray-500">Loading service details...</p>;
  }

  // Handle error state
  if (error) {
    console.error("Error fetching product:", error);
    return notFound(); // Show 404 page if an error occurs
  }

  // Set service data if available
  if (data?.getServiceById) {
    employee = data.getServiceById;
    pageTitle = "Edit Employees";
  }

  return <EmployeesForm initialData={employee} pageTitle={pageTitle} />;
}
