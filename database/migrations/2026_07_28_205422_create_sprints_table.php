<?php

use App\Enums\SprintStatusEnum;
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
        Schema::create('sprints', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->text('goal')->nullable();
            $table->foreignId('project_id')->constrained('projects');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', array_column(SprintStatusEnum::cases(), 'value'))->default(SprintStatusEnum::Planning->value);
            $table->float('velocity')->nullable();
            $table->float('actual_velocity')->nullable();
            $table->foreignId('created_by')->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sprints');
    }
};
