"use client";

import { useEffect, useState } from "react";
import EnquiryPopup from "@/app/components/common/EnquiryPopupHome";

type Props = {
  defaultCourse?: string;
  delay?: number;
  onlyOncePerSession?: boolean;
};

export default function HomePopupLauncher({
  defaultCourse = "",
  delay = 0,
  onlyOncePerSession = true,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storageKey = "Qmatrix-home-popup-shown";

    if (
      onlyOncePerSession &&
      typeof window !== "undefined" &&
      sessionStorage.getItem(storageKey) === "true"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);

      if (onlyOncePerSession) {
        sessionStorage.setItem(storageKey, "true");
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delay, onlyOncePerSession]);

  return (
    <EnquiryPopup
      open={open}
      onClose={() => setOpen(false)}
      defaultCourse={defaultCourse}
    />
  );
}