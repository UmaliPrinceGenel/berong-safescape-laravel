<?php
// app/Http/Controllers/GameProgressController.php

namespace App\Http\Controllers;

use App\Models\GameProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GameProgressController extends Controller
{
    /**
     * LOAD progress for a player.
     * Called by the game on startup.
     * GET /api/games/taskmaster/load?user_id=42
     */
    public function load(Request $request): JsonResponse
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required'], 400);
        }

        // Find the user to get their name
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Find or create their progress record
        $progress = GameProgress::firstOrCreate(
            ['user_id' => $userId],
            ['map1_unlocked' => false]
        );

        return response()->json([
            'user_id'        => (int) $userId,
            'player_name'    => $user->name, // The player's real name from your users table
            'map1_unlocked'  => $progress->map1_unlocked,
        ]);
    }

    /**
     * SAVE progress for a player.
     * Called by the game when the tutorial is completed.
     * POST /api/games/taskmaster/save
     * Body: { "user_id": 42, "player_name": "Juan", "map1_unlocked": true }
     */
    public function save(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id'       => 'required|integer|exists:users,id',
            'map1_unlocked' => 'required|boolean',
        ]);

        GameProgress::updateOrCreate(
            ['user_id' => $validated['user_id']],
            ['map1_unlocked' => $validated['map1_unlocked']]
        );

        return response()->json(['status' => 'saved']);
    }
}
