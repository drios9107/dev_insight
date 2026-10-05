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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $sprintId = $this->input('id') ?? $this->route('sprint');

        $nameRule = $sprintId
            ? 'sometimes|required|string|unique:sprints,name,' . $sprintId
            : 'required|string|unique:sprints,name';

        $rules = [
            'name' => $nameRule,
            'goal' => 'nullable|string',
            'project_id' => 'required|integer|exists:projects,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => [
                'required',
                Rule::in(array_column(SprintStatusEnum::cases(), 'value')),
            ],
            'velocity' => 'nullable|numeric|min:0',
            'actual_velocity' => 'nullable|numeric|min:0',
        ];

        if ($sprintId) {
            $rules['project_id'] = 'sometimes|required|integer|exists:projects,id';
            $rules['start_date'] = 'sometimes|required|date';
            $rules['end_date'] = 'sometimes|required|date|after_or_equal:start_date';
            $rules['status'] = [
                'sometimes',
                'required',
                Rule::in(array_column(SprintStatusEnum::cases(), 'value')),
            ];
        }

        return $rules;
    }
}
