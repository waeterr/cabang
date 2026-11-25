<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'user_id',
        'proof_description',
        'proof_path',
        'contact_info',
        'status',
        'rejection_reason',
    ];

    /**
     * Get the report that owns the claim.
     */
    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    /**
     * Get the user that owns the claim.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get messages for this claim.
     */
    public function messages()
    {
        return $this->hasMany(ClaimMessage::class);
    }

    /**
     * Scope a query to only include pending claims.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved claims.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
