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
        Schema::create('commits', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('sha')->unique();
            $table->foreignId('github_repository_id')->constrained('github_repositories');
            $table->foreignId('author_id')->nullable()->constrained('github_users');
            $table->foreignId('pull_request_id')
                ->nullable()
                ->constrained('pull_requests')
                ->nullOnDelete();
            $table->text('message')->nullable();
            $table->timestamp('date')->nullable();
            $table->string('url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commits');
    }
};
