import type { ReactNode } from "react";
import { motion } from "motion/react";
import { page } from "../lib/motion";
import { TabBar, type TabId } from "./ui";

export function Page({
  children,
  tab,
  gutter = 20,
  bare = false,
}: {
  children: ReactNode;
  tab?: TabId;
  gutter?: number;
  bare?: boolean;
}) {
  return (
    <motion.main
      variants={page}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`mx-auto min-h-dvh w-full max-w-[480px] ${bare ? "" : tab ? "pb-[128px]" : "pb-10"}`}
      style={bare ? undefined : { paddingInline: gutter }}
    >
      {children}
      {tab && <TabBar active={tab} />}
    </motion.main>
  );
}
