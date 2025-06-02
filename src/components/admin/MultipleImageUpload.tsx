import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, X, Loader2, Plus } from 'lucide-react';

interface MultipleImageUploadProps {
  label: string;
  currentImages?: string[];
  onImagesChange: (urls: string[]) => void;
  path: string;
  accept?: string;
  placeholder?: string;
  maxImages?: number;
}

const MultipleImageUpload = ({ 
  label, 
  currentImages = [], 
  onImagesChange, 
  path, 
  accept = "image/*", 
  placeholder,
  maxImages = 5
}: MultipleImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { uploadFile, deleteFile } = useFileUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (currentImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => uploadFile(file, path));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      const updatedImages = [...currentImages, ...validUrls];
      
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }

    // Clear the input
    event.target.value = '';
  };

  const handleRemove = async (index: number) => {
    const imageUrl = currentImages[index];
    if (imageUrl) {
      const success = await deleteFile(imageUrl);
      if (success) {
        const updatedImages = currentImages.filter((_, i) => i !== index);
        onImagesChange(updatedImages);
      }
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...currentImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Existing Images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img 
                src={imageUrl} 
                alt={`Hero image ${index + 1}`} 
                className="w-full h-32 rounded-lg object-cover border" 
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {index > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ↑
                  </Button>
                )}
                {index < currentImages.length - 1 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    ↓
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 w-6 p-0 bg-red-100 hover:bg-red-200"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Images */}
      {currentImages.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {placeholder || "Add more hero images"}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {currentImages.length}/{maxImages} images uploaded
                </p>
                <Input 
                  type="file" 
                  accept={accept} 
                  multiple
                  onChange={handleFileChange}
                  className="max-w-xs"
                  disabled={uploading}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
