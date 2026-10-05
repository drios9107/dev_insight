<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Models\User;
use App\Services\ActivityLoggerService;
use App\Services\GithubService;
use App\Services\PullRequestService;
use Illuminate\Database\Seeder;

class PullRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(PullRequestService $service, string $ownerKey, string $repoName): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice, 'all', $ownerKey, $repoName);

        $adminId = User::whereName('Admin')->value('id')
            ?? throw new \RuntimeException('Admin user not found');

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'Pull requests imported from seeder',
            data: ['owner_key' => $ownerKey, 'repo_name' => $repoName],
            userId: $adminId,
        );
    }
}
