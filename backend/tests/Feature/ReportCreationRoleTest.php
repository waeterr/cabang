<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportCreationRoleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validLostPayload(): array
    {
        return [
            'item_name' => 'Tas Ransel Biru',
            'category' => 'Lainnya',
            'description' => 'Tas ransel biru dengan laptop di dalamnya.',
            'location' => 'Ruang Baca Lt. 3',
            'date' => now()->subDay()->format('Y-m-d'),
        ];
    }

    public function test_verified_student_can_create_lost_report(): void
    {
        $student = User::factory()->student()->create();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/reports', $this->validLostPayload());

        $response->assertCreated();
        $this->assertDatabaseHas('reports', [
            'user_id' => $student->id,
            'type' => 'lost',
            'status' => 'pending',
            'item_name' => 'Tas Ransel Biru',
        ]);
    }

    public function test_admin_cannot_create_lost_report_through_student_endpoint(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/reports', $this->validLostPayload());

        $response->assertForbidden();
        $this->assertDatabaseCount('reports', 0);
    }

    public function test_student_cannot_create_found_report_through_admin_endpoint(): void
    {
        $student = User::factory()->student()->create();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/admin/reports', [
            ...$this->validLostPayload(),
            'item_name' => 'Dompet Hitam',
        ]);

        $response->assertForbidden();
        $this->assertDatabaseCount('reports', 0);
    }

    public function test_admin_can_create_found_report_through_admin_endpoint(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/reports', [
            ...$this->validLostPayload(),
            'item_name' => 'Dompet Hitam',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('reports', [
            'user_id' => $admin->id,
            'type' => 'found',
            'status' => 'approved',
            'item_name' => 'Dompet Hitam',
        ]);
    }

    public function test_unverified_student_cannot_create_report(): void
    {
        $student = User::factory()->pendingVerification()->create();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/reports', $this->validLostPayload());

        $response->assertForbidden();
        $this->assertDatabaseCount('reports', 0);
    }

    public function test_admin_can_permanently_delete_archived_report(): void
    {
        $admin = User::factory()->admin()->create();
        $report = Report::factory()->found()->create(['archived_at' => now()]);
        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/admin/reports/{$report->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('reports', ['id' => $report->id]);
    }

    public function test_admin_cannot_permanently_delete_active_report(): void
    {
        $admin = User::factory()->admin()->create();
        $report = Report::factory()->found()->create();
        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/admin/reports/{$report->id}");

        $response->assertStatus(422);
        $this->assertDatabaseHas('reports', ['id' => $report->id]);
    }
}
