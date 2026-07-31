<?php

namespace App\Enums;

enum GithubIssueStateEnum: string
{
    case Open = 'open';
    case Closed = 'closed';
}
