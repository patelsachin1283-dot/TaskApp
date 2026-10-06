<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ProfilePhotoController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function() {
    Route::get('user', [AuthController::class, 'me']);
    Route::put('profile', [AuthController::class, 'updateProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('/profile/photo', [ProfilePhotoController::class, 'store']);
    Route::delete('/profile/photo', [ProfilePhotoController::class, 'destroy']);

    Route::get('tasks/stats', [TaskController::class, 'stats']);
    Route::apiResource('tasks', TaskController::class);

});