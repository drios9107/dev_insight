<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MetricRequest extends FormRequest
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
            'project_id' => 'required|exists:projects,id',
            'team_id' => 'required|exists:teams,id',
            'date' => 'required|date',
            'commits_count' => 'required|integer',
            'prs_opened' => 'required|integer',
            'prs_closed' => 'required|integer',
            'prs_merged' => 'required|integer',
            'issues_opened' => 'required|integer',
            'issues_closed' => 'required|integer',
            'tasks_completed' => 'required|integer',
            'tasks_in_progress' => 'required|integer',
            'sprint_velocity' => 'required|numeric',
            'average_review_time' => 'required|numeric',
            'code_additions' => 'required|integer',
            'code_deletions' => 'required|integer',
            'active_developers' => 'required|integer',
        ];
    }
}
