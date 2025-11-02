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
      {formPadrao && (
        <form className="form-padrao">
          <h3>Editar Meus Dados</h3>
          <div className="form-grid">
            {meusDadosFields.map((field) => (
              <div className="form-field" key={field.id}>
                <label htmlFor={field.id}>{field.placeholder}</label>
                <input
                  id={field.id}
                  type={field.type}
                  name={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

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
        </form>
      )}
    </div>
  );
};

export default MeusDadosPage;
