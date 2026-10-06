<?php

namespace App\Services;

abstract class BaseGithubService
{
    public function __construct(
        protected readonly GithubService $github,
    ) {}
}
