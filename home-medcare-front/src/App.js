/**
 * App.js
 * Componente principal da aplicação React.
 * Gerencia o estado da aplicação, navegação entre páginas.
 */
import { useState } from "react";
import { FiAlignJustify, FiMoreVertical } from "react-icons/fi";
import "./styles/globals.css";

// Import das páginas
import AgendaPage from "./pages/agenda/agenda";
import PacientesPage from "./pages/paciente/pacientes";
import ProfissionaisPage from "./pages/profissional/profissionais";
import AtendimentosPage from "./pages/atendimento/atendimento";

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [pagina, setPagina] = useState(false);

  // button: abre/fecha menu
  function handleToggleMenu() {
    setMenuAberto(!menuAberto);
  }

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">Bem-vindo, [nome da empresa]</h1>
      </div>

      <div className="container">
        <nav className="navbar">
          <button onClick={handleToggleMenu}>
            {menuAberto ? <FiMoreVertical /> : <FiAlignJustify />}
          </button>

          {menuAberto && (
            <ul>
              <li> <button onClick={() => setPagina("agenda")}>Agenda</button> </li>
              <li> <button onClick={() => setPagina("pacientes")}>Pacientes</button> </li>
              <li> <button onClick={() => setPagina("profissionais")}>Profissionais</button> </li>
              <li> <button onClick={() => setPagina("novo-atendimento")}>Novos Atendimentos</button> </li>
              <li> <button onClick={() => setPagina("cadastro")}>Editar Cadastro</button> </li>
            </ul>
          )}
        </nav>

        {pagina === "agenda" && ( < AgendaPage />  )}
        {pagina === "pacientes" && ( < PacientesPage />)}
        {pagina === "profissionais" && ( < ProfissionaisPage /> )}
        {pagina === "novo-atendimento" && ( < AtendimentosPage /> )}
      </div>
    </div>
  );
}

export default App;
