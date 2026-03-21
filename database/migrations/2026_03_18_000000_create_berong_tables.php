<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Users table is already handled by Breeze, alter it to add our fields.
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable();
            $table->string('firstName')->default('');
            $table->string('lastName')->default('');
            $table->string('middleName')->nullable();
            $table->integer('age')->nullable();
            $table->string('role')->default('guest');
            $table->boolean('isActive')->default(true);
            $table->string('barangay')->nullable();
            $table->string('school')->nullable();
            $table->string('schoolOther')->nullable();
            $table->string('occupation')->nullable();
            $table->string('occupationOther')->nullable();
            $table->string('gender')->nullable();
            $table->string('gradeLevel')->nullable();
            $table->integer('preTestScore')->nullable();
            $table->integer('postTestScore')->nullable();
            $table->timestamp('preTestCompletedAt')->nullable();
            $table->timestamp('postTestCompletedAt')->nullable();
            $table->integer('engagementPoints')->default(0);
            $table->integer('totalTimeSpentMinutes')->default(0);
            $table->timestamp('lastActiveAt')->useCurrent();
            $table->boolean('dataPrivacyConsent')->default(false);
            $table->boolean('profileCompleted')->default(false);
        });

        Schema::create('quick_questions', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->text('questionText');
            $table->text('responseText');
            $table->integer('order')->default(0);
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('excerpt');
            $table->text('content');
            $table->string('imageUrl')->nullable();
            $table->string('category');
            $table->foreignId('authorId')->constrained('users')->cascadeOnDelete();
            $table->boolean('isPublished')->default(true);
            $table->timestamps();
        });

        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('youtubeId');
            $table->string('category');
            $table->string('duration')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        Schema::create('kids_modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('dayNumber')->unique();
            $table->text('content');
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->foreignId('moduleId')->constrained('kids_modules')->cascadeOnDelete();
            $table->boolean('completed')->default(false);
            $table->integer('score')->default(0);
            $table->timestamp('completedAt')->nullable();
            $table->timestamps();
            $table->unique(['userId', 'moduleId']);
        });

        Schema::create('quiz_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->string('quizType');
            $table->integer('score')->default(0);
            $table->integer('maxScore')->default(0);
            $table->timestamp('completedAt')->useCurrent();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type');
            $table->string('category');
            $table->boolean('isRead')->default(false);
            $table->timestamp('createdAt')->useCurrent();
        });

        Schema::create('fire_code_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('sectionNum');
            $table->text('content');
            $table->foreignId('parentSectionId')->nullable()->constrained('fire_code_sections')->cascadeOnDelete();
            $table->integer('order');
            $table->timestamps();
        });

        Schema::create('carousel_images', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('altText')->nullable();
            $table->string('imageUrl');
            $table->integer('order')->default(0);
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });

        Schema::create('safescape_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->integer('moduleNum');
            $table->json('sectionData');
            $table->boolean('completed')->default(false);
            $table->timestamp('completedAt')->nullable();
            $table->timestamps();
            $table->unique(['userId', 'moduleNum']);
        });

        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->json('options');
            $table->integer('correctAnswer');
            $table->text('explanation');
            $table->string('category');
            $table->string('difficulty')->default('Medium');
            $table->boolean('isActive')->default(true);
            $table->json('forRoles');
            $table->string('type')->default('preTest');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->foreignId('questionId')->constrained('assessment_questions')->cascadeOnDelete();
            $table->integer('selectedAnswer');
            $table->boolean('isCorrect');
            $table->string('testType');
            $table->timestamp('answeredAt')->useCurrent();
        });

        Schema::create('engagement_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->string('eventType');
            $table->json('eventData')->nullable();
            $table->integer('points')->default(0);
            $table->timestamp('loggedAt')->useCurrent();
        });

        Schema::create('analytics_cache', function (Blueprint $table) {
            $table->id();
            $table->string('cacheKey')->unique();
            $table->json('cacheData');
            $table->timestamp('expiresAt');
            $table->timestamps();
        });

        Schema::create('floor_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('gridData');
            $table->text('thumbnail')->nullable();
            $table->text('originalImage')->nullable();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->string('uploaderName');
            $table->boolean('isPublic')->default(false);
            $table->foreignId('clonedFromId')->nullable()->constrained('floor_plans')->nullOnDelete();
            $table->integer('gridWidth')->default(256);
            $table->integer('gridHeight')->default(256);
            $table->integer('exitCount')->default(0);
            $table->string('processingMethod')->default('unet');
            $table->float('threshold')->nullable();
            $table->boolean('invertMask')->nullable();
            $table->timestamps();
        });

        Schema::create('simulation_jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('status')->default('queued');
            $table->json('result')->nullable();
            $table->text('error')->nullable();
            $table->foreignId('userId')->nullable()->constrained('users')->nullOnDelete();
            $table->json('config')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('simulation_jobs');
        Schema::dropIfExists('floor_plans');
        Schema::dropIfExists('analytics_cache');
        Schema::dropIfExists('engagement_logs');
        Schema::dropIfExists('user_answers');
        Schema::dropIfExists('assessment_questions');
        Schema::dropIfExists('safescape_progress');
        Schema::dropIfExists('carousel_images');
        Schema::dropIfExists('fire_code_sections');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('quiz_results');
        Schema::dropIfExists('user_progress');
        Schema::dropIfExists('kids_modules');
        Schema::dropIfExists('videos');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('quick_questions');
    }
};
