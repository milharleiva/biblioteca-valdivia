'use client';

import { motion, Variants, VariantLabels, TargetAndTransition } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
  children: ReactNode;
  variants?: Variants;
  initial?: boolean | VariantLabels | TargetAndTransition;
  animate?: boolean | VariantLabels | TargetAndTransition;
  whileInView?: VariantLabels | TargetAndTransition;
  viewport?: { once?: boolean; margin?: string; amount?: number | "some" | "all" };
  transition?: TargetAndTransition['transition'];
  whileHover?: VariantLabels | TargetAndTransition;
  whileTap?: VariantLabels | TargetAndTransition;
  style?: React.CSSProperties;
  className?: string;
}

export function MotionDiv({
  children,
  variants,
  initial,
  animate,
  whileInView,
  viewport,
  transition,
  whileHover,
  whileTap,
  style,
  className,
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      variants={variants}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionHeader({
  children,
  variants,
  initial,
  animate,
  whileInView,
  viewport,
  transition,
  whileHover,
  whileTap,
  style,
  className,
  ...props
}: MotionWrapperProps) {
  return (
    <motion.header
      variants={variants}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </motion.header>
  );
}