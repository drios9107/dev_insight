<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_github_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('github_user_id')->constrained('github_users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['team_id', 'github_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_github_user');
    }
};
