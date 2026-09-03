<?php

use App\Enums\PullRequestStateEnum;
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
        Schema::create('pull_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('github_id')->unique();
            $table->foreignId('github_repository_id')->constrained('github_repositories');
            $table->integer('number');
            $table->string('title');
            $table->text('body')->nullable();
            $table->enum('state', array_column(PullRequestStateEnum::cases(), 'value'));
            $table->foreignId('author_id')->nullable()->constrained('users');
            $table->foreignId('assignee_id')->nullable()->constrained('users');
            $table->string('base_branch');
            $table->string('head_branch');
            $table->foreignId('task_id')->nullable()->constrained('tasks');
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('merged_at')->nullable();
            $table->string('merge_commit_sha')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pull_requests');
    }
};
