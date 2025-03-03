"use client";
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { getAllServices } from '@/apollo/server';
import { gql, useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';

export const GET_ALL_SERVICES = gql`
  ${getAllServices}
`;

export default function ProductListingPage({ }) {
  const searchParams = useSearchParams();

  // Get search parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data } = useQuery(GET_ALL_SERVICES, {
    variables: { page, limit, search },
  });

  const totalServices = data?.getAllServices?.total_services || 0;
  const services = data?.getAllServices?.services || [];

  return (
    <ProductTable
      columns={columns}
      data={services}
      totalItems={totalServices}
    />
  );
}