<?php

namespace App\Services;

use OpenAI;

class ChatService
{
    private $client;

    public function __construct()
    {
        $apiKey = config('app.api_key');

        if (!$apiKey) {
            \Illuminate\Support\Facades\Log::error('API key is missing.');
            throw new \Exception('API key is missing.');
        }

        $this->client = OpenAI::client($apiKey);
    }

    public function handleChat(string $message, array $coin, array $analysisData): string
    {
        try {
            $formattedAnalysis = $this->formatAnalysisData($analysisData);

            if (!$formattedAnalysis) {
                return "The analysis data for {$coin['name']} ({$coin['symbol']}) is incomplete or invalid. Please try again later.";
            }

            if ($this->isContradictoryQuery($message, $analysisData)) {
                return "Your question seems to contradict the available data for {$coin['name']} ({$coin['symbol']}). Please review the analysis data and try again.";
            }

            $response = $this->client->chat()->create([
                'model' => 'gpt-4o',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "
                    You are a cryptocurrency analysis assistant for '{$coin['name']}' (symbol: '{$coin['symbol']}'). Respond using only the provided analysis data:

                    1. Moving Averages: Details about trends (Buy/Sell/Neutral).
                    2. Oscillators: Momentum indicators, values, and actions.
                    3. Buy/Sell Percentages: Short-term, medium-term, and long-term trends.
                    4. Description: Summary of market performance.
                    5. Analysis Data: {$formattedAnalysis}

                    ### Rules:
                    - Validate all queries against the provided data.
                    - For contradictory queries, explain why the user's assumption is incorrect and provide supporting data.
                    - If a question references an unavailable indicator, respond: 'The requested indicator is not available in the data.'
                    - Ensure responses are precise, data-driven, and user-friendly.

                    ### Examples:
                    1. **Valid query (Buy trend):**
                    'The 1-day trend for {$coin['name']} shows a Buy signal with a 60% buy percentage and a 40% sell percentage.'
                    2. **Contradictory query:**
                    'Your question seems to contradict the available data. The 7-day trend indicates Buy, not Sell, based on the 70% buy percentage.'
                    3. **Unavailable indicator:**
                    'The requested indicator (TRIX) is not available in the analysis data for {$coin['name']} ({$coin['symbol']}).'
"
                    ],
                    ['role' => 'user', 'content' => $message],
                ],
            ]);

            return $response['choices'][0]['message']['content'] ?? 'No response from OpenAI.';
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in ChatService', ['exception' => $e->getMessage()]);
            return 'An error occurred while processing your request.';
        }
    }

    private function isContradictoryQuery(string $message, array $analysisData): bool
    {
        if (stripos($message, 'trend') !== false) {
            foreach (['1_day', '7_day', '30_day'] as $period) {
                if (stripos($message, $period) !== false) {
                    $buyPercentage = $analysisData['percentages'][$period]['buy'] ?? 0;
                    $sellPercentage = $analysisData['percentages'][$period]['sell'] ?? 0;

                    if (stripos($message, 'buy') !== false && $sellPercentage > $buyPercentage) {
                        return true;
                    }

                    if (stripos($message, 'sell') !== false && $buyPercentage > $sellPercentage) {
                        return true;
                    }
                }
            }
        }

        foreach ($analysisData['oscillators'] as $oscillator) {
            if (stripos($message, $oscillator['name']) !== false) {
                if (stripos($message, 'buy') !== false && strtolower($oscillator['action']) !== 'buy') {
                    return true;
                }
                if (stripos($message, 'sell') !== false && strtolower($oscillator['action']) !== 'sell') {
                    return true;
                }
            }
        }

        return false;
    }

    public function formatAnalysisData(array $analysisData): string
    {
        $formatted = [];

        if (!empty($analysisData['moving_averages'])) {
            $formatted[] = "Moving Averages:";
            foreach ($analysisData['moving_averages'] as $ma) {
                $formatted[] = "- {$ma['name']} - Value: {$ma['value']}, Action: {$ma['action']}";
            }
        }

        if (!empty($analysisData['oscillators'])) {
            $formatted[] = "Oscillators:";
            foreach ($analysisData['oscillators'] as $oscillator) {
                $formatted[] = "- {$oscillator['name']} - Value: {$oscillator['value']}, Action: {$oscillator['action']}";
            }
        }

        if (!empty($analysisData['percentages'])) {
            $formatted[] = "Buy/Sell Percentages:";
            foreach ($analysisData['percentages'] as $period => $values) {
                $formatted[] = "- " . ucfirst(str_replace('_', ' ', $period)) . " - Buy: {$values['buy']}%, Sell: {$values['sell']}%";
            }
        }

        if (!empty($analysisData['description'])) {
            $formatted[] = "Description: {$analysisData['description']}";
        }

        return implode("\n", $formatted);
    }
}
