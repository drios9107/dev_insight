<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Services\ActivityLoggerService;
use App\Services\CommitService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class CommitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(CommitService $service, string $ownerKey, string $repoName): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'Commits imported from seeder',
            data: ['owner_key' => $ownerKey, 'repo_name' => $repoName],
        );
    }
}
