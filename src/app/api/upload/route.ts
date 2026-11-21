import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Uploads one image to ImgBB. The API key stays on the server.
export const POST = async (request: Request) => {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Please sign in to upload an image" }, { status: 401 });
  }
  if (user.isBlocked) {
    return NextResponse.json({ message: "Your account has been blocked" }, { status: 403 });
  }
  if (!process.env.IMGBB_API_KEY) {
    return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });
  }

  const formData = await request.formData().catch(() => null);
  const image = formData?.get("image");

  if (!(image instanceof File) || !ALLOWED_TYPES.includes(image.type)) {
    return NextResponse.json({ message: "Please choose a JPG, PNG, WEBP or GIF image" }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ message: "Image must be smaller than 5 MB" }, { status: 400 });
  }

  const imgbbData = new FormData();
  imgbbData.append("image", image);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: "POST",
      body: imgbbData,
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ url: data.data.url as string });
  } catch {
    return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
  }
};
