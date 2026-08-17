<?php

namespace Database\Seeders;

use App\Services\GithubService;
use App\Services\PullRequestReviewService;
use Illuminate\Database\Seeder;

class PullRequestReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(PullRequestReviewService $service): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice);
    }
}
