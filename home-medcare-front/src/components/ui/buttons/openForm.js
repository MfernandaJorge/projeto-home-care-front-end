/**
 * Componente: Botão para abrir/fechar formulário.
 */

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const OpenForm = ({ onToggle }) => {
  
  const [formPadrao, setFormPadrao] = useState(false);

  function handleToggleForm() {
    setFormPadrao(!formPadrao);
    onToggle(!formPadrao); 
  }

  return (
    <button className="open-form-btn" onClick={handleToggleForm}>
      {formPadrao ? <FiX /> : <FiPlus />}
    </button>
  );
};

export default OpenForm;