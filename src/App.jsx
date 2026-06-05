import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import ColorBox from './components/ColorBox';
import { generateRandomHex } from './utils/colors';
import './App.css';

const NUM_COLORS = 5;

function App() {
  const [colors, setColors] = useState([]);

  const generatePalette = useCallback(() => {
    setColors(prevColors => {
      // If it's the first time, generate all colors
      if (prevColors.length === 0) {
        return Array(NUM_COLORS).fill(null).map(() => ({
          hex: generateRandomHex(),
          locked: false
        }));
      }

      // Otherwise, only replace unlocked colors
      return prevColors.map(color => {
        if (color.locked) return color;
        return { ...color, hex: generateRandomHex() };
      });
    });
  }, []);

  // Initial generation
  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  // Spacebar listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        generatePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatePalette]);

  const toggleLock = (index) => {
    setColors(prevColors => prevColors.map((color, i) => 
      i === index ? { ...color, locked: !color.locked } : color
    ));
  };

  const exportCss = () => {
    let cssString = ':root {\n';
    colors.forEach((color, i) => {
      cssString += `  --color-${i + 1}: ${color.hex};\n`;
    });
    cssString += '}\n';

    navigator.clipboard.writeText(cssString).then(() => {
      alert('CSS custom properties copied to clipboard!\n\n' + cssString);
    });
  };

  if (colors.length === 0) return null;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Color Palette Generator</h1>
        <p>Press <strong>Spacebar</strong> to generate new colors</p>
      </header>

      <main className="palette-container">
        {colors.map((color, index) => (
          <ColorBox 
            key={index} 
            index={index} 
            color={color} 
            toggleLock={toggleLock} 
          />
        ))}
      </main>

      <footer className="app-controls">
        <button className="primary-button" onClick={generatePalette}>
          <RefreshCw size={20} /> Generate Palette
        </button>
        <button className="secondary-button" onClick={exportCss}>
          <Download size={20} /> Export CSS
        </button>
      </footer>
    </div>
  );
}

export default App;
