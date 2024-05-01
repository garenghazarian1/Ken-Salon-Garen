"use client"
import UserCard from '@/components/userCard/UserCard';
import { useSession } from 'next-auth/react';

const UserProfile = () => {
    const { data: session, status: sessionStatus } = useSession();

    return (
        <div>
            <h1>User Profile</h1>
            <UserCard session={session} sessionStatus={sessionStatus} />
        </div>
    );
};

export default UserProfile;
