import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { useGetCategory } from '@/features/categories/api/use-get-category';
import { useEditCategoriy } from '@/features/categories/api/use-edit-categoriy';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import {insertCategorySchema } from '@/db/schema';

import {useOpenCategories} from '@/features/categories/hooks/use-open-category';
import { CategoryFrom } from '@/features/categories/components/category-form';

import { useConfirm } from '@/hook/use-conform';

const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategories();

    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure ?',
        'You are about to delete this transaction',
    );
    const catagoryQuery = useGetCategory(id);
    const editMutation = useEditCategoriy(id);
    const deleteMutation = useDeleteCategory(id);

    const isLoading = catagoryQuery.isLoading;
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
    const defaultValue = catagoryQuery.data
        ? {
              name: catagoryQuery.data.name,
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
                        <SheetTitle>
                            Edit category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    ) : (
                        <CategoryFrom
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
