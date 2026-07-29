<?php

use App\Enums\GithubIssueState;
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
        Schema::create('github_issues', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('github_id')->unique();
            $table->foreignId('github_repository_id')->constrained('github_repositories');
            $table->integer('number');
            $table->string('title');
            $table->text('body')->nullable();
            $table->enum('state', array_column(GithubIssueState::cases(), 'value'));
            $table->foreignId('author_id')->constrained('users')->nullable();
            $table->foreignId('task_id')->constrained('tasks')->nullable();
            $table->timestamp('closed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('github_issues');
    }
};
