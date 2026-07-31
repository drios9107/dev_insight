<?php

namespace Database\Factories;

use App\Models\GithubRepository;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GithubRepository>
 */
class GithubRepositoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word();

        return [
            'github_id' => $this->faker->unique()->randomNumber(8),
            'name' => $name,
            'full_name' => $this->faker->userName().'/'.$name,
            'url' => 'https://github.com/'.$this->faker->userName().'/'.$name,
            'description' => $this->faker->optional()->sentence(),
            'default_branch' => $this->faker->randomElement(['main', 'master', 'develop']),
            'is_private' => $this->faker->boolean(30),
            'language' => $this->faker->randomElement(['PHP', 'JavaScript', 'Python', 'Java', 'Go', 'Ruby', 'TypeScript', 'C#', null]),
            'stars_count' => $this->faker->numberBetween(0, 1000),
            'forks_count' => $this->faker->numberBetween(0, 100),
            'last_synced_at' => $this->faker->optional()->dateTimeBetween('-30 days', 'now'),
            'webhook_secret' => $this->faker->optional()->sha1(),
            'project_id' => $this->faker->optional()->passthrough(Project::factory()),
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
        ];
    }
}
