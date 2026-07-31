<?php

namespace Database\Seeders;

use App\Models\PullRequestReview;
use Illuminate\Database\Seeder;

class PullRequestReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PullRequestReview::factory(10)->create();
    }
}
