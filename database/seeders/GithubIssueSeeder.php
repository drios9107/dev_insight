<?php

namespace Database\Seeders;

use App\Services\GithubIssueService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class GithubIssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(GithubIssueService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses'): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);
    }
}
