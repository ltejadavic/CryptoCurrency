import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [user, setUser] = useState<{ nombre: string } | null>(null);
  const navigate = useNavigate();  // Para redirigir al usuario después de desloguearse

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }  // Enviar el token en el header
      })
      .then(response => setUser(response.data))
      .catch(error => console.error('Error al obtener el usuario', error));
    }
  }, []);

  // Función para desloguearse
  const handleLogout = () => {
    localStorage.removeItem('token');  // Eliminar el token de localStorage
    navigate('/login');  // Redirigir al login
  };

  return (
    <div>
      <h2>Bienvenido a la Home</h2>
      {user ? (
        <>
          <p>Bienvenido, {user.nombre}!</p>
          {/* Botón para desloguearse */}
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Home;