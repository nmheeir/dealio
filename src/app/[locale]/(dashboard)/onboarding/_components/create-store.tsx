import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import router from 'next/dist/client/router';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { createStore } from '@/libs/queries/store';
import { createStoreSchema } from '@/libs/validations/store';
import { CreateStoreForm } from '../../store/[storeId]/_components/create-store-form';
import { StepHeader } from './step-header';

type CreateStoreProps = {
  userId: string;
};

type Inputs = z.infer<typeof createStoreSchema>;

export default function CreateStore({ userId }: CreateStoreProps) {
  const searchParams = useSearchParams();
  const [isCreatePending, startCreateTransaction] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      description: '',
      name: '',
    },
  });

  function onSubmit(input: Inputs) {
    startCreateTransaction(async () => {
      const { data, error } = await createStore({ ...input, userId });

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('step', 'connect');
        newSearchParams.set('store', data.id);
        router.push(`/onboarding?${newSearchParams.toString()}`);
      }

      form.reset();
    });
  }

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-4 rounded-xl bg-background/60 p-8"
      >
        <StepHeader
          title="Let's start by creating your store"
          description="You can update your store name and description later"
        />
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 100 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: 'spring' },
            },
          }}
        >
          <CreateStoreForm form={form} onSubmit={onSubmit}>
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending && (
                <Icons.loaderCircle className="mr-2 size-4 animate-spin" />
              )}
              Create store
            </Button>
          </CreateStoreForm>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
