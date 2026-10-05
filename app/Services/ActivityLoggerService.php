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
     * @param  array<string, mixed>  $changes
     */
    public function log(
        ActivityTypeEnum $type,
        string $description,
        array $changes = [],
        ?int $userId = null,
    ): ActivityLog {
        return ActivityLog::create([
            'user_id'     => $userId ?? Auth::id(),
            'type'        => $type->value,
            'description' => $description,
            'changes'        => $changes === [] ? null : $changes,
            'ip_address'  => Request::ip(),
            'user_agent'  => Str::limit((string) Request::userAgent(), 255, ''),
        ]);
    }
}
