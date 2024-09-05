import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import './App.css'; // Asegúrate de importar el archivo CSS

function QRPage() {
  const [generatedQR, setGeneratedQR] = useState('');

  useEffect(() => {
    const discountCode = `DISCOUNT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrLink = `https://tuevento.netlify.app/descuento?code=${discountCode}`; 
    setGeneratedQR(qrLink);
  }, []);

  return (
    <div className="qr-container">
      <div className="qr-card">
        <h1>¡Escanea para obtener tu descuento!</h1>
        {generatedQR && (
          <div className="qr-code-container">
            <QRCode value={generatedQR} size={256} />
          </div>
        )}
        <p className="qr-description">Escanea el código con tu teléfono y sigue los pasos para registrarte.</p>
      </div>
    </div>
  );
}

export default QRPage;
