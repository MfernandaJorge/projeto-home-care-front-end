<?php
$host = "localhost";
$user = "root"; // Usuário do banco de dados
$pass = ""; // Senha do banco de dados (caso tenha)
$dbname = "home_medcare"; // Nome do banco de dados

// Criar conexão
$conn = new mysqli($host, $user, $pass, $dbname);

// Verifica conexão
if ($conn->connect_error) {
	die(json_encode(["success" => false, "message" => "Erro de conexão: " . $conn->connect_error]));
}