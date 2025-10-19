/**
 * Componente: Botão para salvar formulário (genérico).
 */

import { FiSave } from "react-icons/fi";
import api from "../../../services/api"; // ajuste o path conforme sua estrutura

const SaveForm = ({ endpoint, data, onSuccess, onError }) => {
  async function handleClick(e) {
    e.preventDefault();

    try {
      let response;

      if (data.receita_medica instanceof File) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (key === "recceita_medica" && value) {
            formData.append(key, value);

          } else {
            formData.append(key, value);
          }
        });

        if (endpoint.includes("update")) {
          response = await api.put(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

        } else {
          response = await api.post(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

      } else {
        if (endpoint.includes("update")) {
          response = await api.put(endpoint, data);

        } else {
          response = await api.post(endpoint, data);
        }
      }

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