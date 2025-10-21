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

  const [searchMode, setSearchMode] = useState(null);
  const [selectedProfId, setSelectedProfId] = useState("");
  const [showProfDateTimeStep, setShowProfDateTimeStep] = useState(false);
  const [showPatientStep, setShowPatientStep] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);

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
    if (!formData.id_profissional || !formData.id_paciente) return;
    try {
      const payload = {
        pacienteId: Number(formData.id_paciente),
        profissionalId: Number(formData.id_profissional),
        tipoAtendimento: Number(formData.tipoAtendimento) || 2,
        diaDesejado: formData.data_agendamento || "",
        horaDesejada: formData.hora_agendamento || "",
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
      {calendario && <div className="calendario-wrapper"><Calendario agenda={agenda} /></div>}

      <OpenForm onToggle={(open) => { setFormPadrao(open); if (!open) { setSearchMode(null); setShowFullForm(false); } }} />

      {formPadrao && (
        <div className="form-padrao">
          <h3>Agendar Atendimento</h3>

          {!showFullForm && !showProfDateTimeStep && !showPatientStep && !showSimulatedTimesStep && (
            <div className="busca-opcoes">
              <div>Buscar por disponibilidade de:</div>
              <div className="busca-botoes">
                <button onClick={() => setSearchMode("profissional")}>Profissionais</button>
                <button onClick={() => { setSearchMode("dataHora"); setShowPatientStep(true); }}>Data e Hora</button>
              </div>
            </div>
          )}

          {searchMode === "profissional" && !showProfDateTimeStep && (
            <div>
              <select value={selectedProfId} onChange={e => setSelectedProfId(e.target.value)}>
                <option value="">Selecione o profissional</option>
                {profissionaisOptions.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <button onClick={() => { if (!selectedProfId) return alert("Selecione um profissional."); setFormData({ ...formData, id_profissional: selectedProfId }); setShowProfDateTimeStep(true); }}>Continuar</button>
            </div>
          )}

          {showProfDateTimeStep && (
            <div>
              <input type="date" value={formData.data_agendamento || ""} onChange={e => setFormData({ ...formData, data_agendamento: e.target.value })} />
              <select value={formData.hora_agendamento || ""} onChange={e => setFormData({ ...formData, hora_agendamento: e.target.value })}>
                <option value="">Selecione o horário</option>
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => { if (!formData.data_agendamento || !formData.hora_agendamento) return alert("Selecione data e hora."); setShowProfDateTimeStep(false); setShowPatientStep(true); }}>Continuar</button>
            </div>
          )}

          {showPatientStep && (
            <div>
              <select value={formData.id_paciente || ""} onChange={e => setFormData({ ...formData, id_paciente: e.target.value })}>
                <option value="">Selecione o paciente</option>
                {pacientesOptions.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <button onClick={() => { if (!formData.id_paciente) return alert("Selecione um paciente."); fetchSimulatedTimes(); setShowPatientStep(false); }}>Continuar</button>
            </div>
          )}

          {showSimulatedTimesStep && (
            <div>
              <select value={selectedSimulatedTime} onChange={e => setSelectedSimulatedTime(e.target.value)}>
                <option value="">Selecione o horário</option>
                {simulatedTimes.map((s, i) => <option key={i} value={s.horaInicio}>{s.data} - {s.horaInicio} ({s.tempoTotalMin} min)</option>)}
              </select>
              <button onClick={() => { if (!selectedSimulatedTime) return alert("Selecione um horário."); setFormData({ ...formData, data_agendamento: simulatedTimes.find(s => s.horaInicio === selectedSimulatedTime)?.data, hora_agendamento: selectedSimulatedTime }); setShowSimulatedTimesStep(false); setShowFullForm(true); }}>Continuar</button>
            </div>
          )}

          {showFullForm && (
            <form>
              {camposAgenda.map(field => {
                if (field.type === "select" || field.id === "id_profissional" || field.id === "id_paciente" || field.id === "hora_agendamento") {
                  return (
                    <select key={field.id} name={field.id} value={formData[field.id] || ""} onChange={handleChange} disabled={!!formData[field.id]}>
                      <option value="">{field.placeholder}</option>
                      {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  );
                }
                return <input key={field.id} type={field.type} name={field.id} placeholder={field.placeholder} value={formData[field.id] || ""} onChange={handleChange} />;
              })}

              <SaveForm endpoint={editMode ? `agenda/update/${editId}` : "/agenda/novo-agendamento"} data={{ ...formData, id_profissional: Number(formData.id_profissional), id_paciente: Number(formData.id_paciente), complexidade: Number(formData.complexidade), status_agendamento: Number(formData.status_agendamento) }} onSuccess={() => { handleSuccess(); setEditMode(false); setEditId(null); }} />
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default AgendaPage;
