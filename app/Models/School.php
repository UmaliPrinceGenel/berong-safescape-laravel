<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'name',
        'address',
        'region',
        'district',
        'type',
        'contactPerson',
        'contactEmail',
        'contactPhone',
        'totalStudents',
        'averagePreTestScore',
        'averagePostTestScore',
        'averageCompletionRate',
        'totalModulesCompleted',
        'isActive',
    ];

    protected function casts(): array
    {
        return [
            'totalStudents' => 'integer',
            'averagePreTestScore' => 'float',
            'averagePostTestScore' => 'float',
            'averageCompletionRate' => 'float',
            'totalModulesCompleted' => 'integer',
            'isActive' => 'boolean',
        ];
    }

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class, 'school_id');
    }

    /**
     * Recalculate analytics for ALL schools in just 2 single grouped queries (O(1) database overhead).
     */
    public static function recalculateAllAnalytics(): void
    {
        $userStats = \App\Models\User::whereNotNull('school_id')
            ->selectRaw('
                school_id,
                COUNT(*) as total_students,
                AVG("preTestScore") as avg_pre_test,
                AVG("postTestScore") as avg_post_test
            ')
            ->groupBy('school_id')
            ->get()
            ->keyBy('school_id');

        $progressStats = \App\Models\SafeScapeProgress::join('users', 'safescape_progress.userId', '=', 'users.id')
            ->whereNotNull('users.school_id')
            ->where('safescape_progress.completed', true)
            ->selectRaw('
                users.school_id,
                COUNT(DISTINCT safescape_progress."userId") as completed_users,
                COUNT(safescape_progress.id) as total_modules_completed
            ')
            ->groupBy('users.school_id')
            ->get()
            ->keyBy('school_id');

        $schools = self::all();
        foreach ($schools as $school) {
            $uStat = $userStats->get($school->id);
            $pStat = $progressStats->get($school->id);

            $totalStudents = (int) ($uStat->total_students ?? 0);
            $avgPre = round((float) ($uStat->avg_pre_test ?? 0), 2);
            $avgPost = round((float) ($uStat->avg_post_test ?? 0), 2);

            $completedUsers = (int) ($pStat->completed_users ?? 0);
            $totalModules = (int) ($pStat->total_modules_completed ?? 0);

            $completionRate = ($totalStudents > 0)
                ? round(($completedUsers / $totalStudents) * 100, 1)
                : 0;

            if (
                $school->totalStudents !== $totalStudents ||
                $school->averagePreTestScore != $avgPre ||
                $school->averagePostTestScore != $avgPost ||
                $school->averageCompletionRate != $completionRate ||
                $school->totalModulesCompleted !== $totalModules
            ) {
                $school->totalStudents = $totalStudents;
                $school->averagePreTestScore = $avgPre;
                $school->averagePostTestScore = $avgPost;
                $school->averageCompletionRate = $completionRate;
                $school->totalModulesCompleted = $totalModules;
                $school->save();
            }
        }
    }

    public function recalculateAnalytics(): void
    {
        // 1. Get basic aggregates in one database query
        $stats = \App\Models\User::where('school_id', $this->id)
            ->selectRaw('
                COUNT(*) as total_students,
                AVG("preTestScore") as avg_pre_test,
                AVG("postTestScore") as avg_post_test
            ')
            ->first();

        $this->totalStudents = (int) ($stats->total_students ?? 0);
        $this->averagePreTestScore = round((float) ($stats->avg_pre_test ?? 0), 2);
        $this->averagePostTestScore = round((float) ($stats->avg_post_test ?? 0), 2);

        // 2. Calculate completion rate (users with at least 1 completed module)
        if ($this->totalStudents > 0) {
            $completedUsers = \App\Models\User::where('school_id', $this->id)
                ->whereHas('safeScapeProgress', function($q) {
                    $q->where('completed', true);
                })->count();
            $this->averageCompletionRate = round(($completedUsers / $this->totalStudents) * 100, 1);
        } else {
            $this->averageCompletionRate = 0;
        }

        // 3. Calculate total modules completed across the school
        $this->totalModulesCompleted = \App\Models\SafeScapeProgress::join('users', 'safescape_progress.userId', '=', 'users.id')
            ->where('users.school_id', $this->id)
            ->where('safescape_progress.completed', true)
            ->count();

        $this->save();
    }
}
