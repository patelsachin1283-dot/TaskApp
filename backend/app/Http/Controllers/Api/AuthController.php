<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    //
     public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registered successfully',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
     {
        $user = $request->user();

        $user->name   = $request->name;
        $user->email   = $request->email;

        if($request->filled('password')) {
            $user->password = $request->password;
        }
        $user->save();

        return response()->json([
            'message' => 'Profile Updated Successfully',
            'user'    => $user,
        ]); 
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message'  => 'Logged out successfully'
        ]);
    }
}
