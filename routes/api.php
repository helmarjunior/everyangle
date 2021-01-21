<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\CategoryController;

Route::get('media',[MediaController::class, 'list']);
Route::get('media/{id}',[MediaController::class, 'reproduce']);
Route::post('media',[MediaController::class, 'create']);
Route::put('media/{id}',[MediaController::class, 'update']);
Route::delete('media/{id}',[MediaController::class, 'delete']);

Route::get('category',[CategoryController::class, 'list']);
Route::get('category/{id}',[CategoryController::class, 'list'])->where('id', '[0-9]+');
Route::post('category',[CategoryController::class, 'create']);
Route::put('category/{id}',[CategoryController::class, 'update'])->where('id', '[0-9]+');
Route::delete('category/{id}',[CategoryController::class, 'delete'])->where('id', '[0-9]+');
