/**
 * Componente: Botão para abrir/fechar calendário.
 */

import { useState } from "react";
import { FiCalendar, FiCalendarPlus, FiX } from "react-icons/fi";

const OpenCalendario = ({ onToggle }) => {

  const [calendario, setCalendario] = useState(false);

  function handleToggleForm() {
    setCalendario(!calendario);
    onToggle(!calendario); 
  }

  return (
    <button onClick={handleToggleForm}>
      {calendario ? <FiX /> : <FiCalendar />}
      {/* Alternativa: mostrar FiCalendarPlus quando fechado */}
      {/* {calendario ? <FiX /> : <FiCalendarPlus />} */}
    </button>
  );
};

export default OpenCalendario;