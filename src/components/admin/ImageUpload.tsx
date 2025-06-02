
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  currentImage?: string;
  onImageChange: (url: string | null) => void;
  path: string;
  accept?: string;
  placeholder?: string;
}

const ImageUpload = ({ 
  label, 
  currentImage, 
  onImageChange, 
  path, 
  accept = "image/*", 
  placeholder 
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const { uploadFile, deleteFile, uploading } = useFileUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload file
    const uploadedUrl = await uploadFile(file, path);
    if (uploadedUrl) {
      onImageChange(uploadedUrl);
      setPreview(uploadedUrl);
    } else {
      // Reset preview if upload failed
      setPreview(currentImage || '');
    }

    // Cleanup preview URL
    URL.revokeObjectURL(previewUrl);
  };

  const handleRemove = async () => {
    if (currentImage) {
      const success = await deleteFile(currentImage);
      if (success) {
        onImageChange(null);
        setPreview('');
      }
    } else {
      onImageChange(null);
      setPreview('');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-w-32 h-32 mx-auto rounded-lg object-cover" 
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <>
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {placeholder || "Drop your image here or click to browse"}
                </p>
                <Input 
                  type="file" 
                  accept={accept} 
                  onChange={handleFileChange}
                  className="mt-2"
                  disabled={uploading}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
