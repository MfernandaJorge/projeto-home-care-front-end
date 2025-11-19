/**
 * Página de agenda.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Concluir from "../../components/ui/buttons/concluir";
import Cancelar from "../../components/ui/buttons/cancelar";
import SaveForm from "../../components/ui/buttons/saveForm";
import Pagination from "../../components/ui/pagination/pagination";

import { formatDate } from "../../utils/formatFieds/formatDate";
import SelectSearch from "../../components/selectSearch/selectSearch";

import { agendaFields } from "../../configs/fields/agendaFields";
import { useState, useEffect } from "react";
import api from "../../services/api";

const AgendaPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [agenda, setAgenda] = useState([]);

  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0] // data de hoje
  );

  const fetchAgenda = async (data = dataSelecionada) => {
    setLoadingAgenda(true);
    try {
      const res = await api.get(`/agendamento/agendados?dia=${data}`);
      setAgenda(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar agenda:", err);
    } finally {
      setLoadingAgenda(false);
    }
  };

  useEffect(() => {
    fetchAgenda(dataSelecionada);
  }, [dataSelecionada]);

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

  const possibleTimes = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00",
    "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00",
    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "23:00", "23:30"
  ];

  const initialForm = agendaFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
  const [formData, setFormData] = useState(initialForm);

  const [loadingAgenda, setLoadingAgenda] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!selectedProfId) {
      setAvailableTimes(possibleTimes);
      return;
    }
    const dateKey = (formData.data_agendamento || "").split("T")[0];
    const booked = agenda
      .filter((a) => String(a.id_profissional) === String(selectedProfId))
      .filter((a) =>
        dateKey ? (a.data_agendamento || "").split("T")[0] === dateKey : true
      )
      .map((a) => String(a.hora_agendamento || "").trim());
    setAvailableTimes(possibleTimes.filter((t) => !booked.includes(t)));
  }, [selectedProfId, formData.data_agendamento, agenda]);

  const jornadaOptions = {
    1: "Seg à Sex - 07h às 17h",
    2: "Seg à Sex - 17h às 03h",
    3: "Sáb à Dom - 08h às 15h"
  };
  const [profissionaisOptions, setProfissionaisOptions] = useState([]);
  const [pacientesOptions, setPacientesOptions] = useState([]);

  useEffect(() => {
    api
      .get("/profissional/all")
      .then((res) => setProfissionaisOptions(res.data))
      .catch((err) => console.error(err));

    api
      .get("/paciente/all")
      .then((res) => setPacientesOptions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const camposAgenda = agendaFields.map((field) => {
    if (field.id === "id_profissional")
      return {
        ...field,
        options: profissionaisOptions.map((p) => ({
          value: p.id,
          label: `${p.nome} — ${jornadaOptions[p.jornadaId] || ""}`,
        })),
      };

    if (field.id === "id_paciente")
      return {
        ...field,
        options: pacientesOptions.map((p) => ({
          value: p.id,
          label: p.nome,
        })),
      };

    return field;
  });

  const handleSuccess = () => {
    setFormData({});
    setFormPadrao(false);
    setSelectedProfId("");
    setCurrentStep(0);
    fetchAgenda(dataSelecionada);
  };

  const fetchSimulatedTimes = async () => {
    if (
      !formData.data_agendamento ||
      !formData.hora_agendamento ||
      !formData.id_paciente
    )
      return;
    try {
      const payload = {
        pacienteId: Number(formData.id_paciente),
        profissionalId: Number(formData.id_profissional) || null,
        tipoAtendimento: Number(formData.tipoAtendimento) || 2,
        diaDesejado: formData.data_agendamento || "",
        horaDesejada:
          formData.hora_agendamento.includes(":") &&
          formData.hora_agendamento.length === 5
            ? `${formData.hora_agendamento}:00`
            : formData.hora_agendamento
      };

      console.log('payload: ', payload);
      const res = await api.post("/agendamento/simular", payload);
      const data = res.data || [];
      console.log('data: ', data);

      if (!data.length) {
        alert("Não há disponibilidade.  Favor, consultar a agenda, e selecionar outro horário.");
        setCurrentStep(2);
        return;
      }

      setSimulatedTimes(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar horários disponíveis.");
    }
  };

  function parseDateLocal(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

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

          {/* STEP 1: Profissional */}
          {currentStep === 1 && (
            <div className="busca-opcoes form-padrao">
              <p>Escolha um profissional:</p>
              <div className="select-wrapper">
                <SelectSearch
                  label="Selecione o profissional"
                  value={selectedProfId}
                  onChange={(e) => setSelectedProfId(e.target.value)}
                  options={profissionaisOptions.map((p) => ({
                    value: p.id, // ID do profissional
                    label: `${p.nome} — ${jornadaOptions[p.jornadaId] || ""}`,
                  }))}
                />
              </div>
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

          {/* STEP 2: Data e Hora */}
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
                    const { data_agendamento, hora_agendamento } = formData;
                    if (!data_agendamento || !hora_agendamento)
                      return alert("Selecione data e hora.");

                    const [year, month, day] = data_agendamento.split("-").map(Number);
                    const [hour, minute] = hora_agendamento.split(":").map(Number);
                    const selectedDateTime = new Date(year, month - 1, day, hour, minute);

                    if (selectedDateTime < new Date()) {
                      alert("A data e hora selecionadas não podem ser anteriores ao momento atual.");
                      setFormData({ ...formData, data_agendamento: "", hora_agendamento: "" });
                      return;
                    }

                    setCurrentStep(3);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Paciente e Complexidade */}
          {currentStep === 3 && (
            <div className="busca-opcoes form-padrao">
              <p>Escolha o paciente:</p>
              <SelectSearch
                label="Selecione o paciente"
                value={formData.id_paciente || ""}
                onChange={(e) => setFormData({ ...formData, id_paciente: e.target.value })}
                options={pacientesOptions.map((p) => ({
                  value: p.id, // ID do paciente
                  label: p.nome,
                }))}
              />

              <p>Escolha complexidade do atendimento:</p>
              <SelectSearch
                label="Selecione a complexidade"
                value={formData.complexidade || ""}
                onChange={(e) => setFormData({ ...formData, complexidade: e.target.value })}
                options={agendaFields
                  .find((f) => f.id === "complexidade")
                  ?.options?.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
              />

              <div className="form-actions">
                <button className="btn-voltar" onClick={() => setCurrentStep(2)}>
                  Voltar
                </button>
                <button
                  className="btn-avancar"
                  onClick={() => {
                    if (!formData.id_paciente) return alert("Selecione um paciente.");
                    if (!formData.complexidade) return alert("Selecione a complexidade.");

                    fetchSimulatedTimes();
                    setCurrentStep(4);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Simulação */}
          {currentStep === 4 && (
            <div className="busca-opcoes form-padrao">
              <p>Selecione uma opção simulada:</p>
              <SelectSearch
                label="Selecione uma opção"
                value={selectedSimulatedTime || ""}
                onChange={(e) => setSelectedSimulatedTime(e.target.value)}
                options={simulatedTimes.map((s, index) => ({
                  value: `${s.profissionalId}-${s.horaInicio}-${index}`, // combina IDs + índice para garantir unicidade
                  label: `${s.profissional}, ${s.horaInicio}, ${formatDate(s.data)}`,
                }))}
              />

              <div className="form-actions">
                <button className="btn-voltar" onClick={() => setCurrentStep(3)}>
                  Voltar
                </button>
                <button
                  className="btn-avancar"
                  onClick={() => {
                    if (!selectedSimulatedTime) return alert("Selecione um horário.");
                    const [profissionalId, horaInicio] = selectedSimulatedTime.split("-");
                    const sim = simulatedTimes.find(
                      (s) => s.profissionalId.toString() === profissionalId && s.horaInicio === horaInicio
                    );
                    setFormData({
                      ...formData,
                      data_agendamento: sim?.data,
                      hora_agendamento: sim?.horaInicio,
                      id_profissional: sim?.profissionalId,
                    });
                    setCurrentStep(5);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmação */}
          {currentStep === 5 && (
            <form className="busca-opcoes form-padrao">
              {camposAgenda
                .filter((field) => ["descricao", "status_agendamento"].includes(field.id))
                .map((field) => (
                  <div key={field.id} className="form-field">
                    <p>{field.placeholder}</p>
                    {field.type === "select" ? (
                      <select
                        name={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((o, index) => (
                          <option key={`${o.value}-${index}`} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.id}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}

              <div className="form-actions">
                <button type="button" className="btn-voltar" onClick={() => setCurrentStep(4)}>
                  Voltar
                </button>

                <SaveForm
                  endpoint={editMode ? `agenda/update/${editId}` : "/agendamento/agendar"}
                  data={{
                    ...formData,
                    pacienteId: Number(formData.id_paciente),
                    profissionalId: Number(formData.id_profissional),
                    tipoAtendimento: Number(formData.complexidade),
                    diaDesejado: formData.data_agendamento,
                    horaDesejada: formData.hora_agendamento,
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

      {/* CAMPO DE SELEÇÃO DE DATA */}
      {!formPadrao && (
        <div className="form-group">
          <div className="campo-data">
            <label style={{ marginRight: "8px", fontWeight: "bold" }}>
              Selecione a data:
            </label>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
        </div>
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
                  const dataInicio = new Date(p.inicio);
                  const dataFim = new Date(p.fim);

                  // Formata data e hora.
                  const dataFormatada = dataInicio.toLocaleDateString("pt-BR");
                  const horaInicio = dataInicio.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const horaFim = dataFim.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const isCancelado = p.cancelado === true;
                  const isConcluido = p.concluido === true;

                  let rowStyle = {};

                  if (isCancelado) {
                    rowStyle = { backgroundColor: "#4b2525ff" };

                  } else {
                    if (isConcluido) rowStyle = { backgroundColor: "#048a83ff" };
                  }

                  const disableButtons = isCancelado || isConcluido;

                  return (
                    <tr key={index} style={rowStyle}>
                      <td>{p.paciente}</td>
                      <td>{p.profissional}</td>
                      <td>{dataFormatada}</td>
                      <td>{horaInicio}</td>
                      <td>{horaFim}</td>
                      <td>
                        <Concluir
                          endpoint={`/agendamento/concluir/${p.id}`}
                          onSuccess={() => {
                            alert(`Atendimento de ${p.paciente} concluído.`);
                            handleSuccess();
                          }}
                          disabled={disableButtons}
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
                          disabled={disableButtons}
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
