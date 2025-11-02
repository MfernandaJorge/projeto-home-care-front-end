/**
 * Componente: Botão genérico para cancelar atendimentos.
 * Uso:
 */

import { FiXCircle } from "react-icons/fi";
import api from "../../../services/api";

const Cancelar = ({ 
  endpoint, 
  agendamentoId, 
  motivo, 
  onSuccess, 
  onCancel, 
  confirmMessage = "Tem certeza que deseja cancelar este atendimento?" 
}) => {
  const handleCancel = async () => {
    if (!endpoint) {
      console.error("Endpoint não informado.");
      alert("Erro interno: endpoint não informado.");
      return;
    }

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    const motivo = window.prompt("Informe o motivo do cancelamento:");

    if (!motivo || motivo.trim() === "") {
      alert("Cancelamento abortado: é necessário informar um motivo.");
      return;
    }

    try {
      const response = await api.post(endpoint, {
        agendamentoId,
        motivo
      });

      if (onSuccess) {
        onSuccess(response.data);
      } else {
        alert("Atendimento cancelado com sucesso!");
      }

      if (onCancel) onCancel();

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
      title="Cancelar atendimento"
    >
      <FiXCircle size={18} />
    </button>
  );
};

export default Cancelar;