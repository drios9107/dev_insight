<?php

namespace Database\Factories;

use App\Models\GithubRepository;
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
        $name = $this->faker->unique()->company().' Repository';

        return [
            'github_id' => $this->faker->unique()->randomNumber(8),
            'name' => $name,
            'full_name' => $this->faker->userName().'/'.$name,
            'url' => 'https://github.com/'.$this->faker->userName().'/'.$name,
            'description' => $this->faker->optional()->sentence(),
            'default_branch' => $this->faker->randomElement(['main', 'master', 'develop']),
            'is_private' => $this->faker->boolean(30),
            'last_synced_at' => $this->faker->optional()->dateTimeBetween('-30 days', 'now'),
            'webhook_secret' => $this->faker->optional()->sha1(),
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
        ];
    }
}
