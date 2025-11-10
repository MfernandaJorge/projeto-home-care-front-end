/**
 * Componente: Botão genérico para cancelar atendimentos.
 */

import { FiXCircle } from "react-icons/fi";
import api from "../../../services/api";

const Cancelar = ({ 
  endpoint, 
  agendamentoId, 
  motivo: motivoProp,
  onSuccess, 
  onCancel, 
  confirmMessage = "Tem certeza que deseja cancelar este atendimento?",
  disabled = false,
}) => {
  const handleCancel = async () => {
    if (disabled) return;

    if (!endpoint) {
      console.error("Endpoint não informado.");
      alert("Erro interno: endpoint não informado.");
      return;
    }

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    let motivoFinal = motivoProp || window.prompt("Informe o motivo do cancelamento:");

    if (!motivoFinal || motivoFinal.trim() === "") {
      alert("Cancelamento abortado: é necessário informar um motivo.");
      return;
    }

    try {
      const response = await api.post(endpoint, {
        agendamentoId,
        motivo: motivoFinal,
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
      disabled={disabled}
      style={{
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "#999" : "white",
        opacity: disabled ? 0.5 : 1,
      }}
      title={disabled ? "Ação indisponível" : "Cancelar atendimento"}
    >
      <FiXCircle size={18} />
    </button>
  );
};

export default Cancelar;