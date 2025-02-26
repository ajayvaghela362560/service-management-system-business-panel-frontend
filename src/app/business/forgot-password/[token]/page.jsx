import React from 'react';
import ResetPasswordViewPageComponent from '@/components/business/ResetPassword';

export const metadata = {
    title: 'Reset Password'
};

export default async function Page(props) {
    const params = await props.params;
    return (<>
        <ResetPasswordViewPageComponent token={params?.token} />
    </>);
}
