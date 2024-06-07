import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { useGetAccount } from '@/features/accounts/api/use-get-account';
import { useEditAccount } from '@/features/accounts/api/use-edit-accounts';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-accounts';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import { insertAccountSchema } from '@/db/schema';

import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { AccountFrom } from '@/features/accounts/components/account-form';

import { useConfirm } from '@/hook/use-conform';

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure ?',
        'You are about to delete this transaction',
    );
    const accountQuery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);

    const isLoading = accountQuery.isLoading;
    const isPending = editMutation.isPending || deleteMutation.isPending;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };
    const defaultValue = accountQuery.data
        ? {
              name: accountQuery.data.name,
          }
        : {
              name: '',
          };
    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>Edit accounts</SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    ) : (
                        <AccountFrom
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValue={defaultValue}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
