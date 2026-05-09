"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ToiletImage } from "@/lib/types";

export function Gallery({ images }: { images: ToiletImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);

  function open(i: number) {
    setActive(i);
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  const current = images[active];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open image: ${img.alt}`}
              className="group block w-full overflow-hidden rounded-md"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                sizes="(min-width: 720px) 240px, 50vw"
                className="h-32 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:h-36"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClick={close}
        className="m-0 h-screen max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
          <Image
            src={current.src}
            alt={current.alt}
            width={1600}
            height={1200}
            sizes="100vw"
            className="max-h-[80vh] max-w-full object-contain"
          />
          {(current.caption || current.photographer) && (
            <p className="max-w-[720px] text-center font-serif text-sm italic text-white/85">
              {current.caption}
              {current.photographer && (
                <span className="not-italic uppercase tracking-wider text-xs text-white/60">
                  &nbsp;— {current.photographer}
                </span>
              )}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
