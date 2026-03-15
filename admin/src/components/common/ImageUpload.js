import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ maxImages = 4, onChange }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) return;
    
    // Create preview URLs
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
    
    const updatedImages = [...images, ...filesToAdd];
    const updatedPreviews = [...previews, ...newPreviews];
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    
    if (onChange) {
      onChange(updatedImages);
    }
  };
  
  const removeImage = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previews[index]);
    
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    
    if (onChange) {
      onChange(updatedImages);
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images <span className="text-gray-500">(Max {maxImages})</span>
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Preview existing images */}
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {/* Upload button */}
        {images.length < maxImages && (
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Upload Image</span>
            <span className="text-xs text-gray-500 mt-1">
              {images.length}/{maxImages}
            </span>
          </label>
        )}
      </div>
      
      {images.length === 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <ImageIcon size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">No images uploaded yet</p>
            <p className="text-xs text-blue-600 mt-1">
              Upload up to {maxImages} product images. Recommended size: 800x800px
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
