<?php

namespace App\Http\Controllers;

use App\Models\GithubRepository;
use App\Models\GithubUser;
use App\Models\Project;
use App\Services\MetricService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MetricController extends Controller
{
    private MetricService $metricService;

    public function __construct(MetricService $metricService)
    {
        $this->metricService = $metricService;
    }

    public function index(Request $request): Response
    {
        $repositoryId = $request->get('repository_id');
        $projectId = $request->get('project_id');
        $developerId = $request->get('developer_id');
        $tab = $request->get('tab', 'repository');

        $repositoryMetrics = $this->metricService->getRepositoryTabMetrics($repositoryId);
        $projectMetrics = $this->metricService->getProjectTabMetrics($projectId);
        $developerMetrics = $this->metricService->getDeveloperTabMetrics($developerId);

        $repositories = GithubRepository::select('id', 'full_name')->get();
        $projects = Project::select('id', 'name')->orderBy('name')->get();
        $developers = GithubUser::select('id', 'username', 'name')
            ->orderBy('username')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->displayName,
            ]);

        return Inertia::render('metric/index', [
            'repository_metrics' => $repositoryMetrics,
            'project_metrics' => $projectMetrics,
            'developer_metrics' => $developerMetrics,
            'repositories' => $repositories,
            'projects' => $projects,
            'developers' => $developers,
            'selected_repository' => $repositoryId,
            'selected_project' => $projectId,
            'selected_developer' => $developerId,
            'active_tab' => $tab,
            'title' => 'Metrics',
        ]);
    }
}
