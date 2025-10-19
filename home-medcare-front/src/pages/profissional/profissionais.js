/**
 * Página de profissionais.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";

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
      const digits = String(value).replace(/\D/g, "").slice(0, 11);
      setFormData({
        ...formData,
        [name]: digits
      });
      return;
    }

    if (name === "documento") {
      const digits = String(value).replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: digits
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // lista de profissionais
  const [profissionais, setProfissionais] = useState([]);
  useEffect(() => {
    api
      .get("/profissional/all")
      .then((res) => setProfissionais(res.data))
      .catch((err) => console.error("Erro ao carregar profissionais:", err));
  }, []);

  const handleSuccess = () => {
    setFormData(initialForm);
    setFormPadrao(false);
    api.get("/profissional/all").then((res) => setProfissionais(res.data));
  };

  const handleEdit = (profissional) => {
    setFormPadrao(true);
    setEditMode(true);
    setEditId(profissional.id);

    setFormData({
      nome: profissional.nome || "",
      documento: profissional.documento || "",
      email: profissional.email || "",
      telefone: profissional.telefone || "",
      ocupacao: profissional.ocupacao || "",
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
      <OpenForm onToggle={setFormPadrao} />

      {formPadrao && (
        <div className="form-padrao">
          <h3>{editMode ? "Editar Profissional" : "Cadastrar Profissional"}</h3>

          <form>
            {profissionalFields.map((field) => (
              <input
                key={field.id}
                type={field.type}
                name={field.id}
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={handleChange}
              />
            ))}

            <SaveForm
              endpoint={
                editMode
                  ? `profissional/update/${editId}`
                  : "/profissional/cadastro"
              }
              data={{
                nome: formData.nome,
                documento: formData.documento,
                email: formData.email,
                telefone: Number(formData.telefone.replace(/\D/g, "")) || null,
                endereco: {
                  logradouro: formData.logradouro,
                  bairro: formData.bairro,
                  cidade: formData.cidade,
                  estado: formData.estado,
                  cep: formData.cep,
                  numero: Number(formData.numero) || null,
                },
                ocupacao: formData.ocupacao ? Number(formData.ocupacao) : null
              }}
              onSuccess={() => {
                handleSuccess();
                setEditMode(false);
                setEditId(null);
              }}
            />
          </form>
        </div>
      )}

      <div className="table-padrao">
        <h3>Profissionais</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Documento</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Endereço</th>
              <th>Ocupação</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {profissionais.length > 0 ? (
              profissionais.map((p, index) => (
                <tr key={index}>
                  <td>{p.nome}</td>
                  <td>{maskDocs(p.documento)}</td>
                  <td>{maskTelefone(p.telefone)}</td>
                  <td>{p.email}</td>
                  <td>
                    {p.endereco?.logradouro}, {p.endereco?.numero},{" "}
                    {p.endereco?.bairro}, {p.endereco?.cidade}-
                    {p.endereco?.estado}, CEP {p.endereco?.cep}
                  </td>
                  <td>{p.ocupacao}</td>
                  <td>
                    <Edit onClick={() => handleEdit(p)} />
                  </td>
                  <td>
                    <Delete
                      endpoint={`/profissional/delete/${p.id}`}
                      onSuccess={() => {handleSuccess();}}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum profissional cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfissionaisPage;