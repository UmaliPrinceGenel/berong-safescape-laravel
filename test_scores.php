<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Starting test...\n";
    $user = App\Models\User::first();
    echo "User found: " . ($user ? $user->id : 'none') . "\n";
    
    $preTestMax = App\Models\AssessmentQuestion::count();
    echo "preTestMax: $preTestMax\n";
    
    $preTestCompletedAt = App\Models\UserAnswer::where('userId', $user->id)
        ->where('testType', 'preTest')
        ->latest('answeredAt')
        ->value('answeredAt');
        
    echo "preTestCompletedAt: " . ($preTestCompletedAt ?: 'null') . "\n";
    
    $postTestCompletedAt = App\Models\UserAnswer::where('userId', $user->id)
        ->where('testType', 'postTest')
        ->latest('answeredAt')
        ->value('answeredAt');
        
    echo "postTestCompletedAt: " . ($postTestCompletedAt ?: 'null') . "\n";
    
    echo "Scores payload:\n";
    print_r([
        'preTestScore' => $user->preTestScore,
        'preTestMax' => $preTestMax,
        'preTestCompletedAt' => $preTestCompletedAt,
        'postTestScore' => $user->postTestScore,
        'postTestMax' => $preTestMax,
        'postTestCompletedAt' => $postTestCompletedAt,
        'engagementPoints' => $user->engagementPoints ?? 0,
    ]);
    
} catch (\Exception $e) {
    echo "EXCEPTION CAUGHT: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
} catch (\Error $e) {
    echo "FATAL ERROR CAUGHT: " . $e->getMessage() . "\n";
}
