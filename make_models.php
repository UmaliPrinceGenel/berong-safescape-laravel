<?php
$models = [
    'QuickQuestion' => "protected \$table = 'quick_questions';",
    'BlogPost' => "protected \$table = 'blog_posts';\n    public function author() { return \$this->belongsTo(User::class, 'authorId'); }",
    'Video' => "protected \$table = 'videos';",
    'KidsModule' => "protected \$table = 'kids_modules';\n    public function progress() { return \$this->hasMany(UserProgress::class, 'moduleId'); }",
    'UserProgress' => "protected \$table = 'user_progress';\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }\n    public function module() { return \$this->belongsTo(KidsModule::class, 'moduleId'); }",
    'QuizResult' => "protected \$table = 'quiz_results';\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }",
    'Notification' => "public function user() { return \$this->belongsTo(User::class, 'userId'); }",
    'FireCodeSection' => "public function parentSection() { return \$this->belongsTo(FireCodeSection::class, 'parentSectionId'); }\n    public function subSections() { return \$this->hasMany(FireCodeSection::class, 'parentSectionId'); }",
    'CarouselImage' => "protected \$table = 'carousel_images';",
    'SafeScapeProgress' => "protected \$table = 'safescape_progress';\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }",
    'AssessmentQuestion' => "protected \$table = 'assessment_questions';\n    protected \$casts = ['options' => 'array', 'forRoles' => 'array'];\n    public function userAnswers() { return \$this->hasMany(UserAnswer::class, 'questionId'); }",
    'UserAnswer' => "protected \$table = 'user_answers';\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }\n    public function question() { return \$this->belongsTo(AssessmentQuestion::class, 'questionId'); }",
    'EngagementLog' => "protected \$table = 'engagement_logs';\n    protected \$casts = ['eventData' => 'array'];\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }",
    'AnalyticsCache' => "protected \$table = 'analytics_cache';\n    protected \$casts = ['cacheData' => 'array'];",
    'FloorPlan' => "protected \$table = 'floor_plans';\n    protected \$casts = ['gridData' => 'array'];\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }\n    public function clonedFrom() { return \$this->belongsTo(FloorPlan::class, 'clonedFromId'); }\n    public function clones() { return \$this->hasMany(FloorPlan::class, 'clonedFromId'); }",
    'SimulationJob' => "protected \$table = 'simulation_jobs';\n    protected \$casts = ['result' => 'array', 'config' => 'array'];\n    public \$incrementing = false;\n    protected \$keyType = 'string';\n    public function user() { return \$this->belongsTo(User::class, 'userId'); }"
];

foreach ($models as $name => $body) {
    if ($name === 'User') continue;
    $content = "<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass $name extends Model\n{\n    protected \$guarded = [];\n    $body\n}\n";
    file_put_contents(__DIR__ . "/app/Models/$name.php", $content);
}

$userPath = __DIR__ . "/app/Models/User.php";
$userContent = file_get_contents($userPath);
$userRelations = "
    public function blogPosts() { return \$this->hasMany(BlogPost::class, 'authorId'); }
    public function progress() { return \$this->hasMany(UserProgress::class, 'userId'); }
    public function quizResults() { return \$this->hasMany(QuizResult::class, 'userId'); }
    public function notifications() { return \$this->hasMany(Notification::class, 'userId'); }
    public function safeScapeProgress() { return \$this->hasMany(SafeScapeProgress::class, 'userId'); }
    public function assessmentAnswers() { return \$this->hasMany(UserAnswer::class, 'userId'); }
    public function engagementLogs() { return \$this->hasMany(EngagementLog::class, 'userId'); }
    public function floorPlans() { return \$this->hasMany(FloorPlan::class, 'userId'); }
    public function simulationJobs() { return \$this->hasMany(SimulationJob::class, 'userId'); }
";
$userContent = str_replace('}', $userRelations . "}\n", $userContent);
file_put_contents($userPath, $userContent);
echo "Models generated.\n";
