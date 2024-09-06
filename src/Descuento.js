import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { useSearchParams } from 'react-router-dom';
import './App.css'; // Asegúrate de importar el archivo CSS

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
    <>
      {/* Sección del banner */}
      <div className="banner-container">
        <div className="banner-content">
          <h1>Discover The Secrets Of Beauty</h1>
          <p>Get them together (for less!) for dewy, natural-looking coverage that still looks like skin.</p>
          <a href="#form" className="banner-button">Shop Now</a>
        </div>
      </div>

      {/* Sección del formulario */}
      <div id="form" className="descuento-container">
        <div className="form-card">
          <h2>Regístrate para obtener tu descuento</h2>
          <p className="counter">Personas registradas: {counter}</p>

          {success ? (
            <div className="success-message">
              <p>¡Gracias por registrarte! Tu código de descuento es: <strong>{discountCode}</strong></p>
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
              <button type="submit" className="submit-button">Registrar y obtener descuento</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Descuento;

