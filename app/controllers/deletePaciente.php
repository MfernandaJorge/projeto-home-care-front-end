<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	if (isset($_POST['id'])) {
		$id_paciente = intval($_POST['id']);

		$validaAtendimento = $conn->prepare("SELECT `id_atendimento` FROM `atendimento` WHERE `id_paciente` = ?");
		$validaAtendimento->bind_param("i", $id_paciente);
		$validaAtendimento->execute();
		$result = $validaAtendimento->get_result();
		$atendimentos = $result->fetch_all(MYSQLI_ASSOC);

		if ($atendimentos) {
			echo json_encode(["status" => "error", "message" => "Paciente vinculado a um atendimento! Favor, apagar atendimento primeiro!"]);
			return;

		} else {
			$stmt = $conn->prepare("DELETE FROM `paciente` WHERE `id_paciente` = ?");
			$stmt->bind_param("i", $id_paciente);

			if ($stmt->execute()) {
				echo json_encode(["status" => "success"]);

			} else {
				echo json_encode(["status" => "error", "message" => "Erro ao excluir o paciente."]);
			}

			$stmt->close();
			$conn->close();
		}

	} else {
		echo json_encode(["status" => "error", "message" => "ID do paciente não foi recebido."]);
	}
} else {
	echo json_encode(["status" => "error", "message" => "Método inválido."]);
}