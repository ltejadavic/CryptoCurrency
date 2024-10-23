import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListaCriptomonedas: React.FC = () => {
  const [criptomonedas, setCriptomonedas] = useState<{ [key: string]: number }>({});
  const [saldo, setSaldo] = useState(0);
  const [criptoSeleccionada, setCriptoSeleccionada] = useState('');
  const [montoInvertido, setMontoInvertido] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Obtener criptomonedas desde la API
      axios.get('http://localhost:5000/api/cryptos/lista', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const preciosCriptos = response.data;
        setCriptomonedas(preciosCriptos);

        // Verificar si existe el JSON en localStorage
        const preciosLocales = localStorage.getItem('preciosCriptos');

        if (!preciosLocales) {
          // Si no existe, guardamos por primera vez
          localStorage.setItem('preciosCriptos', JSON.stringify(preciosCriptos));
          console.log('Precios de criptomonedas guardados por primera vez en localStorage.');
        } else {
          // Si ya existe, actualizamos el JSON
          localStorage.setItem('preciosCriptos', JSON.stringify(preciosCriptos));
          console.log('Precios de criptomonedas actualizados en localStorage.');
        }
      })
      .catch(error => console.error('Error al obtener criptomonedas', error));

      // Obtener saldo del usuario
      axios.get('http://localhost:5000/api/saldo', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setSaldo(response.data.saldo))  // Guardar el saldo del usuario
      .catch(error => console.error('Error al obtener el saldo', error));
    }
  }, []);

  // Función para deseleccionar la criptomoneda y mostrar la lista completa
  const handleDeseleccionar = () => {
    setCriptoSeleccionada('');
    setMontoInvertido(0);  // Reiniciar el monto invertido
  };

  // Lógica para manejar la inversión
  const handleInvertir = async () => {
    if (!criptoSeleccionada || montoInvertido <= 0) {
      setMensaje('Selecciona una criptomoneda y un monto válido.');
      return;
    }

    if (montoInvertido > saldo) {
      setMensaje('No tienes suficiente saldo para esta inversión.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/portafolio/invertir', 
        {
          criptomoneda: criptoSeleccionada,
          monto: montoInvertido
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Respuesta del servidor:', response.data);
      setMensaje(`Has invertido ${montoInvertido} USD en ${criptoSeleccionada}.`);
    } catch (error) {
      console.error('Error al realizar la inversión:', error);
      setMensaje('Error al realizar la inversión.');
    }
  };

  return (
    <div>
      <h2>Lista de Criptomonedas</h2>

      {/* Si no hay criptomoneda seleccionada, mostrar la lista completa */}
      {!criptoSeleccionada ? (
        <ul>
          {Object.keys(criptomonedas).map((simbolo) => (
            <li key={simbolo}>
              {simbolo}: ${criptomonedas[simbolo]}
              <button onClick={() => setCriptoSeleccionada(simbolo)}>Seleccionar</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h3>Invertir en {criptoSeleccionada}</h3>
          <p>Saldo disponible: ${saldo}</p>
          
          {/* Slider para ajustar el monto */}
          <input 
            type="range" 
            min="0" 
            max={saldo} 
            value={montoInvertido} 
            onChange={(e) => setMontoInvertido(Number(e.target.value))} 
          />
          
          {/* Campo para editar manualmente el monto */}
          <input 
            type="number" 
            value={montoInvertido} 
            onChange={(e) => setMontoInvertido(Number(e.target.value))} 
            min="0" 
            max={saldo} 
          />
          
          <p>Monto a invertir: ${montoInvertido}</p>
          <button onClick={handleInvertir}>Invertir</button>
          <button onClick={handleDeseleccionar}>Deseleccionar</button> {/* Botón para deseleccionar */}
        </div>
      )}

      <button onClick={() => navigate('/home')}>Volver a Home</button>
      <p>{mensaje}</p>
    </div>
  );
};

export default ListaCriptomonedas;