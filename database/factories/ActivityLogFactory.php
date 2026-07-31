<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->optional()->passthrough(User::factory()),
            'team_id' => $this->faker->optional()->passthrough(Team::factory()),
            'project_id' => $this->faker->optional()->passthrough(Project::factory()),
            'task_id' => $this->faker->optional()->passthrough(Task::factory()),
            'type' => $this->faker->randomElement(['created', 'updated', 'deleted']),
            'description' => $this->faker->sentence(),
            'data' => $this->faker->optional()->passthrough([
                'changes' => [
                    'old' => $this->faker->word(),
                    'new' => $this->faker->word(),
                ],
                'metadata' => $this->faker->words(3),
            ]),
            'ip_address' => $this->faker->optional()->ipv4(),
            'user_agent' => $this->faker->optional()->userAgent(),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
