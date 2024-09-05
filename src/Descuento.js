import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { useSearchParams } from 'react-router-dom';

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
    <div className="descuento-container">
      <div className="form-card">
        <h1>Regístrate para obtener tu descuento</h1>
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
  );
}

export default Descuento;
