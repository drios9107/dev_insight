<?php

namespace App\Enums;

enum PullRequestStateEnum: string
{
    case Open = 'open';
    case Closed = 'closed';
    case Merged = 'merged';
}
