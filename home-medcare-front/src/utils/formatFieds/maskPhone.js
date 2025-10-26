export function maskTelefone(value) {
 const digits = String(value).replace(/\D/g, "");

  if (digits.length === 9) {
    return digits.replace(/(\d{1})(\d{4})(\d{3})/, "$1 $2-$3");
  }

  if (digits.length === 8) {
    return digits.replace(/(\d{4})(\d{4})/, "$1-$2");
  }

  return digits;
}