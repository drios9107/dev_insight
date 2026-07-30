<?php

namespace App\Enums;

enum NotificationTypeEnum: string
{
    case Info = 'info';
    case Warning = 'warning';
    case Error = 'error';
    case Success = 'success';
}
