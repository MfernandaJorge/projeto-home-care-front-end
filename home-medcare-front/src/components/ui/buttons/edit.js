/**
 * Componente: Botão para edição de registros.
 */


import { useState } from "react";
import OpenForm from "./openForm";
import { FiEdit3 } from "react-icons/fi";
import api from "../../../services/api";

const Edit = () => {
  function hendleEdit(path, fields, id) {
    < OpenForm />;

  //   api
  //     .get(path)
  //     .then((res) => {
  //       res.data.forEach((dados) => {
  //         if (dados.id == id) {
  //           console.log(fields);
  //           setFields(dados);
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("Erro ao editar:", err);
  //       alert("Erro ao editar profissional. Tente novamente.");
  //     });
  }

  return (
    <button className="fiEdit3" onClick={() => hendleEdit()}>
      <FiEdit3 />
    </button>
  );
};

export default Edit;