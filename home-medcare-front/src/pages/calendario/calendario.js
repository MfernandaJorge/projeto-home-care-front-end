import { useState, useEffect } from "react";
import "../../styles/globals.css";
import { formatDate } from "../../utils/formatFieds/formatDate";
import api from "../../services/api";

export default function Calendario() {
  // Formata data atual (YYYY-MM-DD)
  function getTodayKey() {
    const hoje = new Date();
    const y = hoje.getFullYear();
    const m = String(hoje.getMonth() + 1).padStart(2, "0");
    const d = String(hoje.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Estados
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(getTodayKey());
  const [eventsByDate, setEventsByDate] = useState({});
  const [loading, setLoading] = useState(false);

  // Função auxiliar
  function keyForDay(d) {
    const year = current.getFullYear();
    const month = current.getMonth();
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // 🔥 Busca os agendamentos ao selecionar um dia
  useEffect(() => {
    async function fetchAgenda() {
      if (!selectedDateKey) return;
      setLoading(true);
      try {
        const response = await api.get(`/agendamento/agendados?dia=${selectedDateKey}`);
        const data = response.data || [];

        // Atualiza o mapa de eventos
        setEventsByDate((prev) => ({
          ...prev,
          [selectedDateKey]: data,
        }));
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgenda();
  }, [selectedDateKey]);

  // Renderização
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthNames = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];
  const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  return (
    <div className="calendario-container form-padrao fade-in">
      <div className="calendario-header">
        <button onClick={() => setCurrent(new Date(year, month - 1, 1))}>&lt;</button>
        <h3>{monthNames[month]} {year}</h3>
        <button onClick={() => setCurrent(new Date(year, month + 1, 1))}>&gt;</button>
      </div>

      <div className="calendario-grid">
        {weekDays.map((w) => (
          <div key={w} className="calendario-dia-header">{w}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="calendario-celula vazia" />;
          const k = keyForDay(day);
          const events = eventsByDate[k] || [];
          const isSelected = selectedDateKey === k;
          return (
            <div
              key={k}
              className={`calendario-celula ${
                events.length > 0 ? "has-event" : ""
              } ${isSelected ? "selecionada" : ""}`}
              onClick={() => setSelectedDateKey(k)}
            >
              <div className="calendario-dia">{day}</div>
              {events.length > 0 && (
                <div className="calendario-contador">{events.length}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendario-eventos">
        <h4>
          {selectedDateKey
            ? `Atendimentos em ${formatDate(selectedDateKey)}`
            : "Selecione um dia"}
        </h4>

        {loading ? (
          <div className="sem-eventos">Carregando...</div>
        ) : selectedDateKey && (eventsByDate[selectedDateKey] || []).length === 0 ? (
          <div className="sem-eventos">Nenhum atendimento neste dia.</div>
        ) : (
          <ul>
            {(eventsByDate[selectedDateKey] || []).map((ev) => (
              <li key={ev.id}>
                <strong>
                  {new Date(ev.inicio).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(ev.fim).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>{" "}
                — Paciente: {ev.paciente} — Profissional: {ev.profissional}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
