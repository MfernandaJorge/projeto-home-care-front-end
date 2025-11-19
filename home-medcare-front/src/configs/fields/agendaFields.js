export const agendaFields = [
  // { name: "id", type: "number", placeholder: "Código" },
  {
    id: "id_profissional", 
    name: "id_profissional", 
    type: "select", 
    placeholder: "Profissional",
    options: []
  },{
    id: "id_paciente", 
    name: "id_paciente", 
    type: "select", 
    placeholder: "Paciente",
    options: []
  },
  { id: "complexidade", 
    name: "complexidade", 
    type: "select", 
    placeholder: "Complexidade do Atendimento",
    options: [
      { value: "1", label: "Baixa - 30min" },
      { value: "2", label: "Média - 50min" },
      { value: "3", label: "Alta - 90min" },
    ]
  },{ 
    id: "descricao", 
    name: "descricao", 
    type: "text", 
    placeholder: "Descrição do Atendimento" 
  },{ 
    id: "data_agendamento", 
    name: "data_agendamento", 
    type: "date", 
    placeholder: "Data do Agendamento" 
  },{
    id: "hora_agendamento",
    name: "hora_agendamento",
    type: "time",
    placeholder: "Hora do Agendamento" 
  },{
    id: "status_agendamento",
    name: "status_agendamento",
    type: "select",
    placeholder: "Status",
    options: [
      { value: "1", label: "Agendado" },
      { value: "2", label: "Em Andamento" },
      { value: "3", label: "Concluído" },
      { value: "4", label: "Cancelado" }
    ]
  }
];