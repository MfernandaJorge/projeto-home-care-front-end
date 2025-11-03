/**
 * App.js
 * Componente principal da aplicação React.
 * Gerencia o estado da aplicação e navegação entre páginas.
 */

import { useState } from "react";
import {
  FiAlignJustify,
  FiMoreVertical,
  FiCalendar,
  FiUsers,
  FiUser,
  // FiSettings,
  FiBook
} from "react-icons/fi";
import "./styles/globals.css";

import AgendaPage from "./pages/agenda/agenda";
import PacientesPage from "./pages/paciente/pacientes";
import ProfissionaisPage from "./pages/profissional/profissionais";
import MeusDadosPage from "./pages/meusDados/meusDados";
import CalendarioPage from "./pages/calendario/calendario";

function App() {
  const [menuAberto, setMenuAberto] = useState(true);
  const [currentPage, setCurrentPage] = useState("calendario");

  function handleToggleMenu() {
    setMenuAberto(!menuAberto);
  }

  return (
    <div className="App">
      {/* <div className="container"> */}
        <nav className={`sidebar ${menuAberto ? "open" : "closed"}`}>
          <button className="toggle-btn" onClick={handleToggleMenu}>
            {menuAberto ? <FiMoreVertical /> : <FiAlignJustify />}
          </button>

          <ul>
            <li>
              <button
                className={currentPage === "calendario" ? "active" : ""}
                onClick={() => setCurrentPage("calendario")}
              >
                <FiCalendar className="icon" />
                <span>Calendário</span>
              </button>
            </li>
            <li>
              <button
                className={currentPage === "agenda" ? "active" : ""}
                onClick={() => setCurrentPage("agenda")}
              >
                <FiBook className="icon" />
                <span>Agenda</span>
              </button>
            </li>
            <li>
              <button 
                className={currentPage === "pacientes" ? "active" : ""} 
                onClick={() => setCurrentPage("pacientes")}
              >
                <FiUsers className="icon" />
                <span>Pacientes</span>
              </button>
            </li>
            <li>
              <button
                className={currentPage === "profissionais" ? "active" : ""} 
                onClick={() => setCurrentPage("profissionais")}
              >
                <FiUser className="icon" />
                <span>Profissionais</span>
              </button>
            </li>
            {/* <li>
              <button
                className={currentPage === "meusDados" ? "active" : ""} 
                onClick={() => setCurrentPage("meusDados")}
              >
                <FiSettings className="icon" />
                <span>Meus Dados</span>
              </button>
            </li> */}
          </ul>
        </nav>

        {/* Conteúdo principal */}
        <main className="conteudo-principal">
          {currentPage === "calendario" && <CalendarioPage />}
          {currentPage === "agenda" && <AgendaPage />}
          {currentPage === "pacientes" && <PacientesPage />}
          {currentPage === "profissionais" && <ProfissionaisPage />}
          {/* {currentPage === "meusDados" && <MeusDadosPage />} */}
        </main>
      </div>
    // </div>
  );
}

export default App;
