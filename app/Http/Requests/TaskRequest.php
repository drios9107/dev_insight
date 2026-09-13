<?php

namespace App\Http\Requests;

use App\Enums\TaskPriorityEnum;
use App\Enums\TaskStatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
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
            'title' => 'required|string|unique:tasks,title',
            'description' => 'nullable|string',
            'project_id' => 'nullable|integer|exists:projects,id',
            'sprint_id' => 'nullable|integer|exists:sprints,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'reporter_id' => 'required|integer|exists:users,id',
            'status' => [
                'required',
                Rule::in(array_column(TaskStatusEnum::cases(), 'value')),
            ],
            'priority' => [
                'nullable|',
                Rule::in(array_column(TaskPriorityEnum::cases(), 'value')),
            ],
            'story_points' => 'nullable|numeric|min:0',
            'github_issue_id' => 'nullable|numeric',
            'due_date' => 'nullable|string',
            'completed_at' => 'nullable|string',
            'hours_estimate' => 'nullable|numeric|min:1',
            'hours_spent' => 'nullable|numeric|min:0',
            'order' => 'nullable|numeric|min:0',
        ];
    }
}
