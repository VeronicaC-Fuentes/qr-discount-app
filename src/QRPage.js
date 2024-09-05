import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

function QRPage() {
  const [generatedQR, setGeneratedQR] = useState('');

  useEffect(() => {
    const discountCode = `DISCOUNT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrLink = `https://tuevento.netlify.app/descuento?code=${discountCode}`; // Asegúrate de usar la URL correcta
    setGeneratedQR(qrLink);
  }, []);

  return (
    <div>
      <h1>Escanea este código QR para obtener tu descuento</h1>
      {generatedQR && <QRCode value={generatedQR} />}
    </div>
  );
}

export default QRPage;


