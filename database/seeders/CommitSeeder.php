<?php

namespace Database\Seeders;

use App\Models\Commit;
use App\Services\CommitService;
use App\Services\GithubService;
use Illuminate\Database\Seeder;

class CommitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(CommitService $service): void
    {
        $gservice = new GithubService;

        $service->fetchData($gservice);
    }
}
