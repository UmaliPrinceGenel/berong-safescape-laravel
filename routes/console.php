<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('test:verify-al', function (\App\Services\AdaptiveLearningService $service) {
    $tests = [
        [
            'id' => 'AL-01',
            'phase' => 'Module Quiz',
            'username' => 'test_al01',
            'inputs' => 'Age: 9, Grade: 3, Pre: 4/15',
            'expected' => 'Easy',
            'fn' => function ($u) use ($service) {
                return $service->getModuleDifficulty($u?->age ?? 9, 3, $u?->preTestScore ?? 4);
            }
        ],
        [
            'id' => 'AL-02',
            'phase' => 'Module Quiz',
            'username' => 'test_al02',
            'inputs' => 'Age: 14, Grade: 8, Pre: 8/15',
            'expected' => 'Medium',
            'fn' => function ($u) use ($service) {
                return $service->getModuleDifficulty($u?->age ?? 14, 8, $u?->preTestScore ?? 8);
            }
        ],
        [
            'id' => 'AL-03',
            'phase' => 'Module Quiz',
            'username' => 'test_al03',
            'inputs' => 'Age: 18, Grade: 12, Pre: 13/15',
            'expected' => 'Hard',
            'fn' => function ($u) use ($service) {
                return $service->getModuleDifficulty($u?->age ?? 18, 12, $u?->preTestScore ?? 13);
            }
        ],
        [
            'id' => 'AL-04',
            'phase' => 'Final Exam',
            'username' => 'test_al06',
            'inputs' => 'Pre: 14/15, Mod Avg: 5/5',
            'expected' => 'Hard',
            'fn' => function ($u) use ($service) {
                return $service->getFinalExamDifficulty($u?->age ?? 14, 8, $u?->preTestScore ?? 14, 5, 5, 5, 5);
            }
        ],
        [
            'id' => 'AL-05',
            'phase' => 'Final Exam',
            'username' => 'test_al07',
            'inputs' => 'Pre: 4/15, Mod Avg: 5/5',
            'expected' => 'Medium',
            'fn' => function ($u) use ($service) {
                return $service->getFinalExamDifficulty($u?->age ?? 10, 5, $u?->preTestScore ?? 4, 5, 5, 5, 5);
            }
        ],
        [
            'id' => 'AL-06',
            'phase' => 'Final Exam',
            'username' => 'test_al08',
            'inputs' => 'Pre: 14/15, Mod Avg: 1/5',
            'expected' => 'Easy',
            'fn' => function ($u) use ($service) {
                return $service->getFinalExamDifficulty($u?->age ?? 10, 5, $u?->preTestScore ?? 14, 1, 1, 1, 1);
            }
        ],
    ];

    $headers = ['Test ID', 'Phase', 'Account', 'Inputs', 'Expected', 'Observed', 'Match'];
    $rows = [];

    foreach ($tests as $t) {
        $user = null;
        try {
            $user = \App\Models\User::where('username', $t['username'])->first();
        } catch (\Throwable $e) {
            // Local DB not connected
        }
        $observed = $t['fn']($user);
        $match = ($observed === $t['expected']) ? 'YES' : 'NO';
        $rows[] = [
            $t['id'],
            $t['phase'],
            $t['username'] . ($user ? ' (Active)' : ''),
            $t['inputs'],
            $t['expected'],
            $observed,
            $match
        ];
    }

    $this->table($headers, $rows);
})->purpose('Verify Adaptive Learning difficulty classification test accounts');

