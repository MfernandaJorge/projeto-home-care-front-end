/**
 *  Aba de calendário da agenda
 */
import { useState, useEffect } from "react";
import api from "../../services/api";

/**
 * Componente de calendário simples que consome os dados de agenda.
 * Pode receber a lista via prop `agenda` ou buscar /agenda/all automaticamente.
 *
 * Uso:
 *  - <Calendario />                // busca agenda do backend
 *  - <Calendario agenda={agenda} /> // recebe a lista já carregada
 */
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

  // Gera chave YYYY-MM-DD sem depender do fuso (tenta partir a string primeiro)
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
      // Ajuste aqui se o campo de data for outro
      const key = getDateKey(item.data_agendamento || item.data || item.date);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    setEventsByDate(map);
  }, [agenda]);

  function prevMonth() {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  const year = current.getFullYear();
  const month = current.getMonth(); // 0-11
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monta array para renderizar células (inclui offset)
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function keyForDay(d) {
    return `${year}-${pad(month + 1)}-${pad(d)}`;
  }

  const monthNames = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];
  const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button onClick={prevMonth}>&lt;</button>
        <strong>{monthNames[month]} {year}</strong>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center", marginBottom: 6 }}>
        {weekDays.map((w) => <div key={w} style={{ fontWeight: "600" }}>{w}</div>)}
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} style={{ minHeight: 64 }} />;
          const k = keyForDay(day);
          const events = eventsByDate[k] || [];
          const isSelected = selectedDateKey === k;
          return (
            <div
              key={k}
              onClick={() => setSelectedDateKey(k)}
              style={{
                minHeight: 64,
                padding: 6,
                borderRadius: 4,
                cursor: "pointer",
                background: isSelected ? "#eef" : "#fff",
                border: "1px solid #f0f0f0",
                position: "relative"
              }}
            >
              <div style={{ textAlign: "left", fontSize: 12 }}>{day}</div>
              {events.length > 0 && (
                <div style={{
                  position: "absolute",
                  right: 6,
                  bottom: 6,
                  background: "#1976d2",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "2px 6px",
                  fontSize: 12
                }}>
                  {events.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h4 style={{ margin: "8px 0" }}>
          {selectedDateKey ? `Eventos em ${selectedDateKey}` : "Clique em um dia para ver eventos"}
        </h4>

        {selectedDateKey && (eventsByDate[selectedDateKey] || []).length === 0 && (
          <div>Nenhum evento neste dia.</div>
        )}

        <ul style={{ paddingLeft: 16 }}>
          {(eventsByDate[selectedDateKey] || []).map((ev) => (
            <li key={ev.id || `${ev.id_paciente}-${ev.hora_agendamento}`}>
              <strong>{ev.hora_agendamento || "Sem hora"}</strong> — Paciente: {String(ev.id_paciente || ev.paciente || "N/A")} — Prof: {String(ev.id_profissional || ev.profissional || "N/A")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}