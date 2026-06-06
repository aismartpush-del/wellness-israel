<?php
/**
 * Wellness Israel — Contact Form Handler
 * Отправляет заявку на israwellness@gmail.com
 */

// --- Настройки ---
define('TO_EMAIL',   'israwellness@gmail.com');
define('FROM_EMAIL', 'no-reply@wellness.co.il');
define('FROM_NAME',  'Wellness Israel');
define('SITE_URL',   'https://wellness.co.il');

// --- CORS и заголовки ---
header('Content-Type: application/json; charset=utf-8');

// Разрешаем запросы только с нашего домена
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed = ['https://wellness.co.il', 'https://www.wellness.co.il'];
if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// --- Получаем данные ---
$input = json_decode(file_get_contents('php://input'), true);

// Поддержка и JSON и обычного POST
if (!$input) {
    $input = $_POST;
}

$name    = isset($input['name'])    ? trim(strip_tags($input['name']))    : '';
$phone   = isset($input['phone'])   ? trim(strip_tags($input['phone']))   : '';
$topics  = isset($input['topics'])  ? $input['topics']                    : [];
$consent = isset($input['consent']) ? (bool)$input['consent']             : false;

// --- Валидация ---
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Укажите имя']);
    exit;
}

if (empty($phone)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Укажите телефон']);
    exit;
}

if (!$consent) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Необходимо согласие на обработку данных']);
    exit;
}

// Очищаем массив тем
if (is_array($topics)) {
    $allowed_topics = ['Эксперт-партнёр', 'Запись в Wellness Club', 'Мероприятие'];
    $topics = array_filter($topics, function($t) use ($allowed_topics) {
        return in_array($t, $allowed_topics);
    });
    $topics_str = implode(', ', $topics);
} else {
    $topics_str = '';
}

if (empty($topics_str)) {
    $topics_str = 'не указано';
}

// --- Формируем письмо ---
$subject = 'Новая заявка с сайта Wellness Israel — ' . $name;

$body  = "Новая заявка с сайта wellness.co.il\n";
$body .= str_repeat('=', 40) . "\n\n";
$body .= "Имя:     " . $name . "\n";
$body .= "Телефон: " . $phone . "\n";
$body .= "Тема:    " . $topics_str . "\n\n";
$body .= str_repeat('-', 40) . "\n";
$body .= "Дата: " . date('d.m.Y H:i') . " (серверное время)\n";
$body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// --- Заголовки письма ---
$headers  = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . FROM_EMAIL . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

// --- Отправка ---
$sent = mail(TO_EMAIL, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ошибка отправки. Попробуйте написать напрямую в WhatsApp.']);
}
?>
