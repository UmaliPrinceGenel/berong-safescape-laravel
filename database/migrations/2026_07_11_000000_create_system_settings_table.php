<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default maintenance mode settings
        \Illuminate\Support\Facades\DB::table('system_settings')->insert([
            'key' => 'maintenance_mode',
            'value' => json_encode([
                'is_active' => false,
                'message' => "SafeScape is currently undergoing scheduled updates. We'll be back online shortly!",
                'warning_active' => false,
                'warning_message' => "Notice: The platform will be offline for scheduled maintenance in 15 minutes. Please save your progress."
            ]),
            'description' => 'System maintenance mode configurations.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void {
        Schema::dropIfExists('system_settings');
    }
};
