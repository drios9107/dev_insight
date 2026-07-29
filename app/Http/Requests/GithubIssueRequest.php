<?php

namespace App\Http\Requests;

use App\Enums\GithubIssueState;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GithubIssueRequest extends FormRequest
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
            'github_id' => 'required|integer|unique:github_issues,github_id',
            'github_repository_id' => 'required|integer|exists:github_repositories,id',
            'number' => 'required|integer',
            'title' => 'required|string',
            'body' => 'nullable|string',
            'state' => [
                'required',
                Rule::in(array_column(GithubIssueState::cases(), 'value')),
            ],
            'author_id' => 'nullable|integer|exists:users,id',
            'task_id' => 'nullable|integer|exists:tasks,id',
            'closed_at' => 'nullable|date',
        ];
    }
}
