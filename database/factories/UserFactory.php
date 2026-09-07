<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role_id' => Role::whereName('User')->first()?->id,
            'avatar_url' => $this->faker->optional()->imageUrl(200, 200, 'people'),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => Role::whereName('Admin')->first()?->id,
        ]);
    }

    public function manager(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => Role::whereName('Manager')->first()?->id,
        ]);
    }

    public function user(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => Role::whereName('User')->first()?->id,
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
