<!DOCTYPE html>
<html lang="pt">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Cadastro de Atendimento</title>

	<link rel="stylesheet" href="../../public/assets/style.css">
	<script src="../../public/assets/functions.js"></script>

</head>
	<body>
		<!-- Modal (Janela flutuante) -->
		<div id="modal" class="modal">
			<div class="modal-content">
				<span class="close">&times;</span>
				<h2>Cadastro de Atendimento</h2>

				<!-- Formulário dentro do Modal -->
				<form id="form-atendimento">
					<label for="nome-paciente">Nome do Paciente:</label>
					<input type="text" id="nome-paciente" name="nome-paciente" placeholder="Digite o nome..." required><br><br>

					<label for="data">Data:</label>
					<input type="date" id="data" name="data" required><br><br>

					<label for="especialidade">Especialidade:</label>
					<select id="especialidade" name="especialidade">
						<option value="">Selecione</option>
						<option value="cardiologia">Cardiologia</option>
						<option value="neurologia">Neurologia</option>
						<option value="pediatria">Pediatria</option>
					</select><br><br>

					<label for="profissional">Profissional:</label>
					<select id="profissional" name="profissional">
						<option value="">Selecione</option>
						<option value="medico1">Dr. João Silva</option>
						<option value="medico2">Dra. Maria Oliveira</option>
					</select><br><br>

					<label for="medicamento">Medicamento:</label>
					<select id="medicamento" name="medicamento">
						<option value="">Selecione</option>
						<option value="med1">Medicamento A</option>
						<option value="med2">Medicamento B</option>
					</select><br><br>

					<label for="cid">CID:</label>
					<input type="text" id="cid" name="cid" placeholder="Código CID..." required><br><br>

					<button type="submit">Enviar</button>
				</form>
			</div>
		</div>

	</body>
</html>