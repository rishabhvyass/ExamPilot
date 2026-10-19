// BlurIn — the "blurry" entrance used on every screen.
//   <BlurInGroup>            staggers its children 60ms apart
//     <BlurIn>…</BlurIn>      each child goes from blur(10px) + 12px low → sharp in 480ms
//   </BlurInGroup>
// <BlurIn soft> = smaller version for rows/results (8px blur, 260ms).
// <Screen> = page wrapper; key it by route inside <AnimatePresence mode="wait" initial={false}>.
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { blurIn, blurInSoft, page, stagger } from "../animations/motion";

export function BlurInGroup({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" {...rest}>
      {children}
    </motion.div>
  );
}

export function BlurIn({ soft, children, ...rest }: HTMLMotionProps<"div"> & { soft?: boolean }) {
  const reduce = useReducedMotion();
  // With reduced motion keep only the opacity fade — no blur, no movement.
  const variants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } }
    : soft ? blurInSoft : blurIn;
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}

export function Screen({ children, ...rest }: HTMLMotionProps<"main">) {
  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit" {...rest}>
      {children}
    </motion.main>
  );
}
