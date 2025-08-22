<?php
include "../config/db.php"; // Importa a conexão com o banco
?>

<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Área da Instituição - HomeMed Care</title>

		<link rel="stylesheet" href="../../public/assets/style.css">
		<script src="../../public/assets/functions.js"></script>

		<link href='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css' rel='stylesheet' />
		<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
	</head>

	<body>
		<div class="header">
			<?php
			global $conn;

			// Consulta segura com prepared statements
			$data = $conn->prepare(
				"SELECT `is`.`razao_social` 
				FROM `instituicao_saude` `is`;"
			);
			$data->execute();
			$result = $data->get_result();
			$dados = $result->fetch_assoc();
			?>


			<h1>Bem-vindo, <span id="instituicaoNome"><?php echo $dados['razao_social']; ?></span></h1>
		</div>

		<div class="container">
			<nav class="menu">
				<button onclick="showContent('minha-agenda')">
					Agenda
				</button>
				<button onclick="showContent('meus-pacientes')">
					Pacientes
				</button>
				<button onclick="showContent('meus-profissionais')">
					Profissionais
				</button>
				<button onclick="showContent('edicao-instituicao')">
					Editar Cadastro
				</button>
			</nav>

			<div id="minha-agenda" class="content">
				<h3>Minha Agenda</h3>

				<select id="nomeProfissional">
					<option value="">Selecione um profissional</option>
					<!-- Aqui você pode popular dinamicamente via PHP -->
				</select>

				<script>
					fetch('../models/combo-profissional.php?action=comboProfissional')
					.then(response => {
						if (!response.ok) {
							throw new Error("Erro na requisição: " + response.statusText);
						}

						response.text().then(text => {
							return JSON.parse(text);
						}).then(data => {
							let select = document.getElementById('nomeProfissional');
							select.innerHTML = '<option value="">Selecione</option>';

							data.forEach(opcao => {
								let option = document.createElement('option');
								option.value = opcao.id_profissional; // Certifique-se de que a chave está correta
								option.textContent = opcao.nome;
								select.appendChild(option);
							});
						}).catch(error => console.error('Erro ao carregar opções:', error));
					});
				</script>

				<div id="calendar"></div>

				<script>
					let calendar;

					document.addEventListener('DOMContentLoaded', function () {
						const calendarEl = document.getElementById('calendar');
						calendar = new FullCalendar.Calendar(calendarEl, {
							initialView: 'dayGridMonth',
							locale: 'pt-br',
							events: carregarEventos
						});
						calendar.render();
					});

					function carregarEventos(fetchInfo, successCallback, failureCallback) {
						const profissionalId = document.getElementById('nomeProfissional').value;

						if (!profissionalId) {
							successCallback([]); // Mostra vazio se não selecionou
							return;
						}

						fetch(`../models/carregar_agendamentos.php?id_profissional=${profissionalId}`)
							.then(response => response.json())
							.then(data => successCallback(data))
							.catch(error => failureCallback(error));
					}

					document.getElementById('nomeProfissional').addEventListener('change', function () {
						calendar.refetchEvents();
					});

					calendar.today();
				</script>

				<script>
					// Exibir ou ocultar o formulário ao clicar no botão "Cadastrar Novo"
					document.addEventListener('DOMContentLoaded', function () {
						const btnAtendimento = document.getElementById("btn-meus-atendimentos");
						if (btnAtendimento) {
							btnAtendimento.addEventListener("click", function () {
								var form = document.getElementById("form-atendimento");
								form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
							});
						}
					});
				</script>
			</div>

			<div id="meus-atendimentos" class="content">
				<h3>Meus Atendimentos</h3>
				<button id="btn-meus-atendimentos">Novo</button>

				<form id="form-atendimento" class="formulario" style="display: none;">
					<label for="nome-paciente">Nome do Paciente:</label>
					<select id="nome-paciente" name="nome-paciente">
						<option value="">Selecione</option>
					</select><br><br>

					<script>
						fetch('../models/combo-paciente.php?action=comboPaciente')
						.then(response => {
							if (!response.ok) {
								throw new Error("Erro na requisição: " + response.statusText);
							}

							response.text().then(text => {
								return JSON.parse(text);
							}).then(data => {
								let select = document.getElementById('nome-paciente');
								select.innerHTML = '<option value="">Selecione</option>';

								data.forEach(opcao => {
									let option = document.createElement('option');
									option.value = opcao.id_paciente; // Certifique-se de que a chave está correta
									option.textContent = opcao.nome;
									select.appendChild(option);
								});
							}).catch(error => console.error('Erro ao carregar opções:', error));
						});
					</script>

					<label for="nome-profissional">Profissional:</label>
					<select id="nome-profissional" name="nome-profissional">
						<option value="">Selecione</option>
					</select><br><br>

					<script>
						fetch('../models/combo-profissional.php?action=comboProfissional')
						.then(response => {
							if (!response.ok) {
								throw new Error("Erro na requisição: " + response.statusText);
							}

							response.text().then(text => {
								return JSON.parse(text);
							}).then(data => {
								let select = document.getElementById('nome-profissional');
								select.innerHTML = '<option value="">Selecione</option>';

								data.forEach(opcao => {
									let option = document.createElement('option');
									option.value = opcao.id_profissional; // Certifique-se de que a chave está correta
									option.textContent = opcao.nome;
									select.appendChild(option);
								});
							}).catch(error => console.error('Erro ao carregar opções:', error));
						});
					</script>

					<label for="especialidade">Especialidade:</label>
					<input type="text" id="especialidade" name="especialidade" required><br><br>

					<label for="medicacao">Medicamento:</label>
					<input type="text" id="medicacao" name="medicacao" required><br><br>

					<label for="cid">CID:</label>
					<input type="text" id="cid" name="cid" required><br><br>

					<label for="data_atendimento">Data atendimento:</label>
					<input type="date" id="data_atendimento" name="data_atendimento" required><br><br>

					<label for="hora_atendimento">Hora atendimento:</label>
					<input type="time" id="hora_atendimento" name="hora_atendimento" required><br><br>

					<label for="observacao">Observação:</label>
					<input type="text" id="observacao" name="observacao" placeholder="Descreva a observação..." required><br><br>

					<button onclick="novoAtendimento()">Enviar</button>
				</form>

				<table class="tabela">
					<thead>
						<tr>
							<th>Nome do Paciente</th>
							<th>Nome do Profissional</th>
							<th>Especialidade</th>
							<th>Medicamento</th>
							<th>CID</th>
							<th>Data</th>
							<th>Hora</th>
							<th>Observação</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<?php
						global $conn;

						// Consulta segura com prepared statements
						$data = $conn->prepare(
							"SELECT 
								`ate`.`id_atendimento` AS `id_atendimento`,
								`pac`.`id_paciente` AS `nome_paciente`,
								`pro`.`id_profissional`	AS `nome_profissional`,
								`ate`.`especialidade` AS `especialidade`,
								`ate`.`medicacao` AS `medicacao`,
								`ate`.`cid`	AS `cid`,
								`ate`.`data_atendimento` AS `data_atendimento`,
								`ate`.`hora_atendimento` AS `hora_atendimento`,
								`ate`.`observacao` AS `observacao`
							FROM `atendimento` `ate`
							INNER JOIN `profissional` `pro` ON `ate`.`id_profissional` = `pro`.`id_profissional`
							INNER JOIN `paciente` `pac` ON `ate`.`id_paciente` = `pac`.`id_paciente`;"
						);

						$data->execute();
						$result = $data->get_result();

						// Inicialize o array de pacientes
						$pacientes = [];

						while ($row = $result->fetch_assoc()) {
								// Adiciona cada paciente ao array
								$pacientes[] = $row;
						}

						// Exemplo de como imprimir os dados em uma tabela HTML
						foreach ($pacientes as $dados) {
						?>
							<tr>
								<td><?php echo $dados['nome_profissional']; ?></td>
								<td><?php echo $dados['nome_paciente']; ?></td>
								<td><?php echo $dados['especialidade']; ?></td>
								<td><?php echo $dados['medicacao']; ?></td>
								<td><?php echo $dados['cid']; ?></td>
								<td><?php echo $dados['data_atendimento']; ?></td>
								<td><?php echo $dados['hora_atendimento']; ?></td>
								<td><?php echo $dados['observacao']; ?></td>
								<td>
									<?php $idAtendimento = $dados['id_atendimento']; ?>
									<button class="btn-excluir" onclick="excluirAtendimento('<?php echo $idAtendimento; ?>')">Excluir</button>
									<button class="btn-editar"
										onclick='editarAtendimento(<?php echo json_encode($dados); ?>)'>Editar</button>
								</td>
							</tr>
						<?php
						}
						?>
					</tbody>
				</table>

				<script>
					function editarAtendimento(dados) {
						// Exibe o formulário
						const form = document.getElementById("form-atendimento");
						form.style.display = "block";

						// Preenche os campos do formulário com os dados recebidos
						document.getElementById("nome-paciente").value = dados.id_paciente;
						document.getElementById("nome-profissional").value = dados.id_profissional;
						document.getElementById("especialidade").value = dados.especialidade;
						document.getElementById("medicacao").value = dados.medicacao;
						document.getElementById("cid").value = dados.cid;
						document.getElementById("data_atendimento").value = dados.data_atendimento;
						document.getElementById("hora_atendimento").value = dados.hora_atendimento;
						document.getElementById("observacao").value = dados.observacao;

						// Salva o ID para uso posterior (ex: enviar no backend)
						form.setAttribute("data-id-edicao", dados.id_atendimento);
					}
				</script>

				<button type="button" onclick="salvarAtendimento()">Enviar</button>

				<script>
					function salvarAtendimento() {
						const form = document.getElementById("form-atendimento");
						const idEdicao = form.getAttribute("data-id-edicao");

						const dados = {
							id: idEdicao ?? "", // vazio = novo
							paciente: document.getElementById("nome-paciente").value,
							profissional: document.getElementById("nome-profissional").value,
							especialidade: document.getElementById("especialidade").value,
							medicacao: document.getElementById("medicacao").value,
							cid: document.getElementById("cid").value,
							data: document.getElementById("data_atendimento").value,
							hora: document.getElementById("hora_atendimento").value,
							observacao: document.getElementById("observacao").value
						};

						fetch("URL_DO_SEU_BACKEND.php", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(dados)
						})
						.then(res => res.json())
						.then(resposta => {
							alert(resposta.mensagem || "Salvo com sucesso!");
							form.reset();
							form.style.display = "none";
							form.removeAttribute("data-id-edicao");
							// Opcional: recarregar lista de atendimentos
						});
					}
				</script>

				<script>
					// Exibir ou ocultar o formulário ao clicar no botão "Cadastrar Novo"
					document.addEventListener('DOMContentLoaded', function () {
						const btnAtendimento = document.getElementById("btn-meus-atendimentos");
						if (btnAtendimento) {
							btnAtendimento.addEventListener("click", function () {
								var form = document.getElementById("form-atendimento");
								form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
							});
						}
					});
				</script>
			</div>

			<div id="meus-pacientes" class="content">	
				<h3>Meus Pacientes</h3>

				<!-- Botão para cadastrar novo Pacientes -->
				<button id="btn-novo-pacientes" class="">Novo</button>

				<!-- Formulário de Novo Pacientes (inicialmente oculto) -->
				<form id="form-pacientes" class="formulario" style="display: none;" method="POST">
					<label for="nome">Nome do Paciente:</label>
					<input type="text" id="nome" name="nome" placeholder="Digite o nome..." required><br><br>

					<label for="data_nascimento">Data de Nascimento:</label>
					<input type="date" id="data_nascimento" name="data_nascimento" required><br><br>

					<label for="documento">Documento:</label>
					<input type="text" id="documento" name="documento" placeholder="Digite o documento..." required><br><br>

					<label for="logradouro">Logradouro:</label>
					<input type="text" id="logradouro" name="logradouro" placeholder="Digite o logradouro..." required><br><br>

					<label for="numero">Número:</label>
					<input type="text" id="numero" name="numero" placeholder="Digite o número..." required><br><br>

					<label for="bairro">Bairro:</label>
					<input type="text" id="bairro" name="bairro" placeholder="Digite o bairro..." required><br><br>

					<label for="cidade">Cidade:</label>
					<input type="text" id="cidade" name="cidade" placeholder="Digite o cidade..." required><br><br>

					<!-- <select id="cidade" name="cidade">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br> -->

					<label for="estado">Estado:</label>
					<input type="text" id="estado" name="estado" placeholder="Digite o estado..." required><br><br>

					<!-- <select id="estado" name="estado">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br> -->

					<button onclick="novoPaciente()">Enviar</button>
				</form>

				<!-- Tabela de Pacientes -->
				<table class="tabela">
					<thead>
						<tr>
							<th>Nome do Paciente</th>
							<th>Data de Nascimento</th>
							<th>Documento</th>
							<th>Logradouro</th>
							<th>Número</th>
							<th>Bairro</th>
							<th>Cidade</th>
							<th>Estado</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<?php
						global $conn;

						// Consulta segura com prepared statements
						$data = $conn->prepare("SELECT * FROM `paciente`;");

						$data->execute();
						$result = $data->get_result();

						// Inicialize o array de pacientes
						$pacientes = [];

						while ($row = $result->fetch_assoc()) {
							// Adiciona cada paciente ao array
							$pacientes[] = $row;
						}

						// Exemplo de como imprimir os dados em uma tabela HTML
						foreach ($pacientes as $dados) {
						?>
							<tr>
								<td><?php echo $dados['nome']; ?></td>
								<td><?php echo $dados['data_nascimento']; ?></td>
								<td><?php echo $dados['documento']; ?></td>
								<td><?php echo $dados['logradouro']; ?></td>
								<td><?php echo $dados['numero']; ?></td>
								<td><?php echo $dados['bairro']; ?></td>
								<td><?php echo $dados['cidade']; ?></td>
								<td><?php echo $dados['estado']; ?></td>
								<td>
									<?php $idPaciente = $dados['id_paciente']; ?>
									<button class="btn-excluir" onclick="excluirPaciente(<?php echo $idPaciente; ?>)">Excluir</button>
									<button class="btn-editar"
										onclick='editarPaciente(<?php echo json_encode($dados); ?>)'>Editar</button>
								</td>

							</tr>
						<?php
						}
						?>
					</tbody>
				</table>

				<script>
					// Exibir ou ocultar o formulário ao clicar no botão "Cadastrar Novo"
					document.getElementById("btn-novo-pacientes").addEventListener("click", function() {
						var form = document.getElementById("form-pacientes");
						form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
					});
				</script>

				<script>
					function novoPaciente() {
						event.preventDefault(); // Evita envio padrão

						const dados = {
							id: document.getElementById("id_paciente").value || null,
							nome: document.getElementById("nome").value,
							data_nascimento: document.getElementById("data_nascimento").value,
							documento: document.getElementById("documento").value,
							logradouro: document.getElementById("logradouro").value,
							numero: document.getElementById("numero").value,
							bairro: document.getElementById("bairro").value,
							cidade: document.getElementById("cidade").value,
							estado: document.getElementById("estado").value
						};

						fetch('../models/salvar-paciente.php', {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(dados)
						})
						.then(response => response.json())
						.then(res => {
							alert(res.mensagem);
							if (!res.erro) {
								location.reload();
							}
						})
						.catch(error => {
							alert("Erro ao salvar: " + error);
						});
					}
				</script>

				<form id="edit-pacientes" class="formulario" style="display: none;" method="POST">
					<label for="nome">Nome do Paciente:</label>
					<input type="text" id="nome" name="nome" placeholder="Digite o nome..." required><br><br>

					<label for="data_nascimento">Data de Nascimento:</label>
					<input type="date" id="data_nascimento" name="data_nascimento" required><br><br>

					<label for="documento">Documento:</label>
					<input type="text" id="documento" name="documento" placeholder="Digite o documento..." required><br><br>

					<label for="logradouro">Logradouro:</label>
					<input type="text" id="logradouro" name="logradouro" placeholder="Digite o logradouro..." required><br><br>

					<label for="numero">Número:</label>
					<input type="text" id="numero" name="numero" placeholder="Digite o número..." required><br><br>

					<label for="bairro">Bairro:</label>
					<input type="text" id="bairro" name="bairro" placeholder="Digite o bairro..." required><br><br>

					<label for="cidade">Cidade:</label>
					<input type="text" id="cidade" name="cidade" placeholder="Digite o cidade..." required><br><br>

					<!-- <select id="cidade" name="cidade">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br> -->

					<label for="estado">Estado:</label>
					<input type="text" id="estado" name="estado" placeholder="Digite o estado..." required><br><br>

					<!-- <select id="estado" name="estado">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br> -->

					<input type="hidden" id="id_paciente" name="id_paciente">

					<!-- <button onclick="editarPaciente()">Enviar</button> -->
				</form>

				<script>
					function editarPaciente(dados) {
						// Mostra o formulário
						const form = document.getElementById("edit-pacientes");
						form.style.display = "block";

						// Preenche os campos com os dados
						document.getElementById("nome").value = dados.nome;
						document.getElementById("data_nascimento").value = dados.data_nascimento;
						document.getElementById("documento").value = dados.documento;
						document.getElementById("logradouro").value = dados.logradouro;
						document.getElementById("numero").value = dados.numero;
						document.getElementById("bairro").value = dados.bairro;
						document.getElementById("cidade").value = dados.cidade;
						document.getElementById("estado").value = dados.estado;

						// Armazena o ID em um campo oculto (crie abaixo)
						document.getElementById("id_paciente").value = dados.id_paciente;
					}
				</script>
			</div>

			<div id="meus-profissionais" class="content">
				<h3>Meus Profissionais</h3>

				<!-- Botão para cadastrar novo Profissionais -->
				<button id="btn-novo-profissional" class="">Novo</button>

				<!-- Formulário de Novo Profissionais (inicialmente oculto) -->
				<form id="form-profissionais" class="formulario" style="display: none;" method="POST">
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

					<!-- <select id="cidade" name="cidade">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br> -->

					<label for="estado">Estado:</label>
					<input type="text" id="estado" name="estado" placeholder="Digite o estado..." required><br><br>

					<!-- <select id="estado" name="estado">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br> -->

					<button onclick="novoProfissional()">Enviar</button>
				</form>

				<!-- Tabela de Pacientes -->
				<table class="tabela">
					<thead>
						<tr>
							<th>Nome do Paciente</th>
							<th>Data de Nascimento</th>
							<th>Documento</th>
							<th>Ocupação</th>
							<th>Logradouro</th>
							<th>Número</th>
							<th>Bairro</th>
							<th>Cidade</th>
							<th>Estado</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<?php
						global $conn;

						// Consulta segura com prepared statements
						$data = $conn->prepare("SELECT * FROM `profissional`;");

						$data->execute();
						$result = $data->get_result();

						// Inicialize o array de pacientes
						$pacientes = [];

						while ($row = $result->fetch_assoc()) {
								// Adiciona cada paciente ao array
								$pacientes[] = $row;
						}

						// Exemplo de como imprimir os dados em uma tabela HTML
						foreach ($pacientes as $dados) {
						?>
							<tr>
								<td><?php echo $dados['nome']; ?></td>
								<td><?php echo $dados['data_nascimento']; ?></td>
								<td><?php echo $dados['documento']; ?></td>
								<td><?php echo $dados['ocupacao']; ?></td>
								<td><?php echo $dados['logradouro']; ?></td>
								<td><?php echo $dados['numero']; ?></td>
								<td><?php echo $dados['bairro']; ?></td>
								<td><?php echo $dados['cidade']; ?></td>
								<td><?php echo $dados['estado']; ?></td>
								<td>
									<?php $idProfissional = $dados['id_profissional']; ?>
									<button class="btn-excluir" onclick="excluirProfissional(<?php echo $idProfissional;?>)">Excluir</button>
								</td>
							</tr>
						<?php
						}
						?>
					</tbody>
				</table>

				<script>
					// Exibir ou ocultar o formulário ao clicar no botão "Cadastrar Novo"
					document.getElementById("btn-novo-profissional").addEventListener("click", function() {
						var form = document.getElementById("form-profissionais");
						form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
					});
				</script>
			</div>

			<div id="edicao-instituicao" class="content">
				<h3>Meu Cadastro</h3>

				<?php
				global $conn;

				// Consulta segura com prepared statements
				$data = $conn->prepare(
					"SELECT * 
					FROM `instituicao_saude` `is`
					INNER JOIN `user` `u` ON `is`.`id_user` = `u`.`id_user`;"
				);
				$data->execute();
				$result = $data->get_result();
				$dados = $result->fetch_assoc();
				?>

				<!-- Formulário de edição de cadastro -->
				<form id="form-edicao-instituicao" class="formulario" method="POST">
					<label for="razao-social">Razão Social:</label>
					<input type="text" id="razao-social" name="razao-social" value="<?php echo $dados['razao_social']; ?>" placeholder="Digite a razão social..." required><br><br>

					<label for="cnpj">CNPJ:</label>
					<input type="text" id="cnpj" name="cnpj" value="<?php echo $dados['cnpj']; ?>" placeholder="Digite o CNPJ..." required><br><br>

					<label for="email">E-mail:</label>
					<input type="email" id="email" name="email" value="<?php echo $dados['user']; ?>" placeholder="Digite o e-mail..." required><br><br>

					<label for="logradouro">Logradouro:</label>
					<input type="text" id="logradouro" name="logradouro" value="<?php echo $dados['logradouro']; ?>" placeholder="Digite o logradouro..." required><br><br>

					<label for="numero">Número:</label>
					<input type="text" id="numero" name="numero" value="<?php echo $dados['numero']; ?>" placeholder="Digite o número..." required><br><br>

					<label for="bairro">Bairro:</label>
					<input type="text" id="bairro" name="bairro" value="<?php echo $dados['bairro']; ?>" placeholder="Digite o bairro..." required><br><br>

					<label for="cidade">Cidade:</label>
					<input type="text" id="cidade" name="cidade" value="<?php echo $dados['cidade']; ?>" placeholder="Digite a cidade..." required><br><br>

					<label for="estado">Estado:</label>
					<input type="text" id="estado" name="estado" value="<?php echo $dados['estado']; ?>" placeholder="Digite a estado..." required><br><br>

					<button onclick="salvarEdicao()">Salvar</button>
				</form>
			</div>
		</div>

		<!-- <footer>
			Dados da empresa (NJRN)<br/>Nosso nomes - perfil linkedin - e-mail<br/>Simbolos das redes sociais do "sistema"
		</footer> -->
	</body>
</html>
