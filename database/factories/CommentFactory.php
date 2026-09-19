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
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'task_id' => Task::inRandomOrder(0)->first()?->id ?? Task::factory(),
            'user_id' => User::inRandomOrder(0)->first()?->id ?? User::factory(),
            'parent_id' => null,
            'content' => $this->faker->paragraph(2),
            'is_internal' => $this->faker->boolean(20),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Comment with replies (thread)
     */
    public function withReplies(int $count = 2): static
    {
        return $this->afterCreating(function (Comment $comment) use ($count) {
            Comment::factory($count)->create([
                'task_id' => $comment->task_id,
                'parent_id' => $comment->id,
                'user_id' => $comment->user_id,
            ]);
        });
    }

    /**
     * Internal comment (only for the team)
     */
    public function internal(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_internal' => true,
        ]);
    }
}
