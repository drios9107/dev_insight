<?php

namespace App\Enums;

enum ProjectStatusEnum: string
{
    case Planning = 'planning';
    case Active = 'active';
    case Paused = 'paused';
    case Completed = 'completed';
    case Archived = 'archived';
}
