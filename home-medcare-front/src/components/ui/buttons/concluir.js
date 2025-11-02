/**
 * Componente: Botão genérico para concluir atendimentos.
 */

import { FiCheckSquare } from "react-icons/fi";
import api from "../../../services/api";

const Concluir = ({ 
  endpoint, 
  agendamentoId, 
  onSuccess, 
  confirmMessage = "Tem certeza que deseja concluir este atendimento?" 
}) => {
  const handleConclused = async () => {
    if (!endpoint) {
      console.error("Endpoint não informado.");
      alert("Erro interno: endpoint não informado.");
      return;
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.post(endpoint, { agendamentoId });

      if (onSuccess) {
        onSuccess(response.data);
      } else {
        alert("Atendimento concluído com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao concluir:", err);
      alert("Erro ao concluir atendimento. Tente novamente.");
    }
  };

  return (
    <button
      onClick={handleConclused}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "white",
      }}
      title="Concluir atendimento"
    >
      <FiCheckSquare size={18} />
    </button>
  );
};

export default Concluir;