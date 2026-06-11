import { useId, useRef, useState } from 'react';
import { resolveImageUrl } from '../utils/api';
import { uploadFile } from '../utils/upload';

export default function ImageUploadField({
  label = 'Image',
  value = '',
  onChange,
  folder,
  token,
  placeholder = 'Paste image URL or upload a file',
  previewHeight = 120,
}) {
  const inputId = useId();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const preview = resolveImageUrl(value);

  function resetFileInput() {
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function openFilePicker() {
    if (uploading) return;
    fileInputRef.current?.click();
  }

  function handleClear(e) {
    e.preventDefault();
    e.stopPropagation();
    resetFileInput();
    setError('');
    onChange('');
  }

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadFile(file, { token, folder });
      onChange(uploaded.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      resetFileInput();
    }
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <div
        style={{
          border: '2px dashed rgba(212,175,90,0.25)',
          borderRadius: 12,
          padding: 14,
          background: 'rgba(255,255,255,0.02)',
          transition: 'border-color 0.2s ease',
        }}
      >
        {preview ? (
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: previewHeight,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove image"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,80,80,0.92)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
            <button
              type="button"
              onClick={openFilePicker}
              disabled={uploading}
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                zIndex: 2,
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(0,0,0,0.72)',
                color: '#fff',
                cursor: uploading ? 'wait' : 'pointer',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {uploading ? 'Uploading...' : 'Replace'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              minHeight: previewHeight,
              cursor: uploading ? 'wait' : 'pointer',
              color: '#888',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              background: 'transparent',
              padding: 0,
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.6 }}>{uploading ? '⏳' : '📷'}</span>
            <span>{uploading ? 'Uploading to Cloudinary...' : 'Click to upload image'}</span>
            <span style={{ fontSize: 11, color: '#666' }}>JPG, PNG, WebP · max 8MB</span>
          </button>
        )}

        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <input
          type="url"
          value={value}
          disabled={uploading}
          onChange={(e) => {
            setError('');
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            width: '100%',
            marginTop: 10,
            fontSize: 12,
            opacity: uploading ? 0.5 : 1,
          }}
        />
      </div>

      {error && (
        <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 8, fontWeight: 600 }}>{error}</p>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  color: '#aaa',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0,0,0,0.3)',
  color: '#fff',
  outline: 'none',
};
