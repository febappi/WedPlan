export const MAX_IMAGE_MB = 5;

// Returns an error message for a file that should not be uploaded, or an empty string
export const getImageError = (file: File) => {
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    return "Please choose a JPG, PNG, WEBP or GIF image";
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_MB} MB`;
  }
  return "";
};

export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.url as string;
};
