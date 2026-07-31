<?php

namespace Database\Factories;

use App\Models\Metric;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Metric>
 */
class MetricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'team_id' => Team::factory(),
            'date' => $this->faker->dateTimeBetween('-90 days', 'now'),
            'commits_count' => $this->faker->numberBetween(0, 50),
            'prs_opened' => $this->faker->numberBetween(0, 20),
            'prs_closed' => $this->faker->numberBetween(0, 15),
            'prs_merged' => $this->faker->numberBetween(0, 10),
            'issues_opened' => $this->faker->numberBetween(0, 10),
            'issues_closed' => $this->faker->numberBetween(0, 8),
            'tasks_completed' => $this->faker->numberBetween(0, 15),
            'tasks_in_progress' => $this->faker->numberBetween(0, 10),
            'sprint_velocity' => $this->faker->optional()->randomFloat(1, 5, 30),
            'average_review_time' => $this->faker->optional()->randomFloat(1, 0.5, 48),
            'code_additions' => $this->faker->numberBetween(0, 2000),
            'code_deletions' => $this->faker->numberBetween(0, 1000),
            'active_developers' => $this->faker->numberBetween(0, 10),
            'created_at' => $this->faker->dateTimeBetween('-90 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-90 days', 'now'),
        ];
    }
}
