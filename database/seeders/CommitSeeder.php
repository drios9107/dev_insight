<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Models\User;
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

        $adminId = User::whereName('Admin')->value('id')
            ?? throw new \RuntimeException('Admin user not found');

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'Commits imported from seeder',
            changes: ['owner_key' => $ownerKey, 'repo_name' => $repoName],
            userId: $adminId,
        );
    }
}
