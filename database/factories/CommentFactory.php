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
            'task_id' => Task::inRandomOrder(0)->first()->id,
            'user_id' => User::inRandomOrder(0)->first()->id,
            'parent_id' => null,
            'content' => $this->faker->paragraph(2),
            'is_internal' => $this->faker->boolean(20),
        ];
    }
}
