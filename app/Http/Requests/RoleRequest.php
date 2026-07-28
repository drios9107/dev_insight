<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
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
        $roleId = $this->route('role')?->id ?? $this->input('id');
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ];
        if ($roleId) {
            $rules['name'] = 'required|string|max:255|unique:roles,name,'.$roleId;
        }

        return $rules;
    }
}
