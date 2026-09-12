<?php

namespace Database\Seeders;

use App\Services\CommitService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class CommitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(CommitService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses'): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);
    }
}
