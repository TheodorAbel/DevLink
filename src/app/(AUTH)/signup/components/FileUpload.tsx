/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (selectedFile && previewUrl) {
    return (
      <div className="relative">
        <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
          <img 
            src={previewUrl} 
            alt="Company logo preview" 
            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
        ${isDragOver 
          ? 'border-blue-400 bg-blue-50/50 backdrop-blur-sm' 
          : 'border-gray-300 hover:border-gray-400 bg-white/30 backdrop-blur-sm'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
      <h3 className="font-medium text-gray-900 mb-2">Upload company logo</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop your logo here, or click to browse
      </p>
      <p className="text-xs text-gray-400">
        PNG, JPG, GIF up to 10MB
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}