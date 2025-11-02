/**
 * Página de agenda.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Concluir from "../../components/ui/buttons/concluir";
import Cancelar from "../../components/ui/buttons/cancelar";
import SaveForm from "../../components/ui/buttons/saveForm";
import Pagination from "../../components/ui/pagination/pagination";

import { formatDate } from "../../utils/formatFieds/formatDate";
import { agendaFields } from "../../configs/fields/agendaFields";
import { useState, useEffect } from "react";
import api from "../../services/api";

const AgendaPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    api.get("/agendamento/agendados?dia=2025-11-03").then(res => setAgenda(res.data)).catch(err => console.error(err));
  }, []);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgenda = agenda.slice(indexOfFirstItem, indexOfLastItem);

  const [selectedProfId, setSelectedProfId] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

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
    setSelectedProfId("");
    setCurrentStep(0);
    api.get("/agendamento/agendados?dia=2025-11-03").then(res => setAgenda(res.data));
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
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar horários disponíveis.");
    }
  };

  return (
    <div className="pagina-padrao">
      <OpenForm
        onToggle={(open) => {
          setFormPadrao(open);
          if (!open) handleSuccess();
        }}
      />

      {/* FORMULÁRIO COM STEPS */}
      {formPadrao && (
        <>
          <div className="form-stepper-container">
            {/* Barra de progresso */}
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>

            {/* Cabeçalho dos steps */}
            <div className="steps-header">
              {["Profissional", "Data e Hora", "Paciente", "Simulação", "Resumo"].map(
                (label, index) => (
                  <div
                    key={index}
                    className={`step-item ${index === currentStep - 1 ? "active" : ""} ${
                      index < currentStep - 1 ? "completed" : ""
                    }`}
                  >
                    <div className="step-circle">{index + 1}</div>
                    <span className="step-label">{label}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* STEP 0 */}
          {currentStep === 0 && (
            <div className="busca-opcoes form-padrao">
              <p>Há preferência por profissional?</p>
              <div className="form-actions">
                <button className="btn-avancar" onClick={() => setCurrentStep(1)}>
                  Sim
                </button>
                <button className="btn-avancar" onClick={() => setCurrentStep(2)}>
                  Não
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="busca-opcoes form-padrao">
              <p>Escolha um profissional:</p>
              <select
                value={selectedProfId}
                onChange={(e) => setSelectedProfId(e.target.value)}
              >
                <option value="">Selecione o profissional</option>
                {profissionaisOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <div className="form-actions">
                <button className="btn-voltar" onClick={() => setCurrentStep(0)}>
                  Voltar
                </button>
                <button
                  className="btn-avancar"
                  onClick={() => {
                    if (!selectedProfId) return alert("Selecione um profissional.");
                    setFormData({ ...formData, id_profissional: selectedProfId });
                    setCurrentStep(2);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="busca-opcoes form-padrao">
              <p>Escolha a data e o horário:</p>
              <input
                type="date"
                value={formData.data_agendamento || ""}
                onChange={(e) =>
                  setFormData({ ...formData, data_agendamento: e.target.value })
                }
              />
              <select
                value={formData.hora_agendamento || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hora_agendamento: e.target.value })
                }
              >
                <option value="">Selecione o horário</option>
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <div className="form-actions">
                <button className="btn-voltar" onClick={() => setCurrentStep(1)}>
                  Voltar
                </button>
                <button
                  className="btn-avancar"
                  onClick={() => {
                    if (!formData.data_agendamento || !formData.hora_agendamento)
                      return alert("Selecione data e hora.");
                    setCurrentStep(3);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="busca-opcoes form-padrao">
              <p>Escolha o paciente:</p>
              <select
                value={formData.id_paciente || ""}
                onChange={(e) =>
                  setFormData({ ...formData, id_paciente: e.target.value })
                }
              >
                <option value="">Selecione o paciente</option>
                {pacientesOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <div className="form-actions">
                <button className="btn-voltar" onClick={() => setCurrentStep(2)}>
                  Voltar
                </button>
                <button
                  className="btn-avancar"
                  onClick={() => {
                    if (!formData.id_paciente)
                      return alert("Selecione um paciente.");
                    fetchSimulatedTimes();
                    setCurrentStep(4);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="busca-opcoes form-padrao">
              <p>Selecione uma opção simulada:</p>
              <select
                onChange={(e) => setSelectedSimulatedTime(e.target.value)}
                value={selectedSimulatedTime}
              >
                <option value="">Selecione uma opção</option>
                {simulatedTimes.map((s) => (
                  <option
                    key={`${s.profissional}-${s.data}-${s.horaInicio}`}
                    value={s.horaInicio}
                  >
                    {`${s.profissional}, ${s.horaInicio}, ${formatDate(s.data)}`}
                  </option>
                ))}
              </select>

              <div className="form-actions">
                <button className="btn-voltar" onClick={() => setCurrentStep(3)}>
                  Voltar
                </button>
                <button
                  className="btn-avancar"
                  onClick={() => {
                    if (!selectedSimulatedTime)
                      return alert("Selecione um horário.");
                    const sim = simulatedTimes.find(
                      (s) => s.horaInicio === selectedSimulatedTime
                    );
                    setFormData({
                      ...formData,
                      data_agendamento: sim?.data,
                      hora_agendamento: selectedSimulatedTime,
                    });
                    setCurrentStep(5);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <form className="busca-opcoes form-padrao">
              {camposAgenda
                .filter((field) =>
                  ["complexidade", "descricao", "status_agendamento"].includes(
                    field.id
                  )
                )
                .map((field) => {
                  if (field.type === "select") {
                    return (
                      <select
                        key={field.id}
                        name={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
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

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-voltar"
                  onClick={() => setCurrentStep(4)}
                >
                  Voltar
                </button>
                <SaveForm
                  endpoint={
                    editMode ? `agenda/update/${editId}` : "/agendamento/agendar"
                  }
                  data={{
                    ...formData,
                    pacienteId: Number(formData.id_paciente),
                    profissionalId: formData.id_profissional
                      ? Number(formData.id_profissional)
                      : null,
                    tipoAtendimento: Number(formData.complexidade),
                    diaDesejado: formData.data_agendamento,
                    horaDesejada: formData.hora_agendamento,
                    diasSimulacao: 1,
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
        </>
      )}

      {/* TABELA */}
      {!formPadrao && (
        <div className="table-padrao">
          <h3>Agenda</h3>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Profissional</th>
                <th>Data</th>
                <th>Hora início</th>
                <th>Hora término</th>
                <th>Concluir</th>
                <th>Cancelar</th>
              </tr>
            </thead>
            <tbody>
              {currentAgenda.length > 0 ? (
                currentAgenda.map((p, index) => {
                  // Converte as datas
                  const dataInicio = new Date(p.inicio);
                  const dataFim = new Date(p.fim);

                  // Formata data e hora
                  const dataFormatada = dataInicio.toLocaleDateString("pt-BR");
                  const horaInicio = dataInicio.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const horaFim = dataFim.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={index}>
                      <td>{p.paciente}</td>
                      <td>{p.profissional}</td>
                      <td>{dataFormatada}</td>
                      <td>{horaInicio}</td>
                      <td>{horaFim}</td>
                      <td>
                        <Concluir 
                            endpoint="/agendamento/concluir"
                            agendamentoId={p.id}
                            onSuccess={() => {
                              alert(`Atendimento de ${p.paciente} concluído.`);
                            }}
                        />
                      </td>
                      <td>
                        <Cancelar
                          endpoint={`/agendamento/cancelar`}
                          agendamentoId={p.id}
                          motivo="Não especificado."
                          onSuccess={() => {
                            alert(`Atendimento de ${p.paciente} cancelado.`);
                            handleSuccess();
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">Nenhum atendimento <b>pendente</b>.</td>
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
      )}
    </div>
  );

};

export default AgendaPage;
