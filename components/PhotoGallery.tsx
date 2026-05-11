"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import type { ToiletImage } from "@/lib/types";

const PLACEHOLDER_GALLERY: ToiletImage[] = Array.from({ length: 6 }).map(
  (_, i) => ({
    src: `https://placehold.co/1200x800.png?text=Image+${i + 1}`,
    alt: `Placeholder image ${i + 1}`,
  }),
);

export function PhotoGallery({ images }: { images: ToiletImage[] }) {
  const gallery = images.length > 0 ? images : PLACEHOLDER_GALLERY;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  function openAt(i: number) {
    setActive(i);
    setOpen(true);
    dialogRef.current?.showModal();
  }
  function close() {
    setOpen(false);
    dialogRef.current?.close();
  }
  function prev() {
    setActive((i) => (i === 0 ? gallery.length - 1 : i - 1));
  }
  function next() {
    setActive((i) => (i === gallery.length - 1 ? 0 : i + 1));
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setActive((i) => (i === 0 ? gallery.length - 1 : i - 1));
      }
      if (e.key === "ArrowRight") {
        setActive((i) => (i === gallery.length - 1 ? 0 : i + 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, gallery.length]);

  const current = gallery[active];
  const status = current.licenseStatus ?? "pending";
  // Photographer line: commercial gets a © prefix; cc/pending/unknown render as-is.
  const photographerText = current.photographer
    ? status === "commercial"
      ? `© ${current.photographer}`
      : current.photographer
    : null;
  // License badge + sourceUrl link only show when the image is verified CC.
  // pending / unknown / commercial deliberately suppress them.
  const showLicense = status === "cc" && Boolean(current.license);
  const showSource = status === "cc" && Boolean(current.sourceUrl);

  return (
    <section className="px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading>Photo Gallery</SectionHeading>

      <div className="mx-auto mt-8 max-w-6xl">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {gallery.map((img, i) => (
            <li key={`${img.src}-${i}`}>
              <button
                type="button"
                onClick={() => openAt(i)}
                aria-label={`Open image: ${img.alt}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#1e3a5f]/10 bg-[#FFFDF8]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 32vw, 50vw"
                  className="object-cover transition-all duration-300 ease-out group-hover:scale-105 group-hover:opacity-90"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs uppercase tracking-wider text-muted">
          Click any image to view larger
        </p>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="m-0 h-screen max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        <div className="relative flex h-full w-full flex-col">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <CloseIcon />
          </button>

          <div className="flex flex-1 items-center">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft />
            </button>

            <div className="mx-auto flex max-h-[80vh] w-full max-w-5xl flex-col items-center justify-center px-16">
              <div className="relative w-full">
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={1600}
                  height={1200}
                  sizes="100vw"
                  className="mx-auto max-h-[70vh] w-auto rounded-xl object-contain"
                />
              </div>
              {(current.caption || photographerText) && (
                <p className="mt-4 max-w-[720px] text-center font-serif text-sm italic text-white/85">
                  {current.caption}
                  {photographerText && (
                    <span className="not-italic uppercase tracking-wider text-xs text-white/60">
                      &nbsp;—{" "}
                      {showSource ? (
                        <a
                          href={current.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-white"
                        >
                          {photographerText}
                        </a>
                      ) : (
                        photographerText
                      )}
                      {showLicense && (
                        <>
                          {" · "}
                          {current.licenseUrl ? (
                            <a
                              href={current.licenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-white"
                            >
                              {current.license}
                            </a>
                          ) : (
                            current.license
                          )}
                        </>
                      )}
                    </span>
                  )}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="flex items-center justify-between px-6 pb-6 text-white/85">
            <span className="text-sm tabular-nums">
              {active + 1} / {gallery.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white/10"
            >
              <GridIcon /> View all
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M6 18 18 6" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M15 6 9 12l6 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}
