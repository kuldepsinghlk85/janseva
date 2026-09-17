import React, { useState, useRef } from 'react';
import { UploadCloud, RefreshCw, X, Plus, Image as ImageIcon } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

export default function MultiImageUploadInput({
  images = [],
  onChange,
  label = 'गतिविधि के चित्र अपलोड करें (Multiple Images)',
  hint = 'अधिकतम 8 चित्र जोड़ सकते हैं (PNG, JPG, WEBP)'
}) {
  const [uploading, setUploading] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.urls) {
        onChange([...images, ...data.urls].slice(0, 8));
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

  const handleRemove = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
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
          <span className="text-[11px] text-slate-400">{images.length} चित्र</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
            <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition shadow"
              title="हटाएं"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {images.length < 8 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
              uploading
                ? 'border-orange-400 bg-orange-50/50'
                : 'border-slate-300 hover:border-orange-500 hover:bg-orange-50/30 bg-slate-50/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFiles}
              multiple
              accept="image/*"
              className="hidden"
            />
            {uploading ? (
              <RefreshCw className="w-5 h-5 text-orange-600 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-600">चित्र जोड़ें</span>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
      <p className="text-[10px] text-slate-400">{hint}</p>

      {/* Central Media Picker Modal */}
      <MediaPickerModal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onSelect={(selectedUrl) => {
          if (!images.includes(selectedUrl)) {
            onChange([...images, selectedUrl].slice(0, 8));
          }
        }}
        title="मीडिया लाइब्रेरी से गतिविधि चित्र चुनें"
      />
    </div>
  );
}
