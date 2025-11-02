import {
  FiAlignJustify,
  FiMoreVertical,
  FiCalendar,
  FiUsers,
  FiUser,
  FiSettings,
} from "react-icons/fi";

function Sidebar({ menuAberto, handleToggleMenu, setPagina }) {
  return (
    <nav className={`sidebar ${menuAberto ? "open" : "closed"}`}>
      {/* Botão de abrir/fechar */}
      <button className="toggle-btn" onClick={handleToggleMenu}>
        {menuAberto ? <FiMoreVertical /> : <FiAlignJustify />}
      </button>

      {/* Menu principal */}
      <ul>
        <li>
          <button onClick={() => setPagina("calendario")} data-title="Calendário">
            <FiCalendar className="icon" />
            {menuAberto && <span>Calendário</span>}
          </button>
        </li>

        <li>
          <button onClick={() => setPagina("agenda")} data-title="Agenda">
            <FiCalendar className="icon" />
            {menuAberto && <span>Agenda</span>}
          </button>
        </li>

        <li>
          <button onClick={() => setPagina("pacientes")} data-title="Pacientes">
            <FiUsers className="icon" />
            {menuAberto && <span>Pacientes</span>}
          </button>
        </li>

        <li>
          <button onClick={() => setPagina("profissionais")} data-title="Profissionais">
            <FiUser className="icon" />
            {menuAberto && <span>Profissionais</span>}
          </button>
        </li>

        <li>
          <button onClick={() => setPagina("meusDados")} data-title="Meus Dados">
            <FiSettings className="icon" />
            {menuAberto && <span>Meus Dados</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
