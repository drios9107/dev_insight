<?php

namespace App\Services;

use App\Models\Metric;
use Illuminate\Http\Request;

class MetricService
{
    public function index(?Request $request = null)
    {
        return Metric::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Metric::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Metric
     */
    public function show($id)
    {
        $item = Metric::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return Metric::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Metric::destroy($id) !== null;
    }
}
