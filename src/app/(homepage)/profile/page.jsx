"use client";
import { useAuth } from '@/core/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';

export default function ProfileRedirect() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push(`/profile/${user.id}`);
        }
    }, [user, router]);

    return (
        <div className="flex justify-center items-center h-[70vh]">
            <Spinner size="lg" color="danger" />
        </div>
    );
}