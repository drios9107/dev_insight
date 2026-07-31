<?php

namespace App\Http\Requests;

use App\Enums\PullRequestStateEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PullRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'github_id' => 'required|integer|unique:pull_requests,github_id',
            'github_repository_id' => 'required|exists:github_repositories,id',
            'number' => 'required|integer',
            'title' => 'required|string',
            'body' => 'nullable|string',
            'state' => [
                'required',
                Rule::in(array_column(PullRequestStateEnum::cases(), 'value')),
            ],
            'author_id' => 'nullable|exists:users,id',
            'assignee_id' => 'nullable|exists:users,id',
            'base_branch' => 'required|string',
            'head_branch' => 'required|string',
            'task_id' => 'nullable|exists:tasks,id',
            'closed_at' => 'nullable|date',
            'merged_at' => 'nullable|date',
            'merge_commit_sha' => 'nullable|string',
        ];
    }
}
