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
            $table->foreignId('author_id')->nullable()->constrained('users');
            $table->foreignId('task_id')->nullable()->constrained('tasks');
            $table->text('message')->nullable();
            $table->timestamp('date')->nullable();
            $table->string('url');
            $table->integer('additions')->default(0);
            $table->integer('deletions')->default(0);
            $table->integer('total_changes')->default(0);
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
