<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CommitRequest extends FormRequest
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
            'sha' => 'required',
            'github_repository_id' => 'required|integer|exists:github_repositories,id',
            'author_id' => 'nullable|integer|exists:users,id',
            'task_id' => 'nullable|integer|exists:tasks,id',
            'message' => 'nulable|string',
            'date' => 'nulable|date',
            'url' => 'required|url',
        ];
    }
}
