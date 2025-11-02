/**
 * Componente: Botão genérico para cancelar atendimentos.
 * Uso:
 */

import { FiXCircle } from "react-icons/fi";
import api from "../../../services/api";

const Cancelar = ({ endpoint, onSuccess, onCancel, confirmMessage = "Tem certeza que deseja cancelar este atendimento?" }) => {
  const handleCancel = async () => {
    if (!endpoint) {
      console.error("Endpoint não informado.");
      alert("Erro interno: endpoint não informado.");
      return;
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.cancel(endpoint);

      if (onSuccess) {
        onSuccess(response.data);

      } else {
        alert("Atendimento cancelado com sucesso!");
      }

      if (onCancel) onCancel(); // executa callback se fornecida
    } catch (err) {
      console.error("Erro ao cancelar:", err);
      alert("Erro ao cancelar atendimento. Tente novamente.");
    }
  };

  return (
    <button
      onClick={handleCancel}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "white",
      }}
      title="Excluir registro"
    >
      <FiXCircle size={18} />
    </button>
  );
};

export default Cancelar;