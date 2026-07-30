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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('team_id')->nullable()->constrained('teams');
            $table->foreignId('project_id')->nullable()->constrained('projects');
            $table->foreignId('task_id')->nullable()->constrained('tasks');
            $table->string('type');
            $table->text('description');
            $table->json('data')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
