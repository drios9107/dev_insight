<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Models\User;
use App\Services\ActivityLoggerService;
use App\Services\GithubService;
use App\Services\PullRequestReviewService;
use Illuminate\Database\Seeder;

class PullRequestReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(PullRequestReviewService $service, string $ownerKey, string $repoName): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice, $ownerKey, $repoName);

        $adminId = User::whereName('Admin')->value('id')
            ?? throw new \RuntimeException('Admin user not found');

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'Pull request reviews imported from seeder',
            data: ['owner_key' => $ownerKey, 'repo_name' => $repoName],
            userId: $adminId,
        );
    }
}
