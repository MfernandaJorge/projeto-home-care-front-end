/**
 * Componente: Botão para deletar registro.
 */

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import api from "../../../services/api";

const Delete = () => {
  function hendleDelete(id) {
    if (!id) {
      alert("Por favor, insira o documento do profissional a ser deletado.");
      return;
    }

  //   api
  //     .delete(`/profissional/delete/${id}`)
  //     .then(() => {
  //       alert("Profissional deletado com sucesso!");
  //       api
  //         .get("/profissional/all")
  //         .then((res) => setProfissionais(res.data));
  //     })
  //     .catch((err) => {
  //       console.log("Erro ao deletar:", err);
  //       alert("Erro ao deletar profissional. Tente novamente.");
  //     });
  }
};

export default Delete;