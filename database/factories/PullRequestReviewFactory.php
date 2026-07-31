<?php

namespace Database\Factories;

use App\Enums\PullRequestReviewStateEnum;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PullRequestReview>
 */
class PullRequestReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $states = array_column(PullRequestReviewStateEnum::cases(), 'value');

        return [
            'github_id' => $this->faker->unique()->randomNumber(8),
            'pull_request_id' => PullRequest::factory(),
            'reviewer_id' => $this->faker->optional()->passthrough(User::factory()),
            'state' => $this->faker->randomElement($states),
            'body' => $this->faker->optional()->paragraph(),
            'submitted_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
