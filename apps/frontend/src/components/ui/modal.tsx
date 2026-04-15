"use client";

import React from "react";
import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog ref={dialogRef} className="fixed inset-0 flex items-center justify-center z-100 bg-[#17171740]" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-neutral-50 border border-neutral-300 rounded-xl w-[640px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  );
}
