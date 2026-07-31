<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_id' => Task::factory(),
            'user_id' => User::factory(),
            'parent_comment_id' => $this->faker->optional()->passthrough(Comment::factory()),
            'content' => $this->faker->paragraph(2),
            'is_internal' => $this->faker->boolean(20),
        ];
    }
}
