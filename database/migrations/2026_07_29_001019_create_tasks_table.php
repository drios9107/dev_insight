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
            $table->foreignId('project_id')->nullable()->constrained('projects');
            $table->foreignId('sprint_id')->nullable()->constrained('sprints');
            $table->foreignId('assignee_id')->nullable()->constrained('users');
            $table->foreignId('github_issue_id')->nullable()->constrained('github_issues');
            $table->foreignId('reporter_id')->constrained('users');
            $table->enum('status', array_column(TaskStatusEnum::cases(), 'value'))->default(TaskStatusEnum::Backlog->value);
            $table->enum('priority', array_column(TaskPriorityEnum::cases(), 'value'))->default(TaskPriorityEnum::Medium->value);
            $table->integer('story_points')->default(0)->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('hours_estimate')->default(1)->nullable();
            $table->integer('hours_spent')->default(0)->nullable();
            $table->integer('order')->default(1)->nullable();
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
