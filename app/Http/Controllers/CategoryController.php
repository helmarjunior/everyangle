<?php

namespace App\Http\Controllers;

use App\Http\HttpResponse;
use App\Models\CategoriesModel;
use App\Http\Requests\CategoryRequest;


class CategoryController extends Controller
{

    function list($id = null, CategoriesModel $categoriesModel, HttpResponse $httpResponse)
    {
        try {
            $data = $categoriesModel->list($id, ($id ? 1 : 0));
            return response()->json($data, 200);
        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }

    function create(
        CategoryRequest\CreateRequest $request,
        CategoriesModel $categoriesModel,
        HttpResponse $httpResponse
    ) {
        try {
            $item = $categoriesModel::create([
                'name' => $request->name,
                'description' => $request->description
            ]);

            return response()->json($item, 201);

        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }


    function update(
        $id = null,
        CategoryRequest\CreateRequest $request,
        CategoriesModel $categoriesModel,
        HttpResponse $httpResponse
    ) {
        try {

            $category = $categoriesModel
                ->where('id', '=', $id);

            $category->update(
                [
                    'name' => $request->name,
                    'description' => $request->description
                ]
            );

            return response()->json([], 200);

        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }

    public function delete(
        $id = null,
        CategoriesModel $categoriesModel,
        HttpResponse $httpResponse
    ) {
        try {

            if (!$id) {
                return response()->json(['message' => 'Please inform a valid id.'], 400);
            }

            $result = $categoriesModel
                ->where('id', '=', $id)->delete();

            return response()->json($result, 200);
        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }

}
