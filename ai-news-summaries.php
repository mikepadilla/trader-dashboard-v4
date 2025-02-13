<?php
// Set CORS headers to allow access from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// Check if the 'tickers' parameter is provided in the URL
if (!isset($_GET['tickers'])) {
    echo json_encode(['error' => 'Tickers parameter is required.']);
    exit;
}

$tickers = explode(',', strtoupper(trim($_GET['tickers'])));

if (empty($tickers)) {
    echo json_encode(['error' => 'Invalid tickers value.']);  
    exit;
}

// Ensure each ticker is valid and non-empty
$tickers = array_filter(array_map('trim', $tickers));
if (empty($tickers)) {
    echo json_encode(['error' => 'No valid tickers provided.']);
    exit;
}

// Create a query string by mapping each ticker to the required format
$tickerQuery = implode(' ', array_map(function($ticker) {
    return "tt:$ticker";
}, $tickers));

// Construct the API URL dynamically with the new format
$apiUrl = sprintf(
    "https://api.tickertick.com/feed?q=(and(or %s) T:curated)&n=50", 
    $tickerQuery
);

// Output the API URL
//echo $apiUrl;

try {
    // Fetch news data from TickerTick API
    $apiResponse = file_get_contents($apiUrl);
    if ($apiResponse === FALSE) {
        echo json_encode(['error' => "Unable to fetch news for tickers: " . implode(', ', $tickers)]);
        exit;
    }

    $newsData = json_decode($apiResponse, true);

    // Validate the structure of the response
    if (!isset($newsData['stories']) || !is_array($newsData['stories'])) {
        echo json_encode(['error' => "Invalid data structure for the provided tickers."]);
        exit;
    }

    // Combine titles and descriptions from the response
    $combinedTitles = implode(' ', array_map(function ($story) {
    return $story['title'];
}, $newsData['stories']));


} catch (Exception $e) {
    echo json_encode(['error' => "An unexpected error occurred. Error: " . $e->getMessage()]);
    exit;
}

// OpenAI API settings
$openAiApiKey = 'sk-proj-fdvdlfgtiutggmfgoiert4544589rkgjfkldgj59'; // Replace with your API key
$openAiApiUrl = 'https://api.openai.com/v1/chat/completions';

// Prepare OpenAI API request payload
$payload = [
    'model' => 'gpt-4o',
    'messages' => [
        [
            'role' => 'user',
            'content' => "Summarize the following list of news stories as a professional stock portfolio news roundup. Present the content in the tone and style of a Wall Street Journal editor, do not actually mention Wall Street Journal, focusing on key implications for investors, relevant tickers, and any potential market impacts. Ensure the summary is concise yet insightful, catering to a business-savvy audience. Highlight noteworthy developments in corporate strategies, legal outcomes, market trends, or regulatory actions. Do not add an overall title. Here is the data:  $combinedTitles"
        ]
    ],
    'max_tokens' => 700,
    'temperature' => 0.7
];

// Make a POST request to OpenAI API
$options = [
    'http' => [
        'header' => [
            "Content-Type: application/json",
            "Authorization: Bearer $openAiApiKey"
        ],
        'method' => 'POST',
        'content' => json_encode($payload)
    ]
];
$context = stream_context_create($options);
$summaryResponse = file_get_contents($openAiApiUrl, false, $context);

if ($summaryResponse === FALSE) {
    echo json_encode(['error' => 'Unable to fetch summary from OpenAI API.']);
echo json_encode(['error' => error_get_last()]);
    exit;
}
$summaryData = json_decode($summaryResponse, true);

// Extract the summary content
if (!isset($summaryData['choices'][0]['message']['content'])) {
    echo json_encode(['error' => 'Invalid response from OpenAI API.']);
    exit;
}

$newsSummary = $summaryData['choices'][0]['message']['content'];

// Return the news summary as JSON
echo json_encode(['summary' => $newsSummary]);
?>
