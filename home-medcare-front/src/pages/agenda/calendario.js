import { useState, useEffect } from "react";
import "../../styles/globals.css";

import { formatDate } from "../../utils/formatFieds/formatDate";

import api from "../../services/api";

export default function Calendario({ agenda: agendaProp }) {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [agenda, setAgenda] = useState(agendaProp || []);
  const [eventsByDate, setEventsByDate] = useState({});
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  useEffect(() => {
    if (agendaProp) {
      setAgenda(agendaProp);
      return;
    }
    api
      .get("/agenda/all")
      .then((res) => setAgenda(res.data))
      .catch((err) => console.error("Erro ao carregar agenda do calendário:", err));
  }, [agendaProp]);

  function getDateKey(dateStr) {
    if (!dateStr) return null;
    const datePart = String(dateStr).split("T")[0].split(" ")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
    const d = new Date(dateStr);

    if (isNaN(d)) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  }

  useEffect(() => {
    const map = {};
    agenda.forEach((item) => {
      const key = getDateKey(item.data_agendamento || item.data || item.date);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    setEventsByDate(map);
  }, [agenda]);

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

  function keyForDay(d) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

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
        <h4>{selectedDateKey ? `Eventos em ${formatDate(selectedDateKey)}` : "Selecione um dia"}</h4>
        {selectedDateKey && (eventsByDate[selectedDateKey] || []).length === 0 && (
          <div className="sem-eventos">Nenhum evento neste dia.</div>
        )}
        <ul>
          {(eventsByDate[selectedDateKey] || []).map((ev) => (
            <li key={ev.id || `${ev.id_paciente}-${ev.hora_agendamento}`}>
              <strong>{ev.hora_agendamento || "Sem hora"}</strong> — Paciente:{" "}
              {String(ev.paciente || ev.id_paciente || "N/A")} — Prof:{" "}
              {String(ev.profissional || ev.id_profissional || "N/A")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}