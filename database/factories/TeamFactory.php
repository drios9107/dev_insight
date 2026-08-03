<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company().' Team',
            'description' => fake()->text(),
            'owner_id' => User::inRandomOrder(0)->first()->id,
            'avatar_url' => fake()->imageUrl(),
            'is_active' => fake()->boolean(),
        ];
    }
}
