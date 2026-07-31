<?php

namespace Database\Seeders;

use App\Models\GithubRepository;
use Illuminate\Database\Seeder;

class GithubRepositorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GithubRepository::factory(10)->create();
    }
}
