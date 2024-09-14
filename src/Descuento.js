import React, { useState, useEffect } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db } from './firebase';
import { useSearchParams } from 'react-router-dom';
import './App.css';
import QRPROM from './assets/test.png';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'; // Importamos íconos de WhatsApp e Instagram

function Descuento() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const discount = searchParams.get('code');
    setDiscountCode(discount);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { ...formData, discountCode };

    try {
      await addDoc(collection(db, "users"), userData);
      setSuccess(true);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  return (
    <div className="mobile-container">
      <div
        className="mobile-banner"
        style={{
          backgroundImage: `url(${QRPROM})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
        }}
      >
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="logo-img" />
        </div>
        <h1>Déjanos tus datos y obtén un bono de 200 soles en tu tratamiento con Kai.</h1>
        <p style={{ fontSize: '12px', color: '#FFFFFF' }}>Aplica para tratamientos mayores a 850 soles.</p>
      </div>

      <div id="form" className="mobile-form">
        <div className="form-card">
          <h2>Ingresa tus Datos</h2>

          {success ? (
            <div className="success-message">
              <p>¡Gracias por registrarte! Tu código de descuento es:</p>
              <strong>{discountCode}</strong>

              {/* Mostrar íconos solo después de enviar los datos */}
              <div className="footer-icons">
                <p>Comunícate con nosotros para agendar una cita y canjear tu bono:</p>
                <a href="https://wa.me/51905448359" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp /> +51 905 448 359
                </a>
                <a href="https://www.instagram.com/kaiestheticboutique/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram /> Instagram
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                name="name"
                placeholder="Ingresa tu nombre"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
              />
              <input
                type="email"
                name="email"
                placeholder="Ingresa tu correo"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-field"
              />
              <button type="submit" className="submit-button">Obtener Bono</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Descuento;

