<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::count() === 0) {
            User::factory()->create([
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'password' => Hash::make('Admin*123'),
                'role_id' => Role::whereName('Admin')->first()->id,
            ]);
        }

        // User::factory(5)->create();
    }
}
