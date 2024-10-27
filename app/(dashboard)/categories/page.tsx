'use client';
import { Loader2, Plus } from 'lucide-react';

import { useNewCategories } from '@/features/categories/hooks/use-new-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useBulkDeleteCategory } from '@/features/categories/api/use-bulk-delete-categories';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { columns } from './columns';

const CategoriesPage = () => {
    const newCatagory = useNewCategories();
    const categoryQuery = useGetCategories();
    const deleteCategory = useBulkDeleteCategory();
    const category = categoryQuery.data || [];

    const isDisabled = categoryQuery.isLoading || deleteCategory.isPending;

    if (categoryQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between '>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px] w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between '>
                    <CardTitle className='text-xl line-clamp-1'>
                        Categories page
                    </CardTitle>
                    <Button
                        size='sm'
                        onClick={newCatagory.onOpen}
                    >
                        <Plus className='size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey='name'
                        columns={columns}
                        data={category}
                        onDelete={(row) => {
                            const ids = row.map(
                                (r) => r.original.id,
                            );
                            deleteCategory.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
         
        </div>
    );
};

export default CategoriesPage;
