<?php

namespace App\Http\Requests;

use App\Enums\PullRequestReviewStateEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PullRequestReviewRequest extends FormRequest
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
            'github_id' => 'required|integer|unique:pull_request_reviews,github_id',
            'reviewer_id' => 'required|exists:users,id',
            'pull_request_id' => 'required|exists:pull_requests,id',
            'state' => [
                'required',
                Rule::in(array_column(PullRequestReviewStateEnum::cases(), 'value')),
            ],
            'body' => 'nullable|string',
            'submitted_at' => 'required|date',
        ];
    }
}
