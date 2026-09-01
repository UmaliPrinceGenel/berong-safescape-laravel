<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\SafeScapeProgress;

class AdaptiveLearningTestSeeder extends Seeder
{
    /**
     * Seed the 6 Adaptive Learning evaluation test accounts.
     *
     * Accounts:
     * - AL-01: test_al01 (Age: 9, Grade: 3, Pre-Test: 4/15) -> Expected: Easy (Module Quiz)
     * - AL-02: test_al02 (Age: 14, Grade: 8, Pre-Test: 8/15) -> Expected: Medium (Module Quiz)
     * - AL-03: test_al03 (Age: 18, Grade: 12, Pre-Test: 13/15) -> Expected: Hard (Module Quiz)
     * - AL-04: test_al06 (Pre-Test: 14/15, Module Avg: 5/5) -> Expected: Hard (Final Exam)
     * - AL-05: test_al07 (Pre-Test: 4/15, Module Avg: 5/5) -> Expected: Medium (Final Exam)
     * - AL-06: test_al08 (Pre-Test: 14/15, Module Avg: 1/5) -> Expected: Easy (Final Exam)
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        $accounts = [
            // Phase 1: Module Quiz test accounts
            [
                'test_id'      => 'AL-01',
                'username'     => 'test_al01',
                'name'         => 'Test Learner AL-01',
                'email'        => 'test_al01@safescape.test',
                'age'          => 9,
                'gradeLevel'   => 'Grade 3',
                'preTestScore' => 4,
                'module_scores'=> [], // No module progress yet (ready for Module Quiz)
            ],
            [
                'test_id'      => 'AL-02',
                'username'     => 'test_al02',
                'name'         => 'Test Learner AL-02',
                'email'        => 'test_al02@safescape.test',
                'age'          => 14,
                'gradeLevel'   => 'Grade 8',
                'preTestScore' => 8,
                'module_scores'=> [], // No module progress yet (ready for Module Quiz)
            ],
            [
                'test_id'      => 'AL-03',
                'username'     => 'test_al03',
                'name'         => 'Test Learner AL-03',
                'email'        => 'test_al03@safescape.test',
                'age'          => 18,
                'gradeLevel'   => 'Grade 12',
                'preTestScore' => 13,
                'module_scores'=> [], // No module progress yet (ready for Module Quiz)
            ],

            // Phase 2: Final Exam test accounts
            [
                'test_id'      => 'AL-04',
                'username'     => 'test_al06',
                'name'         => 'Test Learner AL-06',
                'email'        => 'test_al06@safescape.test',
                'age'          => 14,
                'gradeLevel'   => 'Grade 8',
                'preTestScore' => 14,
                'module_scores'=> [1 => 5, 2 => 5, 3 => 5, 4 => 5], // Avg 5/5
            ],
            [
                'test_id'      => 'AL-05',
                'username'     => 'test_al07',
                'name'         => 'Test Learner AL-07',
                'email'        => 'test_al07@safescape.test',
                'age'          => 10,
                'gradeLevel'   => 'Grade 5',
                'preTestScore' => 4,
                'module_scores'=> [1 => 5, 2 => 5, 3 => 5, 4 => 5], // Avg 5/5
            ],
            [
                'test_id'      => 'AL-06',
                'username'     => 'test_al08',
                'name'         => 'Test Learner AL-08',
                'email'        => 'test_al08@safescape.test',
                'age'          => 10,
                'gradeLevel'   => 'Grade 5',
                'preTestScore' => 14,
                'module_scores'=> [1 => 1, 2 => 1, 3 => 1, 4 => 1], // Avg 1/5
            ],
        ];

        foreach ($accounts as $acc) {
            $user = User::updateOrCreate(
                ['username' => $acc['username']],
                [
                    'name'             => $acc['name'],
                    'email'            => $acc['email'],
                    'email_verified_at'=> now(),
                    'password'         => $defaultPassword,
                    'role'             => 'kid',
                    'age'              => $acc['age'],
                    'gradeLevel'       => $acc['gradeLevel'],
                    'preTestScore'     => $acc['preTestScore'],
                    'profileCompleted' => true,
                ]
            );

            // If the account requires completed modules (for Final Exam testing)
            if (!empty($acc['module_scores'])) {
                foreach ($acc['module_scores'] as $modNum => $score) {
                    SafeScapeProgress::updateOrCreate(
                        [
                            'userId'    => $user->id,
                            'moduleNum' => $modNum,
                        ],
                        [
                            'sectionData' => json_encode([
                                'quizScore'  => $score,
                                'quizPassed' => true,
                            ]),
                            'completed'   => true,
                            'completedAt' => now(),
                        ]
                    );
                }
            }

            $this->command->info("Seeded account: [{$acc['username']}] Password: [password123] PreTest: [{$acc['preTestScore']}/15]");
        }

        $this->command->info("Successfully seeded all 6 Adaptive Learning test accounts!");
    }
}
