export const profissionalFields = [
  // { id:"id", name: "id", type: "number", placeholder: "Código" },
  { 
    id:"nome", 
    name: "nome", 
    type: "text", 
    placeholder: "Nome" 
  },{ 
    id:"documento", 
    name: "documento", 
    type: "text", 
    placeholder: "Documento" 
  // },{ 
  //   id:"email", 
  //   name: "email", 
  //   type: "email", 
  //   placeholder: "Email" 
  },{ 
    id: "telefone",
    name: "telefone",
    type: "number",
    placeholder: "Telefone"
  },{ 
    id:"logradouro", 
    name: "logradouro", 
    type: "text", 
    placeholder: "Logradouro" 
  },{ 
    id:"bairro", 
    name: "bairro", 
    type: "text", 
    placeholder: "Bairro" 
  },{ 
    id:"cidade", 
    name: "cidade", 
    type: "text", 
    placeholder: "Cidade" 
  },{ 
    id:"estado", 
    name: "estado", 
    type: "text", 
    placeholder: "Estado" 
  },{ 
    id:"cep", 
    name: "cep", 
    type: "text", 
    placeholder: "CEP" 
  },{ 
    id:"numero", 
    name: "numero", 
    type: "number", 
    placeholder: "Número" 
  },{ 
    id:"ocupacao", 
    name: "ocupacao", 
    type: "select",
    options: [
      { value: "1", label: "Médico" },
      { value: "2", label: "Enfermeiro" },
      { value: "4", label: "Técnico de Enfermagem" },
      { value: "5", label: "Outro" }
    ],
    placeholder: "Ocupação" 
  }
];
