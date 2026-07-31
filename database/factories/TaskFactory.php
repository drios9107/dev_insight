<?php

namespace Database\Factories;

use App\Enums\TaskPriorityEnum;
use App\Enums\TaskStatusEnum;
use App\Models\GithubIssue;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Estados posibles
        $statuses = array_column(TaskStatusEnum::cases(), 'value');
        $status = $this->faker->randomElement($statuses);

        // Prioridades
        $priorities = array_column(TaskPriorityEnum::cases(), 'value');
        $priority = $this->faker->randomElement($priorities);

        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(2),
            'project_id' => Project::factory(),
            'sprint_id' => $this->faker->optional()->passthrough(Sprint::factory()),
            'assignee_id' => $this->faker->optional()->passthrough(User::factory()),
            'reporter_id' => User::factory(),
            'status' => $status,
            'priority' => $priority,
            'story_points' => $this->faker->optional()->numberBetween(1, 13),
            'github_issue_id' => $this->faker->optional()->passthrough(GithubIssue::factory()),
            'due_date' => $this->faker->optional()->dateTimeBetween('+1 week', '+1 month'),
            'completed_at' => $status === TaskStatusEnum::Done->value ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'hours_estimate' => $this->faker->optional()->numberBetween(1, 40),
            'hours_spent' => $this->faker->optional()->numberBetween(1, 40),
            'order' => $this->faker->numberBetween(0, 100),
        ];
    }
}
