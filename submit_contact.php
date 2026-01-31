<?php
// Dołącz plik konfiguracyjny bazy danych
require 'db_config.php';

// Ustawienie nagłówka odpowiedzi na JSON
header('Content-Type: application/json');

// Sprawdzenie, czy metoda żądania to POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Pobranie danych JSON wysłanych z JavaScript
    $data = json_decode(file_get_contents('php://input'), true);

    // Przypisanie danych do zmiennych
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $subject = $data['subject'] ?? null; // Temat może być pusty (null)
    $message = $data['message'] ?? '';

    // Walidacja po stronie serwera
    if (!empty($name) && filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($message)) {
        
        // Przygotowanie zapytania SQL, aby zapobiec atakom SQL Injection
        $stmt = $conn->prepare("INSERT INTO kontakt (Name_Last_name, Mail, Topic, Text) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $email, $subject, $message);

        // Wykonanie zapytania
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Wiadomość została wysłana! Dziękujemy za kontakt.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Wystąpił błąd serwera. Spróbuj ponownie.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Proszę wypełnić wszystkie wymagane pola poprawnie.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Nieprawidłowe żądanie.']);
}

$conn->close();
?>