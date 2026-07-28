<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TeamRequest extends FormRequest
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
        $teamId = $this->input('id') ?? $this->route('id');
        $rules = [
            'name' => 'required|string|max:255|unique:teams,name',
            'description' => 'nullable|string|max:255',
            'owner_id' => 'required|exists:users,id',
            'avatar_url' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ];
        if ($teamId) {
            $rules['name'] = 'nullable|string|max:255|unique:teams,name,'.$teamId;
            $rules['is_active'] = 'nullable|boolean';
        }

        return $rules;
    }
}
