import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(
        null,
    );

    const confirm = () =>
        new Promise((resolve, reject) => {
            setPromise({ resolve });
        });
    const handelClose = () => {
        setPromise(null);
    };
    const handelConfirm = () => {
        promise?.resolve(true);
        handelClose();
    };
    const handelCancle = () => {
        promise?.resolve(false);
        handelClose();
    };

    const ConfirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handelCancle} variant='outline'>
                        Cancel
                    </Button>
                    <Button onClick={handelConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
};
