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
        Schema::create('metrics', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('team_id')->constrained('teams');
            $table->timestamp('date');
            $table->integer('commits_count')->default(0);
            $table->integer('prs_opened')->default(0);
            $table->integer('prs_closed')->default(0);
            $table->integer('prs_merged')->default(0);
            $table->integer('issues_opened')->default(0);
            $table->integer('issues_closed')->default(0);
            $table->integer('tasks_completed')->default(0);
            $table->integer('tasks_in_progress')->default(0);
            $table->float('sprint_velocity')->nullable();
            $table->float('average_review_time')->nullable();
            $table->integer('code_additions')->default(0);
            $table->integer('code_deletions')->default(0);
            $table->integer('active_developers')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metrics');
    }
};
