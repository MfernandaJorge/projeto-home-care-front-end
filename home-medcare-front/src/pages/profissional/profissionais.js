/**
 * Página de Profissionais.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";
import Pagination from "../../components/ui/pagination/pagination";

import { maskTelefone } from "../../utils/formatFieds/maskPhone";
import { maskDocs } from "../../utils/formatFieds/maskDocs";

import { profissionalFields } from "../../configs/fields/profissionalFields";
import { useState, useEffect } from "react";
import api from "../../services/api";

const ProfissionaisPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  const initialForm = profissionalFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      const digits = String(value).replace(/\D/g, "").slice(0, 9);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    if (name === "documento") {
      const digits = String(value).replace(/\D/g, "").slice(0, 14);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    if (name === "cep") {
      const digits = String(value).replace(/\D/g, "").slice(0, 8);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Lista de profissionais
  const [profissionais, setProfissionais] = useState([]);
  useEffect(() => {
    api
      .get("/profissional/all")
      .then((res) => setProfissionais(res.data))
      .catch((err) => console.error("Erro ao carregar profissionais:", err));
  }, []);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfissionais = profissionais.slice(indexOfFirstItem, indexOfLastItem);

  const handleSuccess = () => {
    setFormData(initialForm);
    setFormPadrao(false); // <- volta para tabela
    setEditMode(false);
    setEditId(null);
    api.get("/profissional/all").then((res) => setProfissionais(res.data));
  };

  const handleEdit = (profissional) => {
    setFormPadrao(true); // <- abre formulário
    setEditMode(true);
    setEditId(profissional.id);

    setFormData({
      nome: profissional.nome || "",
      documento: profissional.documento || "",
      email: profissional.email || "",
      telefone: String(profissional.telefone || ""),
      ocupacao: profissional.ocupacao || "",
      jornadaId: profissional.jornadaId || "",
      logradouro: profissional.endereco?.logradouro || "",
      bairro: profissional.endereco?.bairro || "",
      cidade: profissional.endereco?.cidade || "",
      estado: profissional.endereco?.estado || "",
      cep: profissional.endereco?.cep || "",
      numero: profissional.endereco?.numero || "",
    });
  };

  return (
    <div className="pagina-padrao">
      {/* Botão de abrir/fechar formulário */}
      <OpenForm
        onToggle={() => {
          setFormPadrao(!formPadrao);
          setEditMode(false);
          setEditId(null);
          setFormData(initialForm);
        }}
      />

      {/* Exibe formulário OU tabela */}
      {formPadrao ? (
        <form className="form-padrao">
          <h3>{editMode ? "Editar Profissional" : "Cadastrar Profissional"}</h3>

          <div className="form-grid">
            {profissionalFields.map((field) => (
              <div className="form-field" key={field.id}>
                <label htmlFor={field.id}>{field.placeholder}</label>

                {/* Renderização condicional: input ou select */}
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>

          <SaveForm
            endpoint={
              editMode
                ? `/profissional/update/${editId}`
                : "/profissional/cadastro"
            }
            data={{
              nome: formData.nome,
              documento: formData.documento,
              telefone: Number(String(formData.telefone).replace(/\D/g, "")) || null,
              // email: formData.email,
              endereco: {
                logradouro: formData.logradouro,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
                cep: formData.cep,
                numero: Number(formData.numero) || null,
              },
              ocupacao: formData.ocupacao
                ? Number(formData.ocupacao)
                : null,
              jornadaId: formData.jornadaId
            }}
            onSuccess={handleSuccess}
          />
        </form>
      ) : (
        <div className="table-padrao">
          <h3>Profissionais</h3>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Documento</th>
                <th>Telefone</th>
                {/* <th>Email</th> */}
                <th>Endereço</th>
                <th>Ocupação</th>
                <th>Jornada</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>

            <tbody>
              {currentProfissionais.length > 0 ? (
                currentProfissionais.map((p, index) => {
                  const ocupacaoField = profissionalFields.find(f => f.id === "ocupacao");
                  const ocupacaoLabel = ocupacaoField?.options.find(opt => opt.value === String(p.ocupacao))?.label || "—";
                  const jornadaOptions = {
                    1: "Seg à Sex - 07h às 17h",
                    2: "Seg à Sex - 17h às 03h",
                    3: "Sáb à Dom - 08h às 15h"
                  };

                  return (
                    <tr key={index}>
                      <td>{p.nome}</td>
                      <td>{maskDocs(p.documento)}</td>
                      <td>{maskTelefone(p.telefone)}</td>
                      {/* <td>{p.email}</td> */}
                      <td>
                        {p.endereco?.logradouro}, {p.endereco?.numero},{" "}
                        {p.endereco?.bairro}, {p.endereco?.cidade}-
                        {p.endereco?.estado}, CEP {p.endereco?.cep}
                      </td>
                      <td>{ocupacaoLabel}</td>
                      <td>{jornadaOptions[p.jornadaId] || "—"}</td>
                      <td>
                        <Edit onClick={() => handleEdit(p)} />
                      </td>
                      <td>
                        <Delete
                          endpoint={`/profissional/delete/${p.id}`}
                          onSuccess={handleSuccess}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">Nenhum profissional cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            totalItems={profissionais.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProfissionaisPage;