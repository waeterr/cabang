<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'item_name',
        'category',
        'description',
        'location',
        'date',
        'additional_info',
        'photo_path',
        'status',
        'rejection_reason',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'archived_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the report.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the claims for the report.
     */
    public function claims()
    {
        return $this->hasMany(Claim::class);
    }

    /**
     * Scope a query to only include approved reports.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved')->whereNull('archived_at');
    }

    /**
     * Scope a query to exclude archived reports.
     */
    public function scopeNotArchived($query)
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Scope a query to only include pending reports.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include lost items.
     */
    public function scopeLost($query)
    {
        return $query->where('type', 'lost');
    }

    /**
     * Scope a query to only include found items.
     */
    public function scopeFound($query)
    {
        return $query->where('type', 'found');
    }
}
