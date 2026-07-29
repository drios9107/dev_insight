<?php

namespace App\Enums;

enum TaskStatusEnum: string
{
    case Backlog = 'backlog';
    case Todo = 'todo';
    case In_progress = 'in_progress';
    case Review = 'review';
    case Done = 'done';
    case Cancelled = 'cancelled';
}
