<?php

namespace App\Enums;

enum SprintStatusEnum: string
{
    case Planning = 'planning';
    case Active = 'active';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
