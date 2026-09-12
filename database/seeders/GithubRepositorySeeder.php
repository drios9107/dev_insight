<?php

namespace Database\Seeders;

use App\Models\GithubRepository;
use App\Services\GithubRepositoryService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class GithubRepositorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(GithubRepositoryService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses'): void
    {
        // GithubRepository::factory(10)->create();
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);
    }
}
