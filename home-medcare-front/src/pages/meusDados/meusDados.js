/**
 * Página Meus Dados.
 */

import SaveForm from "../../components/ui/buttons/saveForm";
import { meusDadosFields } from "../../configs/fields/meusDadosFields";
import { useState } from "react";

const MeusDadosPage = () => {
  const [formPadrao, setFormPadrao] = useState(true);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "documento") {
      const digits = String(value).replace(/\D/g, "").slice(0, 14);
      setFormData({ ...formData, [name]: digits });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSuccess = () => {
    setFormPadrao(true);
  };

  return (
    <div className="pagina-padrao">
      {formPadrao ? (
        <div className="form-padrao">
          <h3>Editar Meus Dados</h3>

          <form>
            {meusDadosFields.map((field) => (
              <input
                key={field.id}
                type={field.type}
                name={field.id}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={handleChange}
              />
            ))}

            <SaveForm
              endpoint={"/meusDados/update/"}
              data={{
                razao_social: formData.razao_social || "",
                cnpj: formData.cnpj || "",
                nome_responsavel: formData.nome_responsavel || "",
                documento_responsavel: formData.documento_responsavel || "",
              }}
              onSuccess={handleSuccess}
            />

            <button
              type="button"
              className="botao-secundario"
              onClick={() => setFormPadrao(false)}
            >
              Editar usuário e senha
            </button>
          </form>
        </div>
      ) : (
        <div className="form-padrao">
          <h3>Alterar Usuário e Senha</h3>

          <form>
            <input
              type="text"
              name="usuario"
              placeholder="Novo usuário"
              value={formData.usuario || ""}
              onChange={handleChange}
            />

            <input
              type="password"
              name="senha"
              placeholder="Nova senha"
              value={formData.senha || ""}
              onChange={handleChange}
            />

            <SaveForm
              endpoint={"/meusDados/updateLogin"}
              data={{
                usuario: formData.usuario || "",
                senha: formData.senha || "",
              }}
              onSuccess={handleSuccess}
            />

            <button
              type="button"
              className="botao-voltar"
              onClick={() => setFormPadrao(true)}
            >
              Voltar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MeusDadosPage;
