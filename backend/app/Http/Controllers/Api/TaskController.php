<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    //
     public function index(Request $request)
    {
        $tasks = $request->user()->tasks()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', '%' . $request->search . '%'))
            ->latest()
            ->paginate(8);

        return TaskResource::collection($tasks);
    }

    public function stats(Request $request): JsonResponse
    {
        $tasks = $request->user()->tasks();

        return response()->json([
            'total'       => (clone $tasks)->count(),
            'pending'     => (clone $tasks)->where('status', 'pending')->count(),
            'in_progress' => (clone $tasks)->where('status', 'in_progress')->count(),
            'completed'   => (clone $tasks)->where('status', 'completed')->count(),
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create($request->validated());

        return (new TaskResource($task))
            ->additional(['message' => 'Task created successfully'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Task $task): TaskResource
    {
        $this->ensureOwner($request, $task);

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $this->ensureOwner($request, $task);

        $task->update($request->validated());

        return (new TaskResource($task))->additional(['message' => 'Task updated successfully']);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->ensureOwner($request, $task);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    private function ensureOwner(Request $request, Task $task): void
    {
        abort_if($task->user_id !== $request->user()->id, 403, 'You are not allowed to access this task.');
    }
}
