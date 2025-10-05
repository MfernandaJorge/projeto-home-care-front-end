/**
 * Página de agenda.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";

import { agendaFields } from "../../configs/fields/agendaFields";
import { useState,useEffect } from "react";

import api from "../../services/api";

const AgendaPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  const initialForm = agendaFields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {});

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

  // lista de atendimentos agendados.
  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    api
      .get("/agenda/all")
      .then((res) => setAgenda(res.data))
      .catch((err) => console.error("Erro ao carregar atendimentos agendados:", err));
  }, []);

  // sucesso ao salvar
  const handleSuccess = () => {
    alert("Atendimento agendado com sucesso!");
    setFormData(initialForm);
    setFormPadrao(false);
    api.get("/agenda/all").then((res) => setAgenda(res.data)); // recarrega lista
  };

  return (
    <div className="pagina-padrao">
      <OpenForm onToggle={setFormPadrao} />

        {formPadrao && (
          <div className="form-padrao"> 
            <h3>Agendar Atendimento</h3> 

            <form>
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

              <SaveForm
                endpoint="/agenda/novo-agendamento"
                data={{
                  ...formData,
                  id_profissional: formData.id_profissional,
                  data_agendamento: formData.data_agendamento,
                  hora_agendamento: formData.hora_agendamento,
                  receita_medica: formData.receita_medica,
                  status_agendamento: formData.status_agendamento,
                }}
                onSuccess={handleSuccess}
              />
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
                  <td>
                    <Delete endpoint={`/agenda/delete/${p.id}`} />
                  </td>
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