import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Save, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Text Input Field
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function TextField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  className 
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={label.replace(/\s+/g, '-').toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

// Number Input Field
interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function NumberField({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  placeholder, 
  required, 
  className 
}: NumberFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={label.replace(/\s+/g, '-').toLowerCase()}
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

// Textarea Field
interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function TextAreaField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  rows = 3, 
  className 
}: TextAreaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={label.replace(/\s+/g, '-').toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
}

// Image Upload Component
interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function ImageUpload({ 
  label, 
  value, 
  onChange, 
  placeholder = "Upload image or enter URL", 
  required, 
  className 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // For now, we'll create a blob URL - in production with Supabase, this would upload to storage
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {/* URL Input */}
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL"
        />
        <div className="text-sm text-gray-500">Or upload a file below:</div>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF up to 10MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Preview */}
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Color Picker
interface ColorSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; className: string }>;
  className?: string;
}

export function ColorSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  className 
}: ColorSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all",
              option.className,
              value === option.value
                ? "border-gray-900 scale-110"
                : "border-gray-300"
            )}
            title={option.label}
          />
        ))}
      </div>
    </div>
  );
}

// Icon Select
interface IconSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; icon: React.ComponentType<any> }>;
  className?: string;
}

export function IconSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  className 
}: IconSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="grid grid-cols-6 gap-2">
        {options.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "p-3 border rounded-lg transition-all hover:bg-gray-50",
                value === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
              title={option.label}
            >
              <IconComponent className="w-5 h-5 mx-auto" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Save/Reset Button Group
interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
  saveText?: string;
  resetText?: string;
  className?: string;
}

export function ActionButtons({ 
  onSave, 
  onReset, 
  isSaving = false, 
  saveText = "Save Changes", 
  resetText = "Reset", 
  className 
}: ActionButtonsProps) {
  return (
    <div className={cn("flex gap-3 justify-end", className)}>
      <Button
        variant="outline"
        onClick={onReset}
        disabled={isSaving}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        {resetText}
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : saveText}
      </Button>
    </div>
  );
}

// Form Section Wrapper
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className 
}: FormSectionProps) {
  return (
    <div className={cn("bg-white rounded-lg border p-6 space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
