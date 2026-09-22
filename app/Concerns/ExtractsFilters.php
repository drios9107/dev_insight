<?php

namespace App\Concerns;

use Illuminate\Http\Request;

trait ExtractsFilters
{
    protected function extractFilters(Request $request, array $extraKeys = []): array
    {
        $commonKeys = ['search', 'sort', 'direction', 'per_page'];
        $keys = array_merge($commonKeys, $extraKeys);

        $filters = [];
        foreach ($keys as $key) {
            $value = $request->input($key);

            if (! is_null($value) && $value !== '') {
                $filters[$key] = $value;
            }
        }

        return $filters;
    }
}
