<?php

namespace App\Enums;

enum GithubIssueState: string
{
    case Open = 'open';
    case Closed = 'closed';
}
