import { useState } from "react";
import api from "../../services/api"; // seu serviço Axios

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/auth/login", { email, senha });

      // supondo que retorne { token, user }
      const { token, ...user } = response.data; // separa token e o resto dos dados

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        onLoginSuccess(user);
      } else {
        setErro("Erro ao autenticar: token não recebido.");
      }
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {erro && <p className="login-error">{erro}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
