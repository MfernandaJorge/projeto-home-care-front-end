<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<title>Área da Instituição - HomeMed Care</title>

		<link rel="stylesheet" href="public/assets/style.css">
		<script src="public/assets/functions.js"></script>
	</head>

	<body>
		<div class="header">
			<img class="logo" src="public/assets/images/logo-home-medcare.png"/>
		</div>

		<div class="container">
			<nav class="menu">
				<button onclick="showContent('inicio')">
					Início
				</button>
				<button onclick="showContent('quem-somos')">
					Quem Somos
				</button>
				<button onclick="showContent('login')">
					Login
				</button>
			</nav>

			<div id="inicio" class="content">
				<p>Bem-vindo HomeMed Care, o seu sistema de gestão de aplicação de medicamentos injetáveis no seu domicílio!</p>
			</div>

			<div id="quem-somos" class="content">
				<h3>Missão</h3>
				<p>Descrição da missão</p><br>
				<h3>Visão</h3>
				<p>Descrição da visão</p><br>
				<h3>Valores</h3>
				<p>Descrição dos valores</p>
			</div>

			<div id="login" class="content">
				<h3>Login</h3>
					<form>
						<input placeholder="Login" type="text" id="user" maxlength="30"/>
						<input placeholder="Senha" type="password" id="password" maxlength="8"/>

						<br><br><br>

						<input class="entrar-limpar" type="button" value="Entrar" onclick="login()"/>
						<input class="entrar-limpar" type="reset" value="Limpar"/>
					</form><br><br>

				<!-- <div class="container">
					<div>
						<button onclick="showContent('nao-tem-cadastro')"><i class="fas fa-notes-medical"></i> Não tenho cadastro</button>
					</div>

					<div id="nao-tem-cadastro" class="content">
						<h3>Nova Instituição</h3>
						<form id="form-instituicao" class="formulario" style="display: none;" method="POST">
							<label for="nome">Nome do Profissional:</label>
							<input type="text" id="nome" name="nome" placeholder="Digite o nome..." required><br><br>

							<label for="data_nascimento">Data de Nascimento:</label>
							<input type="date" id="data_nascimento" name="data_nascimento" required><br><br>

							<label for="documento">Documento:</label>
							<input type="text" id="documento" name="documento" placeholder="Digite o documento..." required><br><br>

							<label for="ocupacao">Ocupação:</label>
							<input type="text" id="ocupacao" name="ocupacao" placeholder="Digite o ocupação..." required><br><br>

							<label for="logradouro">Logradouro:</label>
							<input type="text" id="logradouro" name="logradouro" placeholder="Digite o logradouro..." required><br><br>

							<label for="numero">Número:</label>
							<input type="text" id="numero" name="numero" placeholder="Digite o número..." required><br><br>

							<label for="bairro">Bairro:</label>
							<input type="text" id="bairro" name="bairro" placeholder="Digite o bairro..." required><br><br>

							<label for="cidade">Cidade:</label>
							<input type="text" id="cidade" name="cidade" placeholder="Digite o cidade..." required><br><br>

							<label for="estado">Estado:</label>
							<input type="text" id="estado" name="estado" placeholder="Digite o estado..." required><br><br>

							<button onclick="novoProfissional()">Enviar</button>
						</form>
					</div>
				</div> -->
			</div>
		</div>

		<footer>
			<p>NJRN - <a href="#">njrn.com.br</a></p>
		</footer>

		<script>
			document.addEventListener("DOMContentLoaded", function () {
			const buttons = document.querySelectorAll(".menu button");

				buttons.forEach(button => {
					button.addEventListener("click", function () {
						buttons.forEach(btn => btn.classList.remove("active"));
						this.classList.add("active");
					});
				});
			});
		</script>
	</body>
</html>