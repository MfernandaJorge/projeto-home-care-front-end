<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

function salvarEdicao() {
	global $conn;

	// Verifica se a conexão com o banco está ativa
	if (!$conn) {
		echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco"]);
		exit;
	}

	// Obtém os dados enviados via JSON
	$data = json_decode(file_get_contents("php://input"), true);

	// Prepara a query para evitar SQL Injection
	$updateForm = $conn->prepare(
		"UPDATE `instituicao_saude` SET `razao_social`='".$data['razao-social']."', `cnpj`='".$data['cnpj']."', `logradouro`='".$data['logradouro']."', `numero`='".$data['numero']."', `bairro`='".$data['bairro']."', `cidade`='".$data['cidade']."', `estado`='".$data['estado']."';"
	);

	if ($data['email']) {
		$updateUser = $conn->prepare(
			"UPDATE `user` SET `user`='".$data['email']. "';"
		);
		$updateUser->execute();
		$updateUser->close();
}

	if ($updateForm->execute()) {
		echo json_encode(["success" => true, "message" => "Profissional cadastrado com sucesso!"]);

	} else {
		echo json_encode(["success" => false, "message" => "Erro ao cadastrar profissional: " . $updateForm->error]);
	}

	$updateForm->close();
	$conn->close();
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	salvarEdicao();

} else {
	echo json_encode(["success" => false, "message" => "Método inválido"]);
	exit;
}