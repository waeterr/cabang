<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table): void {
            if (! Schema::hasColumn('activities', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            }

            if (! Schema::hasColumn('activities', 'action')) {
                $table->string('action')->after('user_id');
                $table->string('subject_type')->nullable()->after('action');
                $table->unsignedBigInteger('subject_id')->nullable()->after('subject_type');
                $table->text('description')->after('subject_id');
                $table->json('meta')->nullable()->after('description');
                $table->index(['user_id', 'created_at']);
            }
        });

        Schema::table('notifications', function (Blueprint $table): void {
            if (! Schema::hasColumn('notifications', 'user_id')) {
                $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();
            }

            if (! Schema::hasColumn('notifications', 'type')) {
                $table->string('type')->after('user_id');
                $table->string('title')->after('type');
                $table->text('body')->after('title');
                $table->string('link')->nullable()->after('body');
                $table->timestamp('read_at')->nullable()->after('link');
                $table->index(['user_id', 'read_at']);
            }
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['action', 'subject_type', 'subject_id', 'description', 'meta']);
        });

        Schema::table('notifications', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'read_at']);
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['type', 'title', 'body', 'link', 'read_at']);
        });
    }
};
