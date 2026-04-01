<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$questions = \App\Models\AssessmentQuestion::where('type', 'preTest')
    ->whereJsonContains('forRoles', 'adult')
    ->select('id', 'question', 'order')
    ->get();
file_put_contents('q_out.json', json_encode($questions, JSON_PRETTY_PRINT));
