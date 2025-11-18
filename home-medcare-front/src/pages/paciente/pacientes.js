/**
 * Página de Pacientes.
 */

import OpenForm from "../../components/ui/buttons/openForm";
import Edit from "../../components/ui/buttons/edit";
import Delete from "../../components/ui/buttons/delete";
import SaveForm from "../../components/ui/buttons/saveForm";
import Pagination from "../../components/ui/pagination/pagination";
import SearchBar from "../../components/searchBar/SearchBar";

import { formatDate } from "../../utils/formatFieds/formatDate";
import { maskTelefone } from "../../utils/formatFieds/maskPhone";
import { maskDocs } from "../../utils/formatFieds/maskDocs";

import { pacienteFields } from "../../configs/fields/pacienteFields";
import { useState, useEffect } from "react";

import api from "../../services/api";

const PacientesPage = () => {
  const [formPadrao, setFormPadrao] = useState(false);

  const initialForm = pacienteFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      const digits = String(value).replace(/\D/g, "").slice(0, 9);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    if (name === "documento") {
      const digits = String(value).replace(/\D/g, "").slice(0, 14);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    if (name === "cep") {
      const digits = String(value).replace(/\D/g, "").slice(0, 8);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Lista de pacientes
  const [paciente, setPaciente] = useState([]);
  useEffect(() => {
    api
      .get("/paciente/all")
      .then((res) => setPaciente(res.data))
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [search, setSearch] = useState("");

  // Filtragem por nome, documento ou telefone
  const filteredPacientes = paciente.filter((p) => {
    const termo = search.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(termo) ||
      String(p.documento || "").includes(termo) ||
      String(p.telefone || "").includes(termo)
    );
  });

  // Paginação baseada na lista filtrada
  const currentPacientes = filteredPacientes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSuccess = () => {
    setFormData(initialForm);
    setFormPadrao(false); // <- volta para tabela
    setEditMode(false);
    setEditId(null);
    api.get("/paciente/all").then((res) => setPaciente(res.data));
  };

  const handleEdit = (paciente) => {
    setFormPadrao(true); // <- abre o formulário
    setEditMode(true);
    setEditId(paciente.id);

    setFormData({
      nome: paciente.nome || "",
      documento: paciente.documento || "",
      email: paciente.email || "",
      telefone: String(paciente.telefone || ""),
      dataNascimento: paciente.dataNascimento || "",
      logradouro: paciente.endereco?.logradouro || "",
      bairro: paciente.endereco?.bairro || "",
      cidade: paciente.endereco?.cidade || "",
      estado: paciente.endereco?.estado || "",
      cep: paciente.endereco?.cep || "",
      numero: paciente.endereco?.numero || "",
    });
  };

  return (
    <div className="pagina-padrao">
      {/* Botão de abrir/fechar formulário */}
      <OpenForm
        onToggle={() => {
          setFormPadrao(!formPadrao);
          setEditMode(false);
          setEditId(null);
          setFormData(initialForm);
        }}
      />

      {/* Exibe formulário OU tabela */}
      {formPadrao ? (
        <form className="form-padrao">
          <h3>{editMode ? "Editar Paciente" : "Cadastrar Paciente"}</h3>

          <div className="form-grid">
            {pacienteFields.map((field) => (
              <div className="form-field" key={field.id}>
                <label htmlFor={field.id}>{field.placeholder}</label>

                {field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                  />
                )}
          </div>
          ))}
        </div>

          <SaveForm
            endpoint={
              editMode
                ? `/paciente/update/${editId}`
                : "/paciente/cadastro"
            }
            data={{
              nome: formData.nome,
              documento: formData.documento,
              email: formData.email,
              telefone:
                Number(String(formData.telefone).replace(/\D/g, "")) || null,
              endereco: {
                logradouro: formData.logradouro,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
                cep: formData.cep,
                numero: Number(formData.numero) || null,
              },
              dataNascimento: formData.dataNascimento,
            }}
            onSuccess={handleSuccess}
          />
        </form>
      ) : (
        <div className="table-padrao">
          <h3>Pacientes</h3>
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1); // volta pra primeira página ao digitar
            }}
            onSearch={() => setCurrentPage(1)}
          />

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Documento</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Data de Nascimento</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>

            <tbody>
              {currentPacientes.length > 0 ? (
                currentPacientes.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nome}</td>
                    <td>{maskDocs(p.documento)}</td>
                    <td>{p.email}</td>
                    <td>{maskTelefone(p.telefone)}</td>
                    <td>
                      {p.endereco?.logradouro}, {p.endereco?.numero},{" "}
                      {p.endereco?.bairro}, {p.endereco?.cidade}-
                      {p.endereco?.estado}, CEP {p.endereco?.cep}
                    </td>
                    <td>{formatDate(p.dataNascimento)}</td>
                    <td>
                      <Edit onClick={() => handleEdit(p)} />
                    </td>
                    <td>
                      <Delete
                        endpoint={`/paciente/delete/${p.id}`}
                        onSuccess={handleSuccess}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Nenhum paciente encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginação baseada na lista filtrada */}
          <Pagination
            totalItems={filteredPacientes.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

      )}
    </div>
  );
};

export default PacientesPage;