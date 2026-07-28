<?php

namespace App\Http\Requests\Project;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $projectId = $this->route('project')?->id ?? $this->input('id');

        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('projects', 'name')->ignore($projectId),
            ],
            'description' => 'sometimes|string|max:255',
            'team_id' => 'sometimes|exists:teams,id',
            'owner_id' => 'sometimes|exists:users,id',
            'github_repository_id' => 'sometimes|exists:github_repositories,id',
            'status' => [
                'sometimes',
                Rule::in(array_column(ProjectStatus::cases(), 'value')),
            ],
            'start_date' => 'sometimes|numeric',
            'end_date' => 'sometimes|numeric',
            'color' => 'sometimes|string|max:255',
        ];
    }
}
