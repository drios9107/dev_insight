<?php

namespace Database\Factories;

use App\Enums\SprintStatusEnum;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sprint>
 */
class SprintFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-30 days', '+30 days');
        $endDate = clone $startDate;
        $endDate->modify('+'.rand(10, 14).' days');

        $statuses = array_column(SprintStatusEnum::cases(), 'value');
        $status = $this->faker->randomElement($statuses);

        return [
            'name' => 'Sprint '.$this->faker->numberBetween(1, 50),
            'goal' => $this->faker->optional()->sentence(6),
            'project_id' => Project::inRandomOrder(0)->first()->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $status,
            'velocity' => $this->faker->optional()->numberBetween(5, 30),
            'actual_velocity' => $status === 'completed' ? $this->faker->numberBetween(5, 30) : null,
            'created_by' => User::inRandomOrder(0)->first()->id,
        ];
    }
}
