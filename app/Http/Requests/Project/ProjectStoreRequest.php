<?php

namespace App\Http\Requests\Project;

use App\Enums\ProjectStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:projects,name',
            'description' => 'nullable|string|max:255',
            'team_id' => 'required|exists:teams,id',
            'owner_id' => 'required|exists:users,id',
            'github_repository_id' => 'required|exists:github_repositories,id',
            'status' => [
                'required',
                Rule::in(array_column(ProjectStatusEnum::cases(), 'value')),
            ],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'color' => 'nullable|string|max:255',
        ];
    }
}
