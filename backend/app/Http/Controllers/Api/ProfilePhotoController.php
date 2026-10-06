<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePhotoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class ProfilePhotoController extends Controller
{
    //
    public function store(UpdatePhotoRequest $request): JsonResponse
    {
        $user = $request->user();

        if($user->photo) {
            Storage::disk('public')->delete($user->photo->image);
        }

        $path = $request->file('image')->store('photos', 'public');

        $user->photo()->updateOrCreate([], ['image' => $path]);

        $user->load('photo');

        return response()->json([
            'message' => 'photo updated successfully',
            'user' => $user,
        ]);
    }


public function destroy(Request $request): JsonResponse
{
    $user = $request->user();

    if($user->photo){
        Storage::disk('public')->delete($user->photo->image);
        $user->photo->delete();
    }

    $user->load('photo');

    return response()->json([
        'message'   => 'Photo removed successfully',
        'user'  =>  $user,
    ]);
}

    
}
