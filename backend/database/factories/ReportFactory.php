<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'lost',
            'item_name' => fake()->words(3, true),
            'category' => fake()->randomElement(['Elektronik', 'Dokumen', 'Pakaian', 'Lainnya']),
            'description' => fake()->sentence(12),
            'location' => fake()->randomElement(['Ruang Baca Lt. 1', 'Ruang Baca Lt. 3', 'Lobi Perpustakaan']),
            'date' => fake()->dateTimeBetween('-1 month')->format('Y-m-d'),
            'status' => 'pending',
        ];
    }

    /**
     * Indicate that the report is an approved lost item.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'lost',
            'status' => 'approved',
        ]);
    }

    /**
     * Indicate that the report is an approved found item.
     */
    public function found(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'found',
            'status' => 'approved',
        ]);
    }
}
