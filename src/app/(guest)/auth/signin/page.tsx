import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AuthSignInPage from '@/components/auth/auth.signin';
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import * as React from 'react';



const SignInPage = async () => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect('/')
    }

    return (
        <>
            <div>
                <AuthSignInPage />
            </div>
        </>
    )
}

export default SignInPage;