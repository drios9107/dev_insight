<?php

namespace Database\Factories;

use App\Models\GithubUser;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GithubUser>
 */
class GithubUserFactory extends Factory
{
    protected $model = GithubUser::class;

    public function definition(): array
    {
        $username = $this->faker->unique()->userName();

        return [
            'github_id' => $this->faker->unique()->randomNumber(9),
            'username' => $username,
            'email' => $this->faker->optional()->safeEmail(),
            'name' => $this->faker->optional()->name(),
            'avatar_url' => $this->faker->optional()->imageUrl(200, 200, 'people'),
        ];
    }

    public function withEmail(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => $this->faker->safeEmail(),
        ]);
    }

    public function withName(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->name(),
        ]);
    }

    public function withoutMeta(): static
    {
        return $this->state(fn (array $attributes) => [
            'meta' => null,
        ]);
    }

    public function synced(): static
    {
        return $this->state(fn (array $attributes) => [
            'last_synced_at' => now(),
        ]);
    }
}
