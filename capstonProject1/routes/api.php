<?php

use App\Http\Controllers\Api\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OpenAiController;
use App\Services\OpenAiServices;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::post('/analyze-crypto', [OpenAiController::class, 'analyzeCrypto']);
Route::post('/analyze-crypto', function (Request $request, OpenAiServices $aiService) {
    $data = $request->validate([
        'name' => 'required|string',
        'symbol' => 'required|string',
        'current_price' => 'required|numeric',
        'market_cap' => 'required|numeric',
        'price_change_percentage_24h' => 'required|numeric',
        'price_change_percentage_7d' => 'required|numeric',
        'price_change_percentage_30d' => 'required|numeric',
        'total_volume' => 'required|numeric',
    ]);

    return response()->json($aiService->analyzeCrypto($data));
});

Route::post('/chat', [ChatController::class, 'handleChat']);
