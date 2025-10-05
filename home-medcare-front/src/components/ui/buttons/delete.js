/**
 * Componente: Botão genérico para deletar registros.
 * Uso:
 * <Delete endpoint={`/profissional/delete/${id}`} onDelete={recarregarLista} />
 */

import { FiTrash2 } from "react-icons/fi";
import api from "../../../services/api";

const Delete = ({ endpoint, onDelete, confirmMessage = "Tem certeza que deseja excluir este registro?" }) => {
  const handleDelete = async () => {
    if (!endpoint) {
      console.error("Delete: endpoint não informado.");
      alert("Erro interno: endpoint não informado.");
      return;
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.delete(endpoint);
      alert("Registro deletado com sucesso!");
      if (onDelete) onDelete(); // executa callback se fornecida
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar registro. Tente novamente.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn-delete"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "white",
      }}
      title="Excluir registro"
    >
      <FiTrash2 size={18} />
    </button>
  );
};

export default Delete;