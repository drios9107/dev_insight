<?php

namespace App\Services;

use App\Enums\ActivityTypeEnum;
use App\Models\ActivityLog;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class ActivityLoggerService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function log(
        ActivityTypeEnum $type,
        string $description,
        ?Model $subject = null,
        array $data = [],
        ?int $userId = null,
    ): ActivityLog {
        if ($subject instanceof ActivityLog) {
            return new ActivityLog;
        }

        return ActivityLog::create([
            'user_id' => $userId ?? Auth::id(),
            'team_id' => $subject?->getAttribute('team_id'),
            'project_id' => $subject?->getAttribute('project_id'),
            'task_id' => $subject instanceof Task ? $subject->getKey() : null,
            'type' => $type->value,
            'description' => $description,
            'data' => $data === [] ? null : $data,
            'ip_address' => Request::ip(),
            'user_agent' => Str::limit((string) Request::userAgent(), 255, ''),
        ]);
    }
}
