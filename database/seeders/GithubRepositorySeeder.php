<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Services\ActivityLoggerService;
use App\Services\GithubRepositoryService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class GithubRepositorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(GithubRepositoryService $service, string $ownerKey, string $repoName): void
    {
        // GithubRepository::factory(10)->create();
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'GitHub repository imported from seeder',
            data: ['owner_key' => $ownerKey, 'repo_name' => $repoName],
        );
    }
}
