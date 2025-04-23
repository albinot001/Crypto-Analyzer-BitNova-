<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ChatService;

class ChatController extends Controller
{
    private $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    public function handleChat(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string',
                'coin' => 'required|array',
                'analysis_data' => 'required|array',
            ]);
            $message = $validated['message'];
            $coin = $validated['coin'];
            $analysisData = $validated['analysis_data'];

            $response = $this->chatService->handleChat($message, $coin, $analysisData);

            return response()->json(['reply' => $response]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Invalid input data.',
                'details' => $e->errors(),
            ], 400);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in ChatController', ['exception' => $e->getMessage()]);
            return response()->json([
                'error' => 'An error occurred while processing the request.',
            ], 500);
        }
    }
}
