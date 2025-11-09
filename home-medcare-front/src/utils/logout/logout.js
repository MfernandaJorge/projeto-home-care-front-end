export function logout() 
{
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();

  alert("Sessão encerrada. Faça login novamente.");
  window.location.href = "/";
}