export function maskTelefone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  const len = digits.length;
  if (len === 0) return "";

  // menos que 3 dígitos -> apenas abre o parênteses
  if (len < 3) return `(${digits}`;

  // 3..6 -> (99) 9... ou (99) 999...
  if (len < 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  // 7..10 -> formata como (99) 9999-9999 (parcial ou completo)
  if (len <= 10) {
    // usa regex com grupos parciais
    const part = digits.replace(/(\d{2})(\d{0,4})(\d{0,4})/, function(_, a, b, c) {
      let out = `(${a}) `;
      out += b;
      if (c) out += `-${c}`;
      return out;
    });
    return part;
  }

  // 11 dígitos -> (99) 9 9999-9999 (parcial ou completo)
  return digits.replace(/(\d{2})(\d{1})(\d{0,4})(\d{0,4})/, function(_, a, b, c, d) {
    let out = `(${a}) ${b} `;
    out += c;
    if (d) out += `-${d}`;
    return out.trim();
  });
}