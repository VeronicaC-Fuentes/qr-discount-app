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

  // Cargar el código de descuento desde la URL
  useEffect(() => {
    const discount = searchParams.get('code');
    setDiscountCode(discount);
  }, [searchParams]);

  // Cargar el contador de personas
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
      // Guarda los datos del usuario en Firestore
      await addDoc(collection(db, "users"), userData);

      // Incrementa el contador
      const docRef = doc(db, "metrics", "counter");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newCount = docSnap.data().count + 1;
        await setDoc(docRef, { count: newCount });
        setCounter(newCount); // Actualiza el estado del contador
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  return (
    <div className="Descuento">
      <h1>Regístrate para obtener tu descuento</h1>
      <p>Tu código de descuento es: {discountCode}</p>
      <p>Personas registradas: {counter}</p>
      {success ? (
        <p>¡Gracias por registrarte! El descuento ha sido registrado.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Registrar y obtener descuento</button>
        </form>
      )}
    </div>
  );
}

export default Descuento;

