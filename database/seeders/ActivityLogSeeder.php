<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Task;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Task::count('id') > 0 && ActivityLog::count()===0) {
            ActivityLog::factory(10)->create();
        }
    }
}
