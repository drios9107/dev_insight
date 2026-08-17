<?php

namespace Database\Seeders;

use App\Services\GithubService;
use App\Services\PullRequestService;
use Illuminate\Database\Seeder;

class PullRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(PullRequestService $service): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice);
    }
}
