/**
 * Página de Pacientes.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import { pacienteFields } from "../../configs/fields/pacienteFields";
import { useState,useEffect } from "react";
import api from "../../services/api";

const PacientesPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  const [formData, setFormData] = useState(
    pacienteFields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados salvos:", formData);
    // aqui entra chamada para API ou serviço
  };

  // lista de pacientes
  const [paciente, setPaciente] = useState([]);
  useEffect(() => {
    api
      .get("/paciente/all")
      .then((res) => setPaciente(res.data))
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  return (
    <div className="pagina-padrao">
      <OpenForm onToggle={setFormPadrao} />

        {formPadrao && (
          <div className="form-padrao">
            <h3>Cadastrar Paciente</h3>

              <form onSubmit={handleSubmit}>
                {pacienteFields.map((field) => (
                  <input
                    key={field.id}
                    type={field.type}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleChange}
                  />
                ))}
                <button type="submit">Salvar</button>
              </form>
          </div>
        )}

      <div className="table-padrao">
        <h3>Pacientes</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Data de Nascimento</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paciente.length > 0 ? (
              paciente.map((p, index) => (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td> < Edit /> </td>
                  <td> < Delete /> </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum paciente cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PacientesPage;
