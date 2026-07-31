<?php

use App\Enums\ProjectStatusEnum;
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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->foreignId('team_id')->constrained('teams');
            $table->foreignId('owner_id')->constrained('users');
            $table->foreignId('github_repository_id')->constrained('github_repositories')->nullable();
            $table->enum('status', array_column(ProjectStatusEnum::cases(), 'value'));
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('color')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
