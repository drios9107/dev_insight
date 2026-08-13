<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            TeamSeeder::class,
            GithubRepositorySeeder::class,
            ProjectSeeder::class,
            GithubIssueSeeder::class,
            SprintSeeder::class,
            TaskSeeder::class,
            CommitSeeder::class,
            PullRequestSeeder::class,
            PullRequestReviewSeeder::class,
            CommentSeeder::class,
            MetricSeeder::class,
            NotificationSeeder::class,
            ActivityLogSeeder::class,

        ]);
    }
}
