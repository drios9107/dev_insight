<?php

namespace Database\Factories;

use App\Enums\NotificationTypeEnum;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = array_column(NotificationTypeEnum::cases(), 'value');

        return [
            'user_id' => User::inRandomOrder(0)->first()->id,
            'type' => $this->faker->randomElement($types),
            'title' => $this->faker->sentence(),
            'message' => $this->faker->sentence(),
            'link' => $this->faker->optional()->url(),
            'is_read' => $this->faker->boolean(),
            'read_at' => $this->faker->optional()->dateTimeBetween('-10 days', 'now'),
            // @todo: fix json factory data
            // 'data' => $this->faker->optional()->passthrough([
            //     'action' => $this->faker->randomElement(['create', 'update', 'delete']),
            //     'model' => $this->faker->randomElement(['task', 'project', 'sprint', 'user']),
            //     'model_id' => $this->faker->numberBetween(1, 100),
            // ]),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
