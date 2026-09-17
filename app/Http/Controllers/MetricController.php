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

        $metrics = $this->metricService->getDashboardMetrics($repositoryId);

        $repositories = GithubRepository::select('id', 'full_name')->get();

        return Inertia::render('metric/index', [
            'metrics' => $metrics,
            'repositories' => $repositories,
            'selected_repository' => $repositoryId,
            'title' => 'Metrics',
        ]);
    }
}
