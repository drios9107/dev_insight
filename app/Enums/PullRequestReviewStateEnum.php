<?php

namespace App\Enums;

enum PullRequestReviewStateEnum: string
{
    case Approved = 'approved';
    case ChangesRequested = 'changes_requested';
    case Commented = 'commented';
    case Dismissed = 'dismissed';
}
