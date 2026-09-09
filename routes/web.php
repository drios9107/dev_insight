<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommitController;
use App\Http\Controllers\GithubIssueController;
use App\Http\Controllers\GithubRepositoryController;
use App\Http\Controllers\GithubUserController;
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

    Route::get('all-comments', [CommentController::class, 'all'])->name('comment.all');
    Route::get('all-commits', [CommitController::class, 'all'])->name('commit.all');
    Route::get('all-githubs-issue', [GithubIssueController::class, 'all'])->name('github-issue.all');
    Route::get('all-githubs-repository', [GithubRepositoryController::class, 'all'])->name('github-repository.all');
    Route::get('all-notifications', [NotificationController::class, 'all'])->name('notification.all');
    Route::get('all-projects', [ProjectController::class, 'all'])->name('project.all');
    Route::get('all-pulls-request', [PullRequestController::class, 'all'])->name('pull-request.all');
    Route::get('all-pulls-request-review', [PullRequestReviewController::class, 'all'])->name('pull-request-review.all');
    Route::get('all-roles', [RoleController::class, 'all'])->name('role.all');
    Route::get('all-sprints', [SprintController::class, 'all'])->name('sprint.all');
    Route::get('all-tasks', [TaskController::class, 'all'])->name('task.all');
    Route::get('all-teams', [TeamController::class, 'all'])->name('team.all');
    Route::get('all-users', [UserController::class, 'all'])->name('user.all');
    Route::get('all-github-users', [GithubUserController::class, 'all'])->name('github-user.all');

    Route::resource('/comment', CommentController::class)->only($apiRoutes);
    Route::resource('/commit', CommitController::class)->only($apiRoutes);
    Route::resource('/github-issue', GithubIssueController::class)->only($apiRoutes);
    Route::resource('/github-repository', GithubRepositoryController::class)->only($apiRoutes);
    Route::resource('/notification', NotificationController::class)->only($apiRoutes);
    Route::resource('/project', ProjectController::class)->only($apiRoutes);
    Route::resource('/pull-request', PullRequestController::class)->only($apiRoutes);
    Route::resource('/pull-request-review', PullRequestReviewController::class)->only($apiRoutes);
    Route::resource('/role', RoleController::class)->only($apiRoutes);
    Route::resource('/sprint', SprintController::class)->only($apiRoutes);
    Route::resource('/task', TaskController::class)->only($apiRoutes);
    Route::resource('/team', TeamController::class)->only($apiRoutes);
    Route::resource('/user', UserController::class)->only($apiRoutes);
    Route::resource('/github-user', UserController::class)->only($apiRoutes);

    Route::get('metric', [MetricController::class, 'index'])->name('metric.index');
});

require __DIR__.'/settings.php';
