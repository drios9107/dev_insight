<?php

namespace Database\Factories;

use App\Enums\GithubIssueStateEnum;
use App\Models\GithubIssue;
use App\Models\GithubRepository;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GithubIssue>
 */
class GithubIssueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $state = $this->faker->randomElement(array_column(GithubIssueStateEnum::cases(), 'value'));

        return [
            'github_id' => $this->faker->unique()->randomNumber(8),
            'github_repository_id' => GithubRepository::factory(),
            'number' => $this->faker->unique()->numberBetween(1, 1000),
            'title' => $this->faker->sentence(5),
            'body' => $this->faker->optional()->paragraph(),
            'state' => $state,
            'author_id' => $this->faker->optional()->passthrough(User::factory()),
            'task_id' => $this->faker->optional()->passthrough(Task::factory()),
            'closed_at' => $state === 'closed' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
        ];
    }
}
