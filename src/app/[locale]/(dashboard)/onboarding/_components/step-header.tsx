import { motion } from 'framer-motion';

type StepHeaderProps = {
  title?: string;
  description?: string;
};

// TODO: translate
export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 250 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, type: 'spring' },
        },
      }}
      className="w-full space-y-1.5"
    >
      <h1 className="text-2xl font-bold text-pretty transition-colors sm:text-3xl">
        {title}
      </h1>
      {description
        ? (
            <p className="text-sm text-pretty text-muted-foreground transition-colors sm:text-base">
              You can update your store name and description later
            </p>
          )
        : null}
    </motion.div>
  );
}
