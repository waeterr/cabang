<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nim')->unique()->after('name');
            $table->enum('role', ['student', 'admin'])->default('student')->after('password');
            $table->string('ktm_path')->nullable()->after('role');
            $table->boolean('is_verified')->default(false)->after('ktm_path');
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending')->after('is_verified');
            $table->text('rejection_reason')->nullable()->after('verification_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nim',
                'role',
                'ktm_path',
                'is_verified',
                'verification_status',
                'rejection_reason',
            ]);
        });
    }
};
