import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import EmployeesViewPage from '@/features/employees/components/employees-view-page';

export const metadata = {
  title: 'Dashboard : Employee View'
};

export default async function Page(props) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <EmployeesViewPage employeeId={params.employeeId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
