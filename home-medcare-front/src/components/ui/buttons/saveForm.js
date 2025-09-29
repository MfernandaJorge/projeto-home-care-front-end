/**
 * Componente: Botão para salvar formulário (genérico).
 */

import { FiSave } from "react-icons/fi";
import api from "../../../services/api"; // ajuste o path conforme sua estrutura

const SaveForm = ({ endpoint, data, onSuccess, onError }) => {
  async function handleClick(e) {
    e.preventDefault();

    try {
      const response = await api.post(endpoint, data);
      console.log("Salvo com sucesso:", response.data);

      if (onSuccess) {
        onSuccess(response.data);

      } else {
        alert("Registro salvo com sucesso!");
      }

    } catch (err) {
      console.error("Erro ao salvar:", err);
      if (onError) {
        onError(err);

      } else {
        alert("Erro ao salvar. Tente novamente.");
      }
    }
  }

  return (
    <button type="button" onClick={handleClick}>
      <FiSave /> Salvar
    </button>
  );
};

export default SaveForm;