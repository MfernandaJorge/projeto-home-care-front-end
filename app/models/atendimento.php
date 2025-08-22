<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

function novoAtendimento() {
	global $conn;

	// Verifica se a conexão com o banco está ativa
	if (!$conn) {
		echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco"]);
		exit;
	}

	// Obtém os dados enviados via JSON
	$data = json_decode(file_get_contents("php://input"), true);

	// Verifica se os campos necessários foram preenchidos
	if (empty($data["nome-profissional"]) || empty($data["nome-paciente"]) || empty($data["especialidade"]) || empty($data["medicacao"]) || 
		empty($data["cid"]) || empty($data["data_atendimento"]) || empty($data["hora_atendimento"]) ||	empty($data["observacao"])) {
		echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
		exit;
	}


	// Prepara a query para evitar SQL Injection
	$stmt = $conn->prepare(
		"INSERT INTO `atendimento` (`id_profissional`, `id_paciente`, `especialidade`, `medicacao`, `cid`, `data_atendimento`, `hora_atendimento`, `observacao`) 
			VALUES ('".$data["nome-profissional"]."', '".$data["nome-paciente"]."', '".$data["especialidade"]."', '".$data["medicacao"]."', '".$data["cid"]."', '".$data["data_atendimento"]."', '".$data["hora_atendimento"]."', '".$data["observacao"]."');"
	);

	if ($stmt->execute()) {
		echo json_encode(["success" => true, "message" => "Profissional cadastrado com sucesso!"]);

	} else {
		echo json_encode(["success" => false, "message" => "Erro ao cadastrar profissional: " . $stmt->error]);
	}

	$stmt->close();
	$conn->close();
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	novoAtendimento();

} else {
	echo json_encode(["success" => false, "message" => "Método inválido"]);
	exit;
}