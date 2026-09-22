<?php

namespace Database\Seeders;

use App\Models\GithubIssue;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (GithubIssue::count('id') > 0 && Task::count() === 0) {
            Task::factory(10)->create();
        }
    }
}
