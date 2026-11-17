<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
        ]);

        // Create admin user
        User::create([
            'name' => 'Admin CaBang',
            'nim' => 'ADMIN001',
            'email' => 'admin@cabang.undip.ac.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_verified' => true,
            'verification_status' => 'approved',
        ]);

        // Create test student user
        User::create([
            'name' => 'Mahasiswa Test',
            'nim' => '24060122140001',
            'email' => 'student@students.undip.ac.id',
            'password' => bcrypt('password'),
            'role' => 'student',
            'is_verified' => true,
            'verification_status' => 'approved',
            'ktm_path' => 'ktm/test.jpg',
        ]);
    }
}
