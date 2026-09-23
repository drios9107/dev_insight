<?php

namespace App\Http\Controllers;

use App\Models\GithubRepository;
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
        $tab = $request->get('tab', 'repository');

        $repositoryMetrics = $this->metricsService->getRepositoryMetrics($repositoryId);
        $projectMetrics = $this->metricsService->getProjectTabMetrics();

        $repositories = GithubRepository::select('id', 'full_name')->get();

        return Inertia::render('metrics/index', [
            'repository_metrics' => $repositoryMetrics,
            'project_metrics' => $projectMetrics,
            'repositories' => $repositories,
            'selected_repository' => $repositoryId,
            'active_tab' => $tab,
            'title' => 'Metrics',
        ]);
    }
}
