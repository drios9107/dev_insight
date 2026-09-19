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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('content');
            $table->foreignId('user_id')->after('content')->constrained('users')->onDelete('cascade');
            $table->foreignId('task_id')->constrained('tasks');
            $table->foreignId('parent_id')->nullable()->constrained('comments');
            $table->boolean('is_internal')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
