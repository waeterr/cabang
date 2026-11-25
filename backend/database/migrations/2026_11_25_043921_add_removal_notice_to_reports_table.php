<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table): void {
            $table->timestamp('removal_notice_at')->nullable()->after('archived_at');
            $table->timestamp('removal_deadline_at')->nullable()->after('removal_notice_at');
            $table->text('removal_notice')->nullable()->after('removal_deadline_at');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table): void {
            $table->dropColumn(['removal_notice_at', 'removal_deadline_at', 'removal_notice']);
        });
    }
};
