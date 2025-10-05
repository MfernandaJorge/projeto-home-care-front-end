/**
 * Página de profissionais.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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

  // sucesso ao salvar
  const handleSuccess = () => {
    alert("Profissional cadastrado com sucesso!");
    setFormData(initialForm); // limpa o form
    setFormPadrao(false); // fecha o form
    api.get("/profissional/all").then((res) => setProfissionais(res.data)); // recarrega lista
  };

  return (
    <div className="pagina-padrao">
      <OpenForm onToggle={setFormPadrao} />

      {formPadrao && (
        <div className="form-padrao">
          <h3>Cadastrar Profissional</h3>
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
              endpoint="/profissional/cadastro"
              data={{
                ...formData,
                nome: formData.nome,
                documento: formData.documento,
                email: formData.email,
                telefone: Number(formData.telefone),
                ocupacao: Number(formData.ocupacao),
                endereco: {
                  logradouro: formData.logradouro,
                  bairro: formData.bairro,
                  cidade: formData.cidade,
                  estado: formData.estado,
                  cep: formData.cep,
                  numero: Number(formData.numero),
                },
              }}
              onSuccess={handleSuccess}
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
                  <td>{p.documento}</td>
                  <td>{p.telefone}</td>
                  <td>
                    {p.endereco?.logradouro}, {p.endereco?.numero},{" "}
                    {p.endereco?.bairro}, {p.endereco?.cidade}-
                    {p.endereco?.estado}, CEP {p.endereco?.cep}
                  </td>
                  <td>{p.ocupacao}</td>
                  <td><Edit /></td>
                  <td>
                    <Delete endpoint={`/profissional/delete/${p.id}`} />
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