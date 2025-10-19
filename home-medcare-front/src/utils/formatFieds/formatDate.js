/**
 * Formata uma data para o formato dd/MM/yy.
 * @param {string|Date} dateStr - Data em string ou objeto Date.
 * @returns {string} Data formatada ou string vazia.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";

  // Espera formato "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("T")[0].split("-");

  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
}