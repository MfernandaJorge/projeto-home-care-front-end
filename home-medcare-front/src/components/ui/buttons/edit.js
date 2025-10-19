/**
 * Componente: Botão para edição de registros.
 */

import { FiEdit } from "react-icons/fi";

const Edit = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer"
    }}
    title="Editar registro"
  >
    <FiEdit size={18} />
  </button>
);

export default Edit;