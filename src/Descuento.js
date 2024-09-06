import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { useSearchParams } from 'react-router-dom';
import './App.css'; // Asegúrate de importar el archivo CSS
import QRPROM from './assets/QRPROM.png';


function Descuento() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [counter, setCounter] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const discount = searchParams.get('code');
    setDiscountCode(discount);
  }, [searchParams]);

  useEffect(() => {
    const fetchCounter = async () => {
      const docRef = doc(db, "metrics", "counter");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCounter(docSnap.data().count);
      } else {
        await setDoc(docRef, { count: 0 });
      }
    };
    fetchCounter();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { ...formData, discountCode };

    try {
      await addDoc(collection(db, "users"), userData);

      const docRef = doc(db, "metrics", "counter");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newCount = docSnap.data().count + 1;
        await setDoc(docRef, { count: newCount });
        setCounter(newCount);
      }

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
    height: '250px',
  }}
>
        <h1>¡Descuento Exclusivo!</h1>
        <p>Regístrate para obtener tu descuento especial</p>
      </div>

      <div id="form" className="mobile-form">
        <div className="form-card">
          <h2>Regístrate Ahora</h2>
          <p className="counter">Personas registradas: {counter}</p>

          {success ? (
  <div className="success-message">
    <div className="success-icon">🎉</div> {/* Icono decorativo */}
    <p>¡Gracias por registrarte! Tu código de descuento es:</p>
    <strong>{discountCode}</strong> {/* Código de descuento en negrita */}
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
    <button type="submit" className="submit-button">Obtener Descuento</button>
  </form>
)}
        </div>
      </div>
    </div>
  );
}

export default Descuento;

