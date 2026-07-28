<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GithubRepositoryRequest extends FormRequest
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
            'github_id' => 'required|integer|unique:github_repositories,github_id',
            'name' => 'required|string',
            'full_name' => 'required|string',
            'url' => 'required|string',
            'description' => 'nullable|string',
            'is_private' => 'required|boolean',
            'default_branch' => 'required|string',
            'last_synced_at' => 'nullable|date',
            'project_id' => 'nullable|integer|exists:projects,id',
            'webhook_secret' => 'nullable|string',
        ];
    }
}
