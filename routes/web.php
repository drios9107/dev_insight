<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommitController;
use App\Http\Controllers\GithubIssueController;
use App\Http\Controllers\GithubRepositoryController;
use App\Http\Controllers\MetricController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PullRequestController;
use App\Http\Controllers\PullRequestReviewController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    $apiRoutes = ['index', 'show', 'store', 'update', 'destroy'];

    Route::middleware('admin')->group(function () use ($apiRoutes) {
        Route::resource('/activity-log', ActivityLogController::class)->only($apiRoutes);
    });

    Route::resource('/comment', CommentController::class)->only($apiRoutes);
    Route::resource('/commit', CommitController::class)->only($apiRoutes);
    Route::resource('/github-issue', GithubIssueController::class)->only($apiRoutes);
    Route::resource('/github-repository', GithubRepositoryController::class)->only($apiRoutes);
    Route::resource('/metric', MetricController::class)->only($apiRoutes);
    Route::resource('/notification', NotificationController::class)->only($apiRoutes);
    Route::resource('/project', ProjectController::class)->only($apiRoutes);
    Route::resource('/pull-request', PullRequestController::class)->only($apiRoutes);
    Route::resource('/pull-request-review', PullRequestReviewController::class)->only($apiRoutes);
    Route::resource('/role', RoleController::class)->only($apiRoutes);
    Route::resource('/sprint', SprintController::class)->only($apiRoutes);
    Route::resource('/task', TaskController::class)->only($apiRoutes);
    Route::resource('/team', TeamController::class)->only($apiRoutes);
    Route::resource('/user', UserController::class)->only($apiRoutes);

});

require __DIR__.'/settings.php';
