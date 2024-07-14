"use client"
import UserCard from '@/components/userCard/UserCard';
import { useSession } from 'next-auth/react';

const UserProfile = () => {
    const { data: session, status: sessionStatus } = useSession();

    return (
        <>
            
            <UserCard session={session} sessionStatus={sessionStatus} />
        </>
    );
};

export default UserProfile;
