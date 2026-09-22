<?php

namespace Database\Seeders;

use App\Models\Sprint;
use Illuminate\Database\Seeder;

class SprintSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Sprint::count() === 0) {
            Sprint::factory(10)->create();
        }
    }
}
