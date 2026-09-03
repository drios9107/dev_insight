<?php

use App\Enums\GithubIssueStateEnum;
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
            $table->bigInteger('github_id')->unique();
            $table->foreignId('github_repository_id')->constrained('github_repositories');
            $table->integer('number');
            $table->string('title');
            $table->text('body')->nullable();
            $table->enum('state', array_column(GithubIssueStateEnum::cases(), 'value'));
            $table->foreignId('author_id')->nullable()->constrained('users');
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
