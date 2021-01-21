<?php


namespace App\Http\Controllers;

use App\Http\HttpResponse;
use App\Http\Requests\MediaRequest;
use App\Media\Media;
use App\Models\MediasModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class MediaController extends Controller
{

    function list($id = null, Request $request, MediasModel $mediasModel, HttpResponse $httpResponse)
    {
        try {

            $category_id = $request->category;

            $data = $mediasModel->list($id, $category_id, ($id ? 1 : 0));
            return response()->json($data, 200);
        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }

    public function create(MediaRequest\CreateRequest $request, MediasModel $mediasModel, HttpResponse $httpResponse)
    {
        if ($request->hasFile('files')) {
            try {

                $media = new Media();
                $upload = $media->processFiles($request->file('files'), $request->category_id);

                return response()->json($upload, 201);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }
        return response()->json(['message' => 'Invalid request.'], 400);
    }

    public function delete($id = null, HttpResponse $httpResponse)
    {
        try {

            /* sanitize */
            if (!$id) {
                return response()->json(['message' => 'Please inform a valid id.'], 400);
            }

            $media = new Media();
            $media->processDeleteFile($id);

            return response()->json([], 200);

        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }

    public function reproduce($id = null, HttpResponse $httpResponse)
    {
        try {
            /* sanitize */
            if (!$id) {
                return response()->json(['message' => 'Please inform a valid id.'], 400);
            }

            $media = new Media();
            $file = $media->processGetFile($id);

            if ($file) {
                return response($file['file_media']['file'], 200)->header('Content-Type', $file['file_media']['mimeType']);
            }
            else {
                return response()->json(['message' => 'File not found.'], 400);
            }

            return response()->json([], 200);

        } catch (QueryException $e) {
            return $httpResponse->replyError($e);
        } catch (Exception $e) {
            return $httpResponse->replyError($e);
        }
    }

}
