import { FC } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageRef: React.RefObject<HTMLInputElement>;
}

export const ImageUpload: FC<ImageUploadProps> = ({
  imagePreview,
  errors,
  handleChange,
  imageRef,
}) => {
  return (
    <div
      className="backdrop-blur-md rounded-2xl border border-indigo-500/20 p-6"
      style={{ background: "var(--surface)" }}
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Token Image Upload*
      </h2>

      <div
        onClick={() => document.getElementById("image-upload")?.click()}
        className={`border-2 border-dashed ${
          errors.image ? "border-pink-500" : "border-indigo-500/30"
        } rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer
        hover:border-indigo-400 transition-colors bg-indigo-900/20`}
      >
        {imagePreview ? (
          <div className="relative">
            <div className="absolute rounded-full blur-sm"></div>
            <img
              src={imagePreview}
              alt="Preview"
              className="size-64 rounded-xl object-cover relative"
            />
            <p className="mt-3 text-center text-sm text-indigo-300">
              Click to change
            </p>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-indigo-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-center text-indigo-300">
              Click to upload token image
            </p>
            <p className="text-center text-indigo-400 text-sm mt-1">
              400x400 recommended
            </p>
          </>
        )}

        <input
          id="image-upload"
          type="file"
          name="image"
          onChange={handleChange}
          ref={imageRef}
          accept="image/*"
          className="hidden"
        />
      </div>
      {errors.image && (
        <p className="mt-1 text-sm text-pink-500">{errors.image}</p>
      )}
    </div>
  );
};
