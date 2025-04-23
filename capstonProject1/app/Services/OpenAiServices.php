<?php

namespace App\Services;

use OpenAI;

class OpenAiServices
{
    private $client;

    public function __construct()
    {
        $apiKey = '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';

        if (!$apiKey) {
            \Illuminate\Support\Facades\Log::error('API key is missing.');
            throw new \Exception('API key is missing.');
        }

        $this->client = OpenAI::client($apiKey);
    }

    public function analyzeCrypto(array $crypto): array
    {
        try {
            $cryptoDescription = "{$crypto['name']} ({$crypto['symbol']}) is currently trading at \${$crypto['current_price']} " .
                "with a total market capitalization of \${$crypto['market_cap']}. Over the past 24 hours, the price has changed by " .
                "{$crypto['price_change_percentage_24h']}%. Over the last 7 days, the price has changed by " .
                "{$crypto['price_change_percentage_7d']}%, and over the last 30 days, it has changed by " .
                "{$crypto['price_change_percentage_30d']}%.";

            $prompt = "
            Analyze the following cryptocurrency data in detail and provide recommendations based on short-term and long-term trends:

            Coin Details:
            - Name: {$crypto['name']}
            - Symbol: {$crypto['symbol']}
            - Current Price: \${$crypto['current_price']}
            - Market Cap: \${$crypto['market_cap']}
            - 24h Price Change: {$crypto['price_change_percentage_24h']}%
            - 7d Price Change: {$crypto['price_change_percentage_7d']}%
            - 30d Price Change: {$crypto['price_change_percentage_30d']}%

            Provide:
            1. Percentages for Buy/Sell recommendations based on:
                - 1-day trend
                - 7-day trend
                - 30-day trend
            2. At least 10 Oscillators:
                - Name
                - Value
                - Action (e.g., Buy, Sell, Neutral)
            3. At least 10 Moving Averages:
                - Name
                - Value
                - Action (e.g., Buy, Sell, Neutral)
            4. Additional Analysis:
                - Highlight potential risks and opportunities for investors.
                - Identify whether the coin is showing strong support or resistance levels.
                - Evaluate whether market sentiment aligns with the provided data.

            Additionally, provide a one-paragraph summary description about the cryptocurrency based on the data above.

            Ensure:
            - All output is strictly in JSON format.
            - Avoid generic or placeholder values like 50/50 unless strongly justified by the data.
            - Use realistic percentages and trends.

            Example Output:
            {
                \"percentages\": {
                    \"1_day\": { \"buy\": X, \"sell\": Y },
                    \"7_day\": { \"buy\": X, \"sell\": Y },
                    \"30_day\": { \"buy\": X, \"sell\": Y }
                },
                \"oscillators\": [
                    { \"name\": \"RSI (14)\", \"value\": X.XX, \"action\": \"Neutral\" },
                    { \"name\": \"Momentum (10)\", \"value\": X.XX, \"action\": \"Buy\" }
                ],
                \"moving_averages\": [
                    { \"name\": \"EMA (10)\", \"value\": X.XX, \"action\": \"Buy\" },
                    { \"name\": \"SMA (30)\", \"value\": X.XX, \"action\": \"Sell\" }
                ],
                \"description\": \"One-paragraph summary of the cryptocurrency analysis.\"
            }
            ";

            \Illuminate\Support\Facades\Log::info('Prompt Sent to OpenAI: ' . $prompt);

            $response = $this->client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a cryptocurrency market analysis expert.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

            $message = $response['choices'][0]['message']['content'] ?? null;

            if (!$message) {
                \Illuminate\Support\Facades\Log::error('No response received from OpenAI.');
                throw new \Exception('No response from OpenAI.');
            }

            \Illuminate\Support\Facades\Log::info('Raw OpenAI Response: ' . $message);

            $jsonStart = strpos($message, '{');
            $jsonEnd = strrpos($message, '}');
            if ($jsonStart === false || $jsonEnd === false) {
                \Illuminate\Support\Facades\Log::error('Response does not contain valid JSON: ' . $message);
                throw new \Exception('Response does not contain valid JSON.');
            }

            $jsonContent = substr($message, $jsonStart, $jsonEnd - $jsonStart + 1);
            $parsedResponse = json_decode($jsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                \Illuminate\Support\Facades\Log::error('JSON decode error: ' . json_last_error_msg());
                \Illuminate\Support\Facades\Log::error('Extracted JSON: ' . $jsonContent);
                throw new \Exception('Invalid JSON response from OpenAI.');
            }

            $parsedResponse['percentages'] = $parsedResponse['percentages'] ?? [
                '1_day' => ['buy' => 0, 'sell' => 0],
                '7_day' => ['buy' => 0, 'sell' => 0],
                '30_day' => ['buy' => 0, 'sell' => 0],
            ];
            $parsedResponse['oscillators'] = $parsedResponse['oscillators'] ?? [];
            $parsedResponse['moving_averages'] = $parsedResponse['moving_averages'] ?? [];
            $parsedResponse['description'] = $parsedResponse['description'] ?? "No description provided.";

            \Illuminate\Support\Facades\Log::info('Parsed Response: ' . print_r($parsedResponse, true));

            return $parsedResponse;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error analyzing crypto: ' . $e->getMessage());
            return [
                'error' => 'Failed to process request: ' . $e->getMessage(),
            ];
        }
    }
}
