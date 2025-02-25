"use client";
import { notFound } from "next/navigation";
import ProductForm from "./product-form";
import { gql, useQuery } from "@apollo/client";
import { getServiceById } from "@/apollo/server";

const GET_SERVICE_BY_ID = gql`
  ${getServiceById}
`;

export default function ProductViewPage({ productId }) {
  // Default values
  let service = null;
  let pageTitle = "Create New Service";

  // Only fetch data if productId is NOT "new"
  const { data, loading, error } = useQuery(GET_SERVICE_BY_ID, {
    skip: productId === "new", // Skip query when creating a new product
    variables: { id: productId },
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
    service = data.getServiceById;
    pageTitle = "Edit Service";
  }

  return <ProductForm initialData={service} pageTitle={pageTitle} />;
}
