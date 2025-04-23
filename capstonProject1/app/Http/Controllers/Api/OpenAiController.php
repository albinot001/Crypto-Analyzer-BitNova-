<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\OpenAiServices;

class OpenAiController extends Controller
{
    public function analyzeCrypto(Request $request)
    {
        $validated = $request->validate([
            'cryptos' => 'required|array',
            'user_prompt' => 'required|string',
        ]);
        $openAiService = new OpenAiServices();
        $result = $openAiService->analyzeCrypto($validated['cryptos'], $validated['user_prompt']);

        return response()->json($result);
    }
}
