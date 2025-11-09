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
    type: "select", 
    options: [
      { value: "AC", label: "Acre - AC"},
      { value: "AL", label: "Alagoas - AL"},
      { value: "AP", label: "Amapá - AP"},
      { value: "AM", label: "Amazonas - AM"},
      { value: "BA", label: "Bahia - BA"},
      { value: "CE", label: "Ceará - CE"},
      { value: "ES", label: "Espírito Santo - ES"},
      { value: "GO", label: "Goiás - GO"},
      { value: "MA", label: "Maranhão - MA"},
      { value: "MT", label: "Mato Grosso - MT"},
      { value: "MS", label: "Mato Grosso do Sul - MS"},
      { value: "MG", label: "Minas Gerais - MG"},
      { value: "PA", label: "Pará - PA"},
      { value: "PB", label: "Paraíba - PB"},
      { value: "PR", label: "Paraná - PR"},
      { value: "PE", label: "Pernambuco - PE"},
      { value: "PI", label: "Piauí - PI"},
      { value: "RJ", label: "Rio de Janeiro - RJ"},
      { value: "RN", label: "Rio Grande do Norte - RN"},
      { value: "RS", label: "Rio Grande do Sul - RS"},
      { value: "RO", label: "Rondônia - RO"},
      { value: "RR", label: "Roraima - RR"},
      { value: "SC", label: "Santa Catarina - SC"},
      { value: "SP", label: "São Paulo - SP"},
      { value: "SE", label: "Sergipe - SE"},
      { value: "TO", label: "Tocantins - TO"},
      { value: "DF", label: "Distrito Federal - DF"}
    ],
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
