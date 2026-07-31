<?php

namespace Database\Seeders;

use App\Models\GithubIssue;
use Illuminate\Database\Seeder;

class GithubIssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GithubIssue::factory(10)->create();
    }
}
