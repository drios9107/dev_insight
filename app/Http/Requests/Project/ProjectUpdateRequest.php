<?php

namespace App\Http\Requests\Project;

use App\Enums\ProjectStatusEnum;
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
        $projectId = $this->route('project');

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
                Rule::in(array_column(ProjectStatusEnum::cases(), 'value')),
            ],
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'color' => 'sometimes|string|max:255',
        ];
    }
}
