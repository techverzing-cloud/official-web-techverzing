"use client";

import { usePathname } from "next/navigation";
import Preloader from "./Preloader";

export default function PreloaderWrapper() {
  const pathname = usePathname();
  return <Preloader key={pathname} />;
}
