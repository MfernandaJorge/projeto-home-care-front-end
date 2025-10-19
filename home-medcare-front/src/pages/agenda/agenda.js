/**
 * Página de agenda.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";

import OpenCalendario from "./openCalendario";
import Calendario from "./calendario";

import { agendaFields } from "../../configs/fields/agendaFields";
import { useState,useEffect } from "react";

import api from "../../services/api";

const AgendaPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);
  const [calendario, setCalendario] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // lista de atendimentos agendados.
  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    api
      .get("/agenda/all")
      .then((res) => setAgenda(res.data))
      .catch((err) => console.error("Erro ao carregar atendimentos agendados:", err));
  }, []);

  // novo: controle de busca/fluxo do formulário
  const [searchMode, setSearchMode] = useState(null); // null | "profissional" | "dataHora"
  const [selectedProfId, setSelectedProfId] = useState("");
  const [showFullForm, setShowFullForm] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  // horários possíveis (ajuste conforme seu sistema)
const possibleTimes = [
  "00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30",
  "04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30",
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30",
  "20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"
];


  const initialForm = agendaFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

  // dados do formulário.
  const [formData, setFormData] = useState(
    agendaFields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });

    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  // atualiza horários disponíveis quando muda profissional, data ou agenda
  useEffect(() => {
    if (!selectedProfId) {
      setAvailableTimes(possibleTimes);
      return;
    }

    // pega a data no formato YYYY-MM-DD (tolerância para string com T)
    const dateKey = (formData.data_agendamento || "").split("T")[0];

    // horas já agendadas para o profissional na data
    const booked = agenda
      .filter(a => String(a.id_profissional) === String(selectedProfId))
      .filter(a => {
        const ad = (a.data_agendamento || "").split("T")[0];
        return dateKey ? ad === dateKey : true;
      })
      .map(a => String(a.hora_agendamento || "").trim());

    const avail = possibleTimes.filter(t => !booked.includes(t));
    setAvailableTimes(avail);
  }, [selectedProfId, formData.data_agendamento, agenda]);

  // Lista de profissionais e pacientes para os selects dinamicamente.
  const [profissionaisOptions, setProfissionaisOptions] = useState([]);
  const [pacientesOptions, setPacientesOptions] = useState([]);
  useEffect(() => {
    // Carregar profissionais
    api.get("/profissional/all")
      .then((res) => {
        setProfissionaisOptions(res.data);
      })
      .catch((err) => console.error("Erro ao carregar profissionais:", err));

    // Carregar pacientes
    api.get("/paciente/all")
      .then((res) => {
        setPacientesOptions(res.data);
      })
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  const camposAgenda = agendaFields.map(field => {
    if (field.id === "id_profissional") {
      return {
        ...field,
        options: profissionaisOptions.map(prof => ({
          value: prof.id,
          label: prof.nome
        }))
      };
    }

    if (field.id === "id_paciente") {
      return {
        ...field,
        options: pacientesOptions.map(pac => ({
          value: pac.id,
          label: pac.nome
        }))
      };
    }
    return field;
  });

  const handleSuccess = () => {
    setFormData(initialForm);
    setFormPadrao(false);
    setSearchMode(null);
    setSelectedProfId("");
    setShowFullForm(false);
    api.get("/agenda/all").then((res) => setAgenda(res.data));
  };

  const handleEdit = (agendaItem) => {
    setFormPadrao(true);
    setEditMode(true);
    setEditId(agendaItem.id);

    setSearchMode(null);
    setSelectedProfId(String(agendaItem.id_profissional || ""));

    setFormData({
      id_profissional: agendaItem.id_profissional || "",
      id_paciente: agendaItem.id_paciente || "",
      complexidade: agendaItem.complexidade || "",
      descricao: agendaItem.descricao || "",
      data_agendamento: agendaItem.data_agendamento || "",
      hora_agendamento: agendaItem.hora_agendamento || "",
      status_agendamento: agendaItem.status_agendamento || ""
    });

    setShowFullForm(true);
  };

  return (
    <div className={`pagina-padrao ${calendario ? "with-calendario" : ""}`}>
      <OpenCalendario onToggle={setCalendario} />
      {calendario && (
        <div className="calendario-wrapper">
          <Calendario agenda={agenda} />
        </div>
      )}

      <OpenForm onToggle={(open) => { setFormPadrao(open); if (!open) { setSearchMode(null); setShowFullForm(false); } }} />

      {formPadrao && (
        <div className="form-padrao"> 
          <h3>Agendar Atendimento</h3> 

          {/* etapa de escolha: buscar por profissional ou por data/horas */}
          {!showFullForm && (
            <div style={{ marginBottom: 12 }}>
              <div className="busca-opcoes">
                <div>Buscar por disponibilidade de:</div>
                <div className="busca-botoes">
                  <button
                    type="button"
                    className="btn-profissional"
                    onClick={() => setSearchMode("profissional")}
                  >
                    Profissionais
                  </button>
                  <button
                    type="button"
                    className="btn-datahora"
                    onClick={() => { setSearchMode("dataHora"); setShowFullForm(true); }}
                  >
                    Data e Hora
                  </button>
                </div>
              </div>

              {/* se escolheu Profissional, mostra select para escolher */}
              {searchMode === "profissional" && (
                <div style={{ marginTop: 12 }}>
                  <select
                    value={selectedProfId}
                    onChange={(e) => setSelectedProfId(e.target.value)}
                  >
                    <option value="">Selecione o profissional</option>
                    {profissionaisOptions.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                  <div style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedProfId) return alert("Selecione um profissional antes de continuar.");
                        // pré-seta no form e abre o form completo
                        setFormData({
                          ...formData,
                          id_profissional: selectedProfId
                        });
                        setShowFullForm(true);
                      }}
                    >
                      Continuar
                    </button>
                    <button type="button" onClick={() => { setSearchMode(null); setSelectedProfId(""); }}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* formulário completo (após escolha) */}
          {showFullForm && (
            <form>
              {camposAgenda.map((field) => {
                // se for select de profissional e foi pré-escolhido, deixa desabilitado com valor selecionado
                if (field.id === "id_profissional") {
                  return (
                    <select
                      key={field.id}
                      name={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      disabled={Boolean(selectedProfId)} // bloqueia alteração quando veio da busca
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                }

                // hora_agendamento: select de horários disponíveis (considera selectedProfId + data)
                if (field.id === "hora_agendamento") {
                  return (
                    <select
                      key={field.id}
                      name={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                    >
                      <option value="">{field.placeholder || "Hora"}</option>
                      {availableTimes.length === 0 ? (
                        <option disabled>Sem horários disponíveis</option>
                      ) : (
                        availableTimes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))
                      )}
                    </select>
                  );
                }

                // data_agendamento: manter input date (ao alterar refaz availableTimes via useEffect)
                if (field.id === "data_agendamento") {
                  return (
                    <input
                      key={field.id}
                      type="date"
                      name={field.id}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                    />
                  );
                }

                // selects normais (ex: paciente)
                if (field.type === "select") {
                  return (
                    <select
                      key={field.id}
                      name={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                }

                // campos padrão
                return (
                  <input
                    key={field.id}
                    type={field.type}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                  />
                );
              })}

              <SaveForm
                endpoint={
                  editMode
                    ? `agenda/update/${editId}`
                    : "/agenda/novo-agendamento"
                }
                data={{
                  ...formData,
                  id_profissional: Number(formData.id_profissional),
                  id_paciente: Number(formData.id_paciente),
                  complexidade: Number(formData.complexidade),
                  descricao: formData.descricao,
                  data_agendamento: formData.data_agendamento,
                  hora_agendamento: formData.hora_agendamento,
                  status_agendamento: Number(formData.status_agendamento),
                }}
                onSuccess={() => {
                  handleSuccess();
                  setEditMode(false);
                  setEditId(null);
                }}
              />
            </form>
          )}
        </div>
      )}

      {!calendario && (
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
                  <tr key={p.id || index}>
                    <td>{p.id_paciente}</td>
                    <td>{p.id_profissional}</td>
                    <td>{p.data_agendamento}</td>
                    <td>{p.hora_agendamento}</td>
                    <td>{p.status_agendamento}</td>
                    <td>
                      <Edit onClick={() => handleEdit(p)} />
                    </td>
                    <td>
                      <Delete
                        endpoint={`/agenda/delete/${p.id}`}
                        onSuccess={() => {handleSuccess();}}
                      />
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
      )}
    </div>
  );
}

export default AgendaPage;