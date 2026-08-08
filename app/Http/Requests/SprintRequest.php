<?php

namespace App\Http\Requests;

use App\Enums\SprintStatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SprintRequest extends FormRequest
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
        $sprintId = $this->input('id') ?? $this->route('sprint');
        $rules = [
            'name' => 'required|string|unique:sprints,name',
            'goal' => 'nullable|string',
            'project_id' => 'required|integer|exists:projects,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => [
                'required',
                Rule::in(array_column(SprintStatusEnum::cases(), 'value')),
            ],
            'velocity' => 'nullable|numeric|min:0',
            'actual_velocity' => 'nullable|numeric|min:0',
            'created_by' => 'required|integer|exists:users,id',
        ];
        if ($sprintId) {
            $rules['name'] = 'nullable|string|unique:sprints,name,'.$sprintId;
            if ($this->input('project_id')) {
                $rules['project_id'] = 'nullable|integer|exists:projects,id';
            }
            if ($this->input('start_date')) {
                $rules['start_date'] = 'nullable|date';
            }
            if ($this->input('end_date')) {
                $rules['end_date'] = 'nullable|date';
            }
        }

        return $rules;
    }
}
