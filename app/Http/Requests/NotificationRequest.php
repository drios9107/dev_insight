<?php

namespace App\Http\Requests;

use App\Enums\NotificationTypeEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NotificationRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'type' => [
                'required',
                Rule::in(array_column(NotificationTypeEnum::cases(), 'value')),
            ],
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'link' => 'nullable|string|url',
            'is_read' => 'required|boolean',
            'read_at' => 'nullable|date',
            'data' => 'nullable|json',
        ];
    }
}
