import { IMAGE_BASE_URL } from "@/lib/config"

export const generateImageUrl = (imageName: string) => {
    if (!imageName) {
        return "/logo_placeholder.png"
    }

    return `${IMAGE_BASE_URL}/${imageName}`
};

export const generateFrameUrl = (url: string) => {
    const frameUrl = url.replace('.webp', '_frame.webp');
    return frameUrl;
}
