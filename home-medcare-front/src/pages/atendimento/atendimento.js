/**
 * Página de atendimentos.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";

import { atendimentoFields } from "../../configs/fields/atendimentoFields";
import { useState, useEffect } from "react";
import api from "../../services/api";

const AtendimentosPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  const initialForm = atendimentoFields.reduce((acc, field) => {
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

  // lista de atendimentos
  const [atendimentos, setAtendimentos] = useState([]);
  useEffect(() => {
    api
      .get("/atendimento/all")
      .then((res) => setAtendimentos(res.data))
      .catch((err) => console.error("Erro ao carregar atendimentos:", err));
  }, []);

  // sucesso ao salvar
  const handleSuccess = () => {
    alert("Novo atendimento cadastrado com sucesso!");
    setFormData(initialForm); // limpa o form
    setFormPadrao(false); // fecha o form
    api.get("/atendimento/all").then((res) => setAtendimentos(res.data)); // recarrega lista
  };

  return (
    <div className="pagina-padrao">
      <OpenForm onToggle={setFormPadrao} />

      {formPadrao && (
        <div className="form-padrao">
          <h3>Cadastrar Novo Atendimento</h3>
          <form>
            {atendimentoFields.map((field) => (
              <input
                key={field.id}
                type={field.type}
                name={field.id}
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={handleChange}
              />
            ))}

            {/* Botão que chama API de forma padrão */}
            <SaveForm
              endpoint="/atendimento/novo-atendimento"

              data={{
                ...formData,
                descricao: formData.descricao,
                complexidade: Number(formData.complexidade),
              }}
              onSuccess={handleSuccess}
            />
          </form>
        </div>
      )}

      <div className="table-padrao">
        <h3>Atendimentos</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Complexidade</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {atendimentos.length > 0 ? (
              atendimentos.map((p, index) => (
                <tr key={index}>
                  <td>{p.descricao}</td>
                  <td>{p.complexidade}</td>
                  <td><Edit /></td>
                  <td>
                    <Delete endpoint={`/atendimento/delete/${p.id}`} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum atendimento cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtendimentosPage;