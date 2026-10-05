<?php

namespace App\Concerns;

use App\Enums\ActivityTypeEnum;
use App\Services\ActivityLoggerService;
use Illuminate\Database\Eloquent\Model;

/**
 * @phpstan-require-extends Model
 */
trait LogsDeletion
{
    public static function bootLogsDeletion(): void
    {
        static::deleted(function (Model $model): void {
            /** @var Model&static $model */
            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Deleted,
                "{$model->activityLabel()} was deleted",
                changes: ['attributes' => $model->getOriginal()],
            );
        });
    }

    public function activityLabel(): string
    {
        return class_basename($this) . ' #' . $this->getKey();
    }
}
