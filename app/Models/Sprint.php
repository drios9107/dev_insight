<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'goal', 'project_id', 'start_date', 'end_date', 'status', 'velocity', 'actual_velocity', 'created_by'])]
class Sprint extends Model
{
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
