<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClaimMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_id',
        'user_id',
        'message',
    ];

    /**
     * Get the claim that owns the message.
     */
    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }

    /**
     * Get the message sender.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
