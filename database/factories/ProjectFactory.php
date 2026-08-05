<?php

namespace Database\Factories;

use App\Enums\ProjectStatusEnum;
use App\Models\GithubRepository;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(2, true);
        $statuses = array_column(ProjectStatusEnum::cases(), 'value');

        return [
            'description' => $this->faker->optional()->sentence(),
            'name' => ucfirst($name),
            'team_id' => Team::inRandomOrder(0)->first()->id,
            'owner_id' => User::inRandomOrder(0)->first()->id,
            'github_repository_id' => $this->faker->passthrough(GithubRepository::inRandomOrder(0)->first()->id),
            'status' => $this->faker->randomElement($statuses),
            'start_date' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+60 days'),
            'color' => $this->faker->optional()->hexColor(),
            'created_at' => $this->faker->dateTimeBetween('-90 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-90 days', 'now'),
        ];
    }
}
