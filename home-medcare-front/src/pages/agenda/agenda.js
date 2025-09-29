/**
 * Página de agenda.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import { agendaFields } from "../../configs/fields/agendaFields";
import { useState,useEffect } from "react";
import api from "../../services/api";

const AgendaPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  const [formData, setFormData] = useState(
    agendaFields.reduce((acc, field) => {
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
  };

  // lista de atendimentos agendados.
  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    api
      .get("/agenda/all")
      .then((res) => setAgenda(res.data))
      .catch((err) => console.error("Erro ao carregar atendimentos agendados:", err));
  }, []);

  return (
    <div className="pagina-padrao">
      <OpenForm onToggle={setFormPadrao} />

        {formPadrao && (
          <div className="form-padrao"> 
            <h3>Agendar Atendimento</h3> 

            <form onSubmit={handleSubmit}>
              {agendaFields.map((field) => (
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
        <h3>Atendimentos Agendados</h3>

        <table> 
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Profissional</th>
              <th>Data do Atendimento</th>
              <th>Hora do Atendimento</th>
              <th>Status do Atendimento</th>
              <th></th>
              <th></th>
            </tr> 
          </thead> 
          <tbody>
            {agenda.length > 0 ? (
              agenda.map((p, index) => (
                <tr>
                  <td>Paciente Teste</td>
                  <td>Profissional Teste</td>
                  <td>01/01/2001</td>
                  <td>00:00</td>
                  <td>Paciente aguardando atendimento</td>
                  <td> < Edit /> </td>
                  <td></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum atendimento agendado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgendaPage;