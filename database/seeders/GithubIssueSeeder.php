<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Models\User;
use App\Services\ActivityLoggerService;
use App\Services\GithubIssueService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class GithubIssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(GithubIssueService $service, string $ownerKey, string $repoName): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);

        $adminId = User::whereName('Admin')->value('id')
            ?? throw new \RuntimeException('Admin user not found');

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'GitHub issues imported from seeder',
            changes: ['owner_key' => $ownerKey, 'repo_name' => $repoName],
            userId: $adminId,
        );
    }
}
