'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';

import { useNewAccount } from '@/features/accounts/hooks/use-new-account';

import { Button } from '@/components/ui/button';

function Home() {
    const { onOpen } = useNewAccount();

    return (
        <>
        <Button onClick={onOpen}>
          Add an account
        </Button>
        </>
    );
}

export default Home;
