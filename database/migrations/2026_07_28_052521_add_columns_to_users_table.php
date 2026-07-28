<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('github_id')->unique()->nullable();
            $table->string('github_token')->nullable();
            $table->string('github_username')->nullable();
            $table->string('avatar_url')->nullable();
            $table->foreignId('role_id')
                ->nullable()
                ->constrained('roles')
                ->restrictOnDelete();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn([
                'github_id',
                'github_token',
                'github_username',
                'avatar_url',
                'role_id',
            ]);
        });
    }
};
