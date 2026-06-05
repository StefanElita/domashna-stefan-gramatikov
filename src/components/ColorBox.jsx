import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import { hexToRgb, getContrastYIQ } from '../utils/colors';

const ColorBox = ({ color, index, toggleLock }) => {
  const [copied, setCopied] = useState(false);
  const rgb = hexToRgb(color.hex);
  const textColor = getContrastYIQ(color.hex);

  const handleCopy = (e) => {
    // Prevent copy when clicking on the lock icon
    if (e.target.closest('button')) return;

    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      className={`color-box ${copied ? 'copied-animation' : ''}`}
      style={{ backgroundColor: color.hex, color: textColor }}
      onClick={handleCopy}
    >
      <div className="color-info">
        <h2 className="hex-value">{color.hex}</h2>
        <p className="rgb-value">RGB: {rgb}</p>
      </div>

      <div className="color-actions">
        {copied ? (
          <div className="copied-message">
            <Check size={20} /> Copied!
          </div>
        ) : (
          <div className="copy-hint">
            <Copy size={20} /> Click to copy
          </div>
        )}
      </div>

      <button 
        className="lock-button" 
        onClick={() => toggleLock(index)}
        style={{ color: textColor }}
        title={color.locked ? "Unlock Color" : "Lock Color"}
      >
        {color.locked ? <Lock size={28} /> : <Unlock size={28} />}
      </button>
    </div>
  );
};

export default ColorBox;
