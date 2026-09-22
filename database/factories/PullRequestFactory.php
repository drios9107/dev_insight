<?php

namespace Database\Factories;

use App\Enums\PullRequestStateEnum;
use App\Models\GithubRepository;
use App\Models\GithubUser;
use App\Models\PullRequest;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PullRequest>
 */
class PullRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $state = $this->faker->randomElement(array_column(PullRequestStateEnum::cases(), 'value'));

        return [
            'github_id' => $this->faker->unique()->randomNumber(8),
            'github_repository_id' => GithubRepository::inRandomOrder(0)->first()->id,
            'number' => $this->faker->unique()->numberBetween(1, 1000),
            'title' => $this->faker->sentence(5),
            'body' => $this->faker->optional()->paragraph(),
            'state' => $state,
            'author_id' => $this->faker->optional()->passthrough(GithubUser::inRandomOrder(0)->first()->id),
            'assignee_id' => $this->faker->optional()->passthrough(GithubUser::inRandomOrder(0)->first()->id),
            'base_branch' => $this->faker->randomElement(['main', 'master', 'develop']),
            'head_branch' => 'feature/'.$this->faker->word(),
            'task_id' => $this->faker->optional()->passthrough(Task::inRandomOrder(0)->first()->id),
            'closed_at' => in_array($state, ['closed', 'merged']) ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'merged_at' => $state === 'merged' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'merge_commit_sha' => $state === 'merged' ? $this->faker->sha1() : null,
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
        ];
    }
}
