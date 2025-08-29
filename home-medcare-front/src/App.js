
import { useState } from "react";
import { FiAlignJustify, FiMoreVertical, FiEdit3, FiTrash, FiPlus, FiX } from "react-icons/fi";
import './styles.css';

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [formProfissional, setFormProfissional] = useState(false);
  const [pagina, setPagina] = useState(false);

  function handleToggleMenu() {
    setMenuAberto(!menuAberto);
  }

  function handleToggleFormProfissional() {
    setFormProfissional(!formProfissional);
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
              <li><button onClick={() => setPagina("agenda")}>Agenda</button></li>
              <li><button onClick={() => setPagina("pacientes")}>Pacientes</button></li>
              <li><button onClick={() => setPagina("profissionais")}>Profissionais</button></li>
              <li><button onClick={() => setPagina("cadastro")}>Editar Cadastro</button></li>
            </ul>
          )}
        </nav>

        {pagina === "agenda" && (
          <div className="agenda">
            <h3>Agenda</h3>

            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Profissional</th>
                  <th>Data do Atendimento</th>
                  <th>Hora do Atendimento</th>
                  <th>Status do Atendimento</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Paciente Teste</td>
                  <td>Profissional Teste</td>
                  <td>01/01/2001</td>
                  <td>00:00</td>
                  <td>Paciente aguardando atendimento</td>
                  <td><a href="#"><FiEdit3 /></a></td>
                  <td><a href="#"><FiTrash /></a></td>
                </tr>
              </tbody>
            </table>

          </div>
        )}
        {pagina === "pacientes" && (
          <div className="pacientes">
            <h3>Pacientes</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Data de Nascimento</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Paciente Teste</td>
                  <td>123.456.789-00</td>
                  <td>email@teste.com</td>
                  <td>(99)9 9999-9999</td>
                  <td>Rua Teste, nº999, Bairro Teste, Cidade Teste-UF</td>
                  <td>01/02/2003</td>
                  <td><a href="#"><FiEdit3 /></a></td>
                  <td><a href="#"><FiTrash /></a></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {pagina === "profissionais" && (
          <div className="profissionais">
            <button onClick={handleToggleFormProfissional}>
              {formProfissional ? <FiX /> : <FiPlus /> }
            </button>

            {formProfissional && (
              <div className="form-profissional">
                <h3>Cadastrar Profissional</h3>
                <form>
                  <input type="text" placeholder="Nome" />
                  <input type="text" placeholder="Documento" />
                  <input type="email" placeholder="Email" />
                  <input type="text" placeholder="Telefone" />
                  <input type="text" placeholder="Endereço" />
                  <input type="text" placeholder="Ocupação" />
                  <button type="submit">Salvar</button>
                </form>
              </div>
            )}

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Ocupação</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Profissional Teste</td>
                  <td>123.456.789-00</td>
                  <td>email@teste.com</td>
                  <td>(99)9 9999-9999</td>
                  <td>Rua Teste, nº999, Bairro Teste, Cidade Teste-UF</td>
                  <td>Enfermeiro Teste</td>
                  <td>
                    <button className="fiEdit3">
                      <a href="#"><FiEdit3 /></a>
                    </button>
                  </td>
                  <td>
                    <button className="fiTrash">
                      <a href="#"><FiTrash /></a>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {pagina === "cadastro" && (
          <div className="cadastro"><h3>Editar Cadastro</h3></div>
        )}
      </div>
    </div>

  );
}

export default App;