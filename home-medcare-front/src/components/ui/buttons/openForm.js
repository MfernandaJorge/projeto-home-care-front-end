/**
 * Componente: Botão para abrir/fechar formulário.
 */

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const OpenForm = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  function handleToggleForm() {
    setFormPadrao(!formPadrao);
  }

  return (
    <button onClick={handleToggleForm}>
      {formPadrao ? <FiX /> : <FiPlus />}
    </button>
  );
};

export default OpenForm;