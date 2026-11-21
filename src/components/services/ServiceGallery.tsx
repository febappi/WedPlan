"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// The chosen photo large, the rest as thumbnails underneath
const ServiceGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div>
      <div className="stock relative aspect-[4/3] overflow-hidden">
        <Image
          src={images[current]}
          alt={`${name}, photo ${current + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-(--space-md) grid grid-cols-5 gap-(--space-sm)">
          {images.map((image, index) => (
            <li key={image + index}>
              <button
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={current === index}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-(--radius-stock) outline-offset-2 transition-opacity duration-(--dur-short) focus-visible:outline-2 focus-visible:outline-focus",
                  current === index ? "outline-2 outline-ink" : "opacity-70 hover:opacity-100"
                )}
              >
                <Image src={image} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceGallery;
