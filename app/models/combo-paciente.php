<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

// Verifica se o parâmetro de ação foi passado
if (isset($_GET['action']) && $_GET['action'] === 'comboPaciente') {
	comboPaciente();
} else {
	echo json_encode(["success" => false, "message" => "Ação inválida"]);
	exit;
}

function comboPaciente() {
	global $conn;

	// Verifica se a conexão com o banco está ativa
	if (!$conn) {
		echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco"]);
		exit;
	}

	// Consulta ao banco
	$sql = "SELECT `id_paciente`, `nome` FROM `paciente`;";
	$result = $conn->query($sql);

	$opcoes = [];
	while ($row = $result->fetch_assoc()) {
		$opcoes[] = $row;
	}

	// Fecha a conexão antes de enviar a resposta
	$conn->close();

	// Retorna os dados em JSON
	echo json_encode($opcoes);
	exit;
}