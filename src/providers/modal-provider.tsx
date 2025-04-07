"use client";

import useModalStore from "@/store/modal-store";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

export function ModalItemContainer({ modal }: any) {
  const modalRef = useRef<any>(null);
  const { removeModal } = useModalStore();

  useOnClickOutside(modalRef, () => {
    if (modal.children.props.doNotClose) return;

    removeModal(modal);
  });

  const children = cloneElement(modal.children, {
    closeModal: () => removeModal(modal),
  });
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalRef]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="pointer-events-auto absolute z-[100000] flex justify-center w-full"
      key={modal.id}
    >
      <div className="w-full max-w-2xl px-4" ref={modalRef}>{children}</div>
    </motion.div>
  );
}

export function ModalProvider() {
  const { modals } = useModalStore();

  const parentClass = clsx(
    "fixed inset-0 flex justify-center items-center z-50 pointer-events-none",
    modals.length > 0 && "bg-black/50"
  );

  return (
    <div className={parentClass}>
      <AnimatePresence>
        {modals.map((modal) => (
          <ModalItemContainer key={modal.id} modal={modal} />
        ))}
      </AnimatePresence>
    </div>
  );
}
