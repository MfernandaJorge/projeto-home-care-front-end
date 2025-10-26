/**
 * Página de agenda.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";
import Pagination from "../../components/ui/pagination/pagination";

import { formatDate } from "../../utils/formatFieds/formatDate";

import OpenCalendario from "./openCalendario";
import Calendario from "./calendario";

import { agendaFields } from "../../configs/fields/agendaFields";
import { useState, useEffect } from "react";

import api from "../../services/api";

const AgendaPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);
  const [calendario, setCalendario] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    api.get("/agenda/all").then(res => setAgenda(res.data)).catch(err => console.error(err));
  }, []);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // calcula índices para exibir apenas os registros da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgenda = agenda.slice(indexOfFirstItem, indexOfLastItem);

  const [searchMode, setSearchMode] = useState(null);
  const [selectedProfId, setSelectedProfId] = useState("");
  const [showFullForm, setShowFullForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [showSimulatedTimesStep, setShowSimulatedTimesStep] = useState(false);
  const [simulatedTimes, setSimulatedTimes] = useState([]);
  const [selectedSimulatedTime, setSelectedSimulatedTime] = useState("");

  const [availableTimes, setAvailableTimes] = useState([]);

  const possibleTimes = ["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"];

  const initialForm = agendaFields.reduce((acc, field) => { acc[field.id] = ""; return acc; }, {});
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!selectedProfId) { setAvailableTimes(possibleTimes); return; }
    const dateKey = (formData.data_agendamento || "").split("T")[0];
    const booked = agenda.filter(a => String(a.id_profissional) === String(selectedProfId))
                         .filter(a => dateKey ? (a.data_agendamento || "").split("T")[0] === dateKey : true)
                         .map(a => String(a.hora_agendamento || "").trim());
    setAvailableTimes(possibleTimes.filter(t => !booked.includes(t)));
  }, [selectedProfId, formData.data_agendamento, agenda]);

  const [profissionaisOptions, setProfissionaisOptions] = useState([]);
  const [pacientesOptions, setPacientesOptions] = useState([]);

  useEffect(() => {
    api.get("/profissional/all").then(res => setProfissionaisOptions(res.data)).catch(err => console.error(err));
    api.get("/paciente/all").then(res => setPacientesOptions(res.data)).catch(err => console.error(err));
  }, []);

  const camposAgenda = agendaFields.map(field => {
    if (field.id === "id_profissional") return { ...field, options: profissionaisOptions.map(p => ({ value: p.id, label: p.nome })) };
    if (field.id === "id_paciente") return { ...field, options: pacientesOptions.map(p => ({ value: p.id, label: p.nome })) };
    return field;
  });

  const handleSuccess = () => {
    setFormData(initialForm);
    setFormPadrao(false);
    setSearchMode(null);
    setSelectedProfId("");
    setShowFullForm(false);
    api.get("/agenda/all").then(res => setAgenda(res.data));
  };

  const handleEdit = (item) => {
    setFormPadrao(true);
    setEditMode(true);
    setEditId(item.id);
    setSelectedProfId(String(item.id_profissional || ""));
    setFormData({
      id_profissional: item.id_profissional || "",
      id_paciente: item.id_paciente || "",
      complexidade: item.complexidade || "",
      descricao: item.descricao || "",
      data_agendamento: item.data_agendamento || "",
      hora_agendamento: item.hora_agendamento || "",
      status_agendamento: item.status_agendamento || ""
    });
    setShowFullForm(true);
  };

  const fetchSimulatedTimes = async () => {
    if (!formData.data_agendamento || !formData.hora_agendamento || !formData.id_paciente) return;
    try {
      const payload = {
        pacienteId: Number(formData.id_paciente),
        profissionalId: Number(formData.id_profissional) || null,
        tipoAtendimento: Number(formData.tipoAtendimento) || 2,
        diaDesejado: formData.data_agendamento || "",
        horaDesejada: formData.hora_agendamento.includes(":") && formData.hora_agendamento.length === 5 ? `${formData.hora_agendamento}:00` : formData.hora_agendamento,
        diasSimulacao: 2
      };
  
      const res = await api.post("/agendamento/simular", payload);
      setSimulatedTimes(res.data || []);
      setShowSimulatedTimesStep(true);
      setShowFullForm(false);

    } catch (err) {
      console.error(err);
      alert("Erro ao buscar horários disponíveis.");
    }
  };

  return (
    <div className={`pagina-padrao ${calendario ? "with-calendario" : ""}`}>
      <OpenCalendario onToggle={setCalendario} />
      {calendario && 
        <div className="calendario-wrapper">
          <Calendario agenda={agenda} />
        </div>
      }

      <OpenForm onToggle={(open) => { setFormPadrao(open); if (!open) { setSearchMode(null); setShowFullForm(false); } }} />

      {formPadrao && (
        <div className="form-padrao">
          <h3>Agendar Atendimento</h3>

          {/* STEP 0 - pergunta inicial */}
          {currentStep === 0 && (
            <div className="busca-opcoes">
              <div>Há preferência por profissional?</div>
              <div className="busca-botoes">
                <button onClick={() => setCurrentStep(1)}>Sim</button>
                <button onClick={() => setCurrentStep(2)}>Não</button>
              </div>
            </div>
          )}

          {/* STEP 1 - selecionar profissional */}
          {currentStep === 1 && (
            <div>
              <div>Escolha um profissional:</div>
              <select
                value={selectedProfId}
                onChange={e => setSelectedProfId(e.target.value)}
              >
                <option value="">Selecione o profissional</option>
                {profissionaisOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>

              <div className="botoes-step">
                <button onClick={() => setCurrentStep(0)}>Voltar</button>
                <button onClick={() => {
                  if (!selectedProfId) return alert("Selecione um profissional.");
                  setFormData({ ...formData, id_profissional: selectedProfId });
                  setCurrentStep(2);
                }}>Continuar</button>
              </div>
            </div>
          )}

          {/* STEP 2 - data e hora */}
          {currentStep === 2 && (
            <div>
              <div>Escolha a data e hora:</div>
              <input
                type="date"
                value={formData.data_agendamento || ""}
                onChange={e => setFormData({ ...formData, data_agendamento: e.target.value })}
              />
              <select
                value={formData.hora_agendamento || ""}
                onChange={e => setFormData({ ...formData, hora_agendamento: e.target.value })}
              >
                <option value="">Selecione o horário:</option>
                {availableTimes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <div className="botoes-step">
                <button onClick={() => setCurrentStep(1)}>Voltar</button>
                <button onClick={() => {
                  if (!formData.data_agendamento || !formData.hora_agendamento)
                    return alert("Selecione data e hora.");
                  setCurrentStep(3);
                }}>Continuar</button>
              </div>
            </div>
          )}

          {/* STEP 3 - paciente */}
          {currentStep === 3 && (
            <div>
              <div>Escolha um paciente:</div>
              <select
                value={formData.id_paciente || ""}
                onChange={e => setFormData({ ...formData, id_paciente: e.target.value })}
              >
                <option value="">Selecione o paciente</option>
                {pacientesOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>

              <div className="botoes-step">
                <button onClick={() => setCurrentStep(2)}>Voltar</button>
                <button onClick={() => {
                  if (!formData.id_paciente) return alert("Selecione um paciente.");
                  fetchSimulatedTimes();
                  setCurrentStep(4);
                }}>Continuar</button>
              </div>
            </div>
          )}

          {/* STEP 4 - horários simulados */}
          {currentStep === 4 && (
            <div>
              <select
                name="simulacaoEscolhida"
                onChange={(e) => {
                  const opcao = simulatedTimes.find(s => 
                    `${s.id_profissional}-${s.data}-${s.hora}` === e.target.value
                  );

                  setFormData({
                    ...formData,
                    id_profissional: opcao.profissional,
                    data_agendamento: opcao.data,
                    hora_agendamento: opcao.horaInicio
                  });
                }}
              >
                <option value="">Selecione uma opção</option>
                {simulatedTimes.map(s => (
                  <option
                    key={`${s.profissional}-${s.data}-${s.horaInicio}`}
                    value={`${s.profissional}-${s.data}-${s.horaInicio}`}
                  >
                    {`${s.profissional}, ${s.horaInicio}, ${formatDate(s.data)}`}
                  </option>
                ))}
              </select>

              <div className="botoes-step">
                <button onClick={() => setCurrentStep(3)}>Voltar</button>
                <button onClick={() => {
                  if (!selectedSimulatedTime) return alert("Selecione um horário.");
                  const sim = simulatedTimes.find(s => s.horaInicio === selectedSimulatedTime);
                  setFormData({
                    ...formData,
                    data_agendamento: sim?.data,
                    hora_agendamento: selectedSimulatedTime
                  });
                  setCurrentStep(5);
                }}>Continuar</button>
              </div>
            </div>
          )}


          {/* STEP 5 - formulário final */}
          {currentStep === 5 && (
            <form>
              {camposAgenda
                // Exibe apenas os campos finais desejados
                .filter(field =>
                  ["complexidade", "descricao", "status_agendamento"].includes(field.id)
                )
                .map(field => {
                  if (field.type === "select") {
                    return (
                      <select
                        key={field.id}
                        name={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    );
                  }
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

              <div className="botoes-step">
                <button type="button" onClick={() => setCurrentStep(4)}>Voltar</button>
                <SaveForm
                  endpoint={editMode ? `agenda/update/${editId}` : "/agendamento/agendar"}
                  data={{
                    ...formData,
                    pacienteId: Number(formData.id_paciente),
                    profissionalId: formData.id_profissional ? Number(formData.id_profissional) : null,
                    tipoAtendimento: Number(formData.complexidade),
                    diaDesejado: formData.data_agendamento,
                    horaDesejada: formData.hora_agendamento,
                    diasSimulacao: 1
                  }}
                  onSuccess={() => {
                    handleSuccess();
                    setEditMode(false);
                    setEditId(null);
                    setCurrentStep(0);
                  }}
                />
              </div>
            </form>
          )}
        </div>
      )}


      <div className="table-padrao">
        <h3>Pacientes</h3>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Profissional</th>
              <th>Data</th>
              <th>Hora início</th>
              <th>Hora prevista para término</th>
              <th>Complexidade</th>
              <th>Descrição</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentAgenda.length > 0 ? (
              currentAgenda.map((p, index) => (
                <tr key={index}>
                  <td>{p.id_paciente}</td>
                  <td>{p.id_profissional}</td>
                  <td>{formatDate(p.data_agendamento)}</td>
                  <td>{p.hora_agendamento}</td>
                  <td>{p.hora_agendamento}</td>
                  <td>{p.complexidade}</td>
                  <td>{p.descricao}</td>
                  <td>{p.status_agendamento}</td>
                  <td>
                    <Edit onClick={() => handleEdit(p)} />
                  </td>
                  <td>
                    <Delete
                      endpoint={`/agenda/delete/${p.id}`}
                      onSuccess={() => {
                        handleSuccess();
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Nenhum atendimento cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          totalItems={agenda.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default AgendaPage;
