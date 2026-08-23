"use client";

import Image from "next/image";
import { thumbHashToDataURL } from "thumbhash";

function decodeBase64(value: string): Uint8Array {
  const bytes = atob(value);
  return Uint8Array.from(bytes, (character) => character.codePointAt(0) ?? 0);
}

export function DeviceImage({
  src,
  thumbhash,
  alt,
  sizes,
}: {
  src: string;
  thumbhash: string;
  alt: string;
  sizes: string;
}) {
  return (
    <Image
      alt={alt}
      blurDataURL={thumbHashToDataURL(decodeBase64(thumbhash))}
      fill
      loading="lazy"
      placeholder="blur"
      sizes={sizes}
      src={src}
      style={{ objectFit: "contain" }}
    />
  );
}
