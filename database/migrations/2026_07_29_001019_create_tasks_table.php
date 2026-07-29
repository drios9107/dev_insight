<?php

use App\Enums\TaskPriorityEnum;
use App\Enums\TaskStatusEnum;
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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->string('description')->nullable();
            $table->foreignId('project_id')->constrained('projects')->nullable();
            $table->foreignId('sprint_id')->constrained('sprints')->nullable();
            $table->foreignId('assignee_id')->constrained('users')->nullable();
            $table->foreignId('reporter_id')->constrained('users');
            $table->enum('status', array_column(TaskStatusEnum::cases(), 'value'))->default(TaskStatusEnum::Backlog->value);
            $table->enum('priority', array_column(TaskPriorityEnum::cases(), 'value'))->default(TaskPriorityEnum::Medium->value);
            // @todo: whats story_points
            $table->integer('story_points')->default(0);
            $table->foreignId('github_issue_id')->constrained('github_issues')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('hours_estimate')->default(1);
            $table->integer('hours_spent')->default(0);
            $table->integer('order')->default(1);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
