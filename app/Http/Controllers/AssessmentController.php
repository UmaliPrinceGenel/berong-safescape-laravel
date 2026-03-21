<?php

namespace App\Http\Controllers;

use App\Models\AssessmentQuestion;
use App\Models\UserAnswer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssessmentController extends Controller
{
    /**
     * GET /api/assessment/questions?role=kid|adult&type=preTest|postTest
     */
    public function index(Request $request)
    {
        $role = $request->query('role', 'adult');
        $type = $request->query('type', 'preTest');

        $query = AssessmentQuestion::where('isActive', true);

        // Filter by role
        if ($role) {
            $query->whereJsonContains('forRoles', $role);
        }

        // Filter by type
        if ($type) {
            $query->where('type', $type);
        }

        $questions = $query->orderBy('order', 'asc')->get()->map(function ($q) {
            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $q->options,
                'correctAnswer' => $q->correctAnswer,
                'category' => $q->category,
                'explanation' => $q->explanation,
            ];
        });

        return response()->json(['questions' => $questions]);
    }

    /**
     * POST /api/assessments/pre-test
     */
    public function submitPreTest(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $answers = $request->input('answers', []);
        $score = 0;
        $maxScore = count($answers);

        foreach ($answers as $answer) {
            $question = AssessmentQuestion::find($answer['questionId']);
            $isCorrect = false;

            if ($question) {
                $isCorrect = $question->correctAnswer == $answer['selectedAnswer'];
                if ($isCorrect) $score++;

                UserAnswer::create([
                    'userId' => $user->id,
                    'questionId' => $answer['questionId'],
                    'selectedAnswer' => $answer['selectedAnswer'],
                    'isCorrect' => $isCorrect,
                    'testType' => 'preTest',
                ]);
            }
        }

        $user->update(['preTestScore' => $score]);

        return response()->json([
            'score' => $score,
            'maxScore' => $maxScore,
            'percentage' => $maxScore > 0 ? round(($score / $maxScore) * 100) : 0,
        ]);
    }

    /**
     * POST /api/assessments/post-test
     */
    public function submitPostTest(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $answers = $request->input('answers', []);
        $score = 0;
        $maxScore = count($answers);

        foreach ($answers as $answer) {
            $question = AssessmentQuestion::find($answer['questionId']);
            $isCorrect = false;

            if ($question) {
                $isCorrect = $question->correctAnswer == $answer['selectedAnswer'];
                if ($isCorrect) $score++;

                UserAnswer::create([
                    'userId' => $user->id,
                    'questionId' => $answer['questionId'],
                    'selectedAnswer' => $answer['selectedAnswer'],
                    'isCorrect' => $isCorrect,
                    'testType' => 'postTest',
                ]);
            }
        }

        $user->update(['postTestScore' => $score]);

        return response()->json([
            'score' => $score,
            'maxScore' => $maxScore,
            'percentage' => $maxScore > 0 ? round(($score / $maxScore) * 100) : 0,
        ]);
    }

    /**
     * GET /api/assessments/history
     */
    public function history(Request $request)
    {
        $user = Auth::user();

        $answers = UserAnswer::where('userId', $user->id)
            ->with('question:id,question,correctAnswer,explanation')
            ->orderBy('answeredAt', 'desc')
            ->get();

        return response()->json($answers);
    }

    // Resource stubs for admin CRUD
    public function store(Request $request) { }
    public function show(string $id) { }
    public function update(Request $request, string $id) { }
    public function destroy(string $id) { }
}
