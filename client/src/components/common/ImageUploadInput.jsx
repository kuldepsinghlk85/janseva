import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, RefreshCw, X, Link as LinkIcon, Folder } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

export default function ImageUploadInput({
  value,
  onChange,
  label = 'चित्र अपलोड करें (Upload Image)',
  hint = 'PNG, JPG, WEBP (अधिकतम 10MB)',
  aspectRatio = 'video', // 'video', 'portrait', 'square'
  className = ''
}) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.message || 'अपलोड विफल रहा');
      }
    } catch (err) {
      setError('सर्वर से कनेक्ट नहीं हो सका');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
    }
  };

  const aspectClasses = {
    video: 'aspect-video w-full',
    portrait: 'w-32 h-44',
    square: 'w-24 h-24'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">{label}</label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPickerModal(true)}
              className="text-[11px] font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1 bg-slate-100 hover:bg-orange-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              <ImageIcon className="w-3 h-3 text-orange-600" />
              <span>लाइब्रेरी से चुनें</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'अपलोडर' : 'यूआरएल'}</span>
            </button>
          </div>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://... या /images/..."
            value={urlDraft || value || ''}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="flex-1 text-xs px-3 py-2 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition"
          >
            लागू करें
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {/* Preview box if value exists */}
          {value ? (
            <div className={`relative rounded-xl overflow-hidden border-2 border-orange-200 bg-slate-100 flex-shrink-0 shadow-sm ${aspectClasses[aspectRatio] || 'w-28 h-28'}`}>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/images/poli1.png'; }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition shadow"
                title="चित्र हटाएं"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : null}

          {/* Upload Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center ${
              uploading
                ? 'border-orange-400 bg-orange-50/50'
                : 'border-slate-300 hover:border-orange-500 hover:bg-orange-50/30 bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center space-y-1.5 py-2">
                <RefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
                <span className="text-xs font-bold text-orange-700">चित्र अपलोड हो रहा है...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {value ? 'चित्र बदलें (फ़ाइल चुनें)' : 'फ़ाइल चुनें या यहाँ खींचें'}
                </div>
                <div className="text-[10px] text-slate-400">{hint}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 font-medium">{error}</p>
      )}

      {/* Central Media Picker Modal */}
      <MediaPickerModal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onSelect={(selectedUrl) => {
          onChange(selectedUrl);
          setShowUrlInput(false);
        }}
        title="मीडिया लाइब्रेरी से चित्र चुनें"
      />
    </div>
  );
}
