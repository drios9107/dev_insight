<?php

namespace Database\Seeders;

use App\Models\Commit;
use Illuminate\Database\Seeder;

class CommitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Commit::factory(10)->create();
    }
}
