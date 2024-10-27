import { z } from 'zod';

import { useNewCategories } from '@/features/categories/hooks/use-new-category';
import {CategoryFrom  } from '@/features/categories/components/category-form';
import { useCreateCategory } from '@/features/categories/api/use-create-category';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { insertCategorySchema } from '@/db/schema';

const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategories();
    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>New Category</SheetTitle>
                    <SheetDescription>
                        Create a new category to organize
                        your transaction.
                    </SheetDescription>
                </SheetHeader>
                <CategoryFrom
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValue={{
                        name: '',
                    }}
                />
            </SheetContent>
        </Sheet>
    );
};
