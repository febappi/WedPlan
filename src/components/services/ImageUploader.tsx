"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { getImageError, uploadImage } from "@/lib/upload";

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  invalid?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

// Each chosen file goes to ImgBB straight away; the form only keeps the hosted links
const ImageUploader = ({ images, onChange, max = 5, invalid, onUploadingChange }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(0);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const room = max - images.length;
    if (files.length > room) {
      toast.add({ title: `You can add ${room} more ${room === 1 ? "photo" : "photos"}`, type: "warning" });
    }

    let next = [...images];
    const chosen = files.slice(0, room);
    setUploading(chosen.length);
    onUploadingChange?.(true);

    for (const file of chosen) {
      const fileError = getImageError(file);
      if (fileError) {
        toast.add({ title: `${file.name}: ${fileError}`, type: "error" });
      } else {
        try {
          const url = await uploadImage(file);
          next = [...next, url];
          onChange(next);
        } catch (uploadError) {
          toast.add({ title: uploadError instanceof Error ? uploadError.message : "Image upload failed", type: "error" });
        }
      }
      setUploading((count) => count - 1);
    }
    onUploadingChange?.(false);
  };

  return (
    <div>
      <ul className="grid grid-cols-3 gap-(--space-sm) sm:grid-cols-5">
        {images.map((image, index) => (
          <li key={image + index} className="relative aspect-square overflow-hidden rounded-(--radius-stock) bg-paper-3">
            <Image src={image} alt={`Service photo ${index + 1}`} fill sizes="160px" className="object-cover" />
            {index === 0 && (
              <span className="absolute bottom-(--space-2xs) left-(--space-2xs) rounded-(--radius-pill) bg-ink px-(--space-xs) text-xs text-paper">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute top-(--space-2xs) right-(--space-2xs) flex size-7 items-center justify-center rounded-full bg-ink/80 text-paper transition-colors duration-(--dur-short) hover:bg-ink focus-visible:outline-2 focus-visible:outline-focus"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </li>
        ))}

        {Array.from({ length: uploading }, (_, index) => (
          <li key={`uploading-${index}`} className="flex aspect-square items-center justify-center rounded-(--radius-stock) bg-paper-3">
            <Spinner className="size-6 text-ink" />
            <span className="sr-only">Uploading</span>
          </li>
        ))}

        {images.length + uploading < max && (
          <li>
            <label
              className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-(--space-2xs) rounded-(--radius-stock) border-2 border-dashed text-center text-sm text-ink-2 transition-colors duration-(--dur-short) hover:border-ink-3 has-focus-visible:outline-2 has-focus-visible:outline-focus ${invalid ? "border-destructive" : "border-edge"}`}
            >
              <ImagePlus className="size-6" aria-hidden="true" />
              Add photos
              <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFiles} className="sr-only" />
            </label>
          </li>
        )}
      </ul>
      <p className="mt-(--space-xs) text-sm text-ink-3">Up to {max} photos, 5 MB each. The first one is the cover.</p>
    </div>
  );
};

export default ImageUploader;
