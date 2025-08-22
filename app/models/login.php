<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Inclui a conexão com o banco

function login() {
	global $conn;

	// Verifica se a conexão com o banco está ativa
	if (!$conn) {
		echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco"]);
		exit;
	}

	// Obtendo os dados do corpo da requisição
	$data = json_decode(file_get_contents("php://input"), true);
	$user = $data['user'] ?? '';
	$password = $data['password'] ?? '';

	if (empty($user) || empty($password)) {
		echo json_encode(["success" => false, "message" => "Preencha todos os campos"]);
		exit;
	}

	// Consulta segura com prepared statements
	$stmt = $conn->prepare("SELECT id_user FROM `user` WHERE `user` = ? AND `password` = ?");
	if (!$stmt) {
		echo json_encode(["success" => false, "message" => "Erro na preparação da consulta"]);
		exit;
	}

	$stmt->bind_param("ss", $user, $password);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {
		echo json_encode(["success" => true, "message" => "Login realizado com sucesso"]);

  } else {
		echo json_encode(["success" => false, "message" => "Usuário ou senha incorretos"]);
	}

	$stmt->close();
	$conn->close();
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	login();

} else {
	echo json_encode(["success" => false, "message" => "Método inválido"]);
	exit;
}
