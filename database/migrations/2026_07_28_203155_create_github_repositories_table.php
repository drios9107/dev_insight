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
        Schema::create('github_repositories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('github_id')->unique();
            $table->string('name');
            $table->string('full_name');
            $table->string('url');
            $table->string('description')->nullable();
            $table->boolean('is_private')->default(false);
            $table->string('default_branch')->default('main');
            $table->timestamp('last_synced_at')->nullable();
            $table->foreignId('project_id')->constrained('projects')->nullable();
            $table->string('webhook_secret')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('github_repositories');
    }
};
