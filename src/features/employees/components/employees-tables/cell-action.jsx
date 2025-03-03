'use client';
import { deleteService } from '@/apollo/server';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { gql, useMutation } from '@apollo/client';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { GET_ALL_SERVICES } from '../product-listing';
import { toast } from 'sonner';

const DELETE_SERVICE = gql`
  ${deleteService}
`;
export const CellAction = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [DeleteService] = useMutation(DELETE_SERVICE, {
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
    toast.success(data?.deleteService?.message);
    setLoading(false);
    setOpen(false);
  }

  function onError(parameters) {
    const error = (JSON.parse(JSON.stringify(parameters.message)) ?? "Something went wrong!");
    toast.error(error);
    setLoading(false);
  }

  const onConfirm = async () => {
    setLoading(true);
    const variables = { id: data?.id };
    DeleteService({ variables });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(loading === false ? false : true)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => redirect(`/business/dashboard/services/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
