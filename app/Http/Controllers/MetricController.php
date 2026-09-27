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
        $tab = $request->get('tab', 'repository');
        $isRepositoryTab = $tab === 'repository';

        $repositoryId = $isRepositoryTab ? $request->get('repository_id') : null;
        $projectId = ! $isRepositoryTab ? $request->get('project_id') : null;

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
