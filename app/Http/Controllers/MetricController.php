<?php

namespace App\Http\Controllers;

use App\Models\GithubRepository;
use App\Models\Project;
use App\Services\MetricService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetricController extends Controller
{
    private MetricService $metricService;

    public function __construct(MetricService $metricService)
    {
        $this->metricService = $metricService;
    }

    public function index(Request $request)
    {
        $repositoryId = $request->get('repository_id');
        $projectId = $request->get('project_id');
        $tab = $request->get('tab', 'repository');

        $repositoryMetrics = $this->metricService->getRepositoryTabMetrics($repositoryId);
        $projectMetrics = $this->metricService->getProjectTabMetrics($projectId);

        $repositories = GithubRepository::select('id', 'full_name')->get();
        $projects = Project::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('metric/index', [
            'repository_metrics' => $repositoryMetrics,
            'project_metrics' => $projectMetrics,
            'repositories' => $repositories,
            'projects' => $projects,
            'selected_repository' => $repositoryId,
            'selected_project' => $projectId,
            'active_tab' => $tab,
            'title' => 'Metrics',
        ]);
    }
}
