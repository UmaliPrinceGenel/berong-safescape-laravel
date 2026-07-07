<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\School;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Fetch both schools if they exist
        $oldSchool = School::where('name', 'Laguna State Polytechnic University - Sta. Cruz')->first();
        $newSchool = School::where('name', 'Laguna State Polytechnic University (LSPU) - Main Campus')->first();

        if ($oldSchool && $newSchool) {
            // Merge: point all users linked to oldSchool to newSchool
            User::where('school_id', $oldSchool->id)->update(['school_id' => $newSchool->id]);
            
            // Set type to 'college' for the unified record (since dynamic creation sets it to 'Other')
            $newSchool->update([
                'type' => 'college',
                'isActive' => true
            ]);

            // Recalculate school analytics for the unified school
            if (method_exists($newSchool, 'recalculateAnalytics')) {
                $newSchool->recalculateAnalytics();
            }

            // Safe to delete old duplicate school
            $oldSchool->delete();
        } elseif ($oldSchool) {
            // If only the seeded school exists, simply rename it to match the dropdown name
            $oldSchool->update([
                'name' => 'Laguna State Polytechnic University (LSPU) - Main Campus',
                'type' => 'college'
            ]);
        } elseif ($newSchool) {
            // If only the user-created one exists, ensure its type is 'college'
            $newSchool->update([
                'type' => 'college'
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse as it is a data correction migration
    }
};
