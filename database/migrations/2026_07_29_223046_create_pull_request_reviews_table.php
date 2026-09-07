<?php

use App\Enums\PullRequestReviewStateEnum;
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
        Schema::create('pull_request_reviews', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('github_id')->unique();
            $table->foreignId('reviewer_id')->nullable()->constrained('github_users');
            $table->foreignId('pull_request_id')->nullable()->constrained('pull_requests');
            $table->enum('state', array_column(PullRequestReviewStateEnum::cases(), 'value'));
            $table->text('body')->nullable();
            $table->timestamp('submitted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pull_request_reviews');
    }
};
