import { useState, useRef } from 'react';
import { uploadAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadPhotoProps {
  onUploadComplete: (imageUrl: string) => void;
  currentImage?: string;
}

export default function UploadPhoto({ onUploadComplete, currentImage }: UploadPhotoProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, GIF, and WEBP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.url;
      onUploadComplete(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Image (Optional)
      </label>
      
      {preview ? (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="opacity-0 hover:opacity-100 transition-opacity px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
              >
                Remove Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`
              flex flex-col items-center justify-center w-full h-64 
              border-2 border-dashed border-gray-300 rounded-lg 
              cursor-pointer bg-gray-50 hover:bg-gray-100 
              transition-colors duration-200
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-12 h-12 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF or WEBP (MAX. 5MB)
              </p>
            </div>
          </label>
        </div>
      )}
      
      {uploading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          <span className="text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
}