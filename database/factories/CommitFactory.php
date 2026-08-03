<?php

namespace Database\Factories;

use App\Models\Commit;
use App\Models\GithubRepository;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Commit>
 */
class CommitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $additions = $this->faker->numberBetween(1, 500);
        $deletions = $this->faker->numberBetween(0, 200);

        return [
            'sha' => $this->faker->unique()->sha1(),
            'github_repository_id' => GithubRepository::inRandomOrder(0)->first()->id,
            'author_id' => User::inRandomOrder(0)->first()->id,
            'task_id' => Task::inRandomOrder(0)->first()->id,
            'message' => $this->faker->sentence(6),
            'date' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'url' => $this->faker->url(),
            'additions' => $additions,
            'deletions' => $deletions,
            'total_changes' => $additions + $deletions,
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
        ];
    }
}
