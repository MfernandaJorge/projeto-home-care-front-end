/**
 * Componente: Botão para salvar formulário.
 */

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const SaveForm = () => {
  function handleSave(e) {
    e.preventDefault();

    if (!nome || !documento || !telefone || !ocupacao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const endereco = {
      logradouro,
      bairro,
      cidade,
      estado,
      cep,
      numero: Number(numero)
    }; 

    const data = {
      nome,
      documento,
      endereco,
      ocupacao: Number (ocupacao),
      telefone: Number(telefone),
    };

    api
      .post("/profissional/cadastro", data)
      .then(() => {
        alert("Profissional cadastrado com sucesso!");
        api
          .get("/profissional/all")
          .then((res) => setProfissionais(res.data));
      })
      .catch((err) => {
        console.log("Erro ao salvar:", err)
        alert("Erro ao salvar profissional. Tente novamente.");
      });

    // limpa campos do formulário
    setNome("");
    setDocumento("");
    setEmail("");
    setTelefone("");
    setLogradouro("");
    setBairro("");
    setCidade("");
    setEstado("");
    setCep("");
    setNumero("");
    setOcupacao("");
  }

  return (
    <button onClick={handleToggleForm}>
      {formPadrao ? <FiX /> : <FiPlus />}
    </button>
  );
};

export default SaveForm;