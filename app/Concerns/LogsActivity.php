<?php

namespace App\Concerns;

use App\Enums\ActivityTypeEnum;
use App\Services\ActivityLoggerService;
use Illuminate\Database\Eloquent\Model;

/**
 * @phpstan-require-extends Model
 */
trait LogsActivity
{
    public static function bootLogsActivity(): void
    {
        static::created(function (Model $model): void {
            /** @var Model&static $model */
            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Created,
                "{$model->activityLabel()} was created",
                changes: ['attributes' => $model->getAttributes()],
            );
        });

        static::updated(function (Model $model): void {
            /** @var Model&static $model */
            $dirty = $model->getChanges();
            unset($dirty['updated_at']);

            if ($dirty === []) {
                return;
            }

            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Updated,
                "{$model->activityLabel()} was updated",
                changes: [
                    'before' => array_intersect_key($model->getOriginal(), $dirty),
                    'after' => $dirty,
                ],
            );
        });

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
        $candidates = ['title', 'full_name', 'name', 'username', 'sha'];
        $value = null;

        foreach ($candidates as $attr) {
            $candidate = $this->getAttribute($attr);

            if (! empty($candidate)) {
                $value = (string) $candidate;
                break;
            }
        }

        $value ??= (string) $this->getKey();

        if (strlen($value) > 60) {
            $value = substr($value, 0, 57) . '...';
        }

        return class_basename($this) . ' «' . $value . '»';
    }
}
