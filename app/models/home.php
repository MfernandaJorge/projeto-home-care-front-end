<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

function novoPaciente() {
	global $conn;

	// Verifica se a conexão com o banco está ativa
	if (!$conn) {
		echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco"]);
		exit;
	}

	// Obtém os dados enviados via JSON
	$data = json_decode(file_get_contents("php://input"), true);

	// Verifica se os campos necessários foram preenchidos
	if (
		empty($data["nome"]) || empty($data["data_nascimento"]) ||
		empty($data["documento"]) || empty($data["logradouro"]) ||
		empty($data["numero"]) || empty($data["bairro"]) ||
		empty($data["cidade"]) || empty($data["estado"])
	) {
		echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
		exit;
	}

	// Prepara a query para evitar SQL Injection
	$stmt = $conn->prepare(
		"INSERT INTO paciente (nome, data_nascimento, documento, logradouro, numero, bairro, cidade, estado) 
			VALUES ('".$data['nome']."', '".$data["data_nascimento"]."', '".$data["documento"]."', '".$data["logradouro"]."', '".$data["numero"]."', '".$data["bairro"]."', '".$data["cidade"]."', '".$data["estado"]."');"
	);

	if ($stmt->execute()) {
		echo json_encode(["success" => true, "message" => "Paciente cadastrado com sucesso!"]);

	} else {
		echo json_encode(["success" => false, "message" => "Erro ao cadastrar paciente: " . $stmt->error]);
	}

	$stmt->close();
	$conn->close();
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	novoPaciente();

} else {
	echo json_encode(["success" => false, "message" => "Método inválido"]);
	exit;
}