<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\ClaimMessage;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class ClaimMessageController extends Controller
{
    /**
     * List messages for a claim.
     */
    public function index(Request $request, string $claimId)
    {
        $claim = Claim::findOrFail($claimId);

        if (! $this->canAccess($request, $claim)) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $messages = $claim->messages()
            ->with('user:id,name,role')
            ->oldest()
            ->get();

        return response()->json($messages);
    }

    /**
     * Store a new message for a claim.
     */
    public function store(Request $request, string $claimId)
    {
        $claim = Claim::findOrFail($claimId);

        if (! $this->canAccess($request, $claim)) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $message = ClaimMessage::create([
            'claim_id' => $claim->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        if ($request->user()->role !== 'admin') {
            ActivityLogger::notifyAdmins(
                'claim.message',
                'Pesan klaim baru',
                $request->user()->name.' mengirim pesan pada klaim '.$claim->report?->item_name.'.',
                '/admin/claims',
            );
        }

        return response()->json([
            'message' => 'Message sent successfully',
            'claim_message' => $message->load('user:id,name,role'),
        ], 201);
    }

    /**
     * Determine if the current user can access the claim conversation.
     */
    private function canAccess(Request $request, Claim $claim): bool
    {
        return $request->user()->role === 'admin' || $claim->user_id === $request->user()->id;
    }
}
