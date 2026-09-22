<?php

namespace Database\Factories;

use App\Models\Commit;
use App\Models\GithubRepository;
use App\Models\GithubUser;
use App\Models\PullRequest;
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
        return [
            'sha' => $this->faker->unique()->sha1(),
            'github_repository_id' => GithubRepository::inRandomOrder(0)->first()->id,
            'author_id' => GithubUser::inRandomOrder(0)->first()->id,
            'pull_request_id' => PullRequest::inRandomOrder(0)->first()->id,
            'message' => $this->faker->sentence(6),
            'date' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'url' => $this->faker->url(),
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
        ];
    }
}
