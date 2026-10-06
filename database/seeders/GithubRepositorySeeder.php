<?php

namespace Database\Seeders;

use App\Enums\ActivityTypeEnum;
use App\Models\User;
use App\Services\ActivityLoggerService;
use App\Services\GithubRepositoryService;
use Illuminate\Database\Seeder;

class GithubRepositorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(GithubRepositoryService $service, string $ownerKey, string $repoName): void
    {
        $adminId = User::whereName('Admin')->value('id')
            ?? throw new \RuntimeException('Admin user not found');
        $response = $service->fetchData($ownerKey, $repoName);

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'GitHub repository imported from seeder',
            changes: [
                'owner_key' => $ownerKey,
                'repo_name' => $repoName,
                'count' => $response['count'] ?? null,
            ],
            userId: $adminId,
        );
    }
}
