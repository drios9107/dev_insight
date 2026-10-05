<?php

namespace App\Enums;

enum ActivityTypeEnum: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Deleted = 'deleted';

    case Fetched = 'fetched';
    case Synced = 'synced';
    case Imported = 'imported';
}
