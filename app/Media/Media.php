<?php

namespace App\Media;

use Illuminate\Support\Facades\Log;
use App\Models\MediasModel;
use File;
use Storage;

DEFINE('FILES_DESTINATION_PATH', 'public/upload/files/');

class Media
{

    private $category_id;
    private $files;

    function processFiles(array $files, int $category_id): array
    {
        /* Sanitize */
        if (empty($files)) {
            throw new \Exception('Array of files is empty');
        }
        if (empty($category_id)) {
            throw new \Exception('Category ID is empty');
        }

        $mediasModel = new MediasModel();
        $result = array('success' => 0, 'fail' => 0);

        foreach ($files as $file) {
            try {
                $original_filename = $file->getClientOriginalName();
                $internal_filename = substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0,
                        9) . '.' . $file->extension();

                /* insert database */
                $data = $mediasModel::create([
                    'category_id' => $category_id,
                    'original_file_name' => $original_filename,
                    'internal_file_name' => $internal_filename
                ]);

                /* if stored on database, move the file to the filesystem */
                if ($data) {
                    $fileWasStored = $this->storeFile($file, $internal_filename);
                    if ($fileWasStored) {
                        $result['success'] += 1;
                    }
                    else {
                        $result['fail'] += 1;
                    }
                }
                else {
                    $result['fail'] += 1;
                }

            } catch (Exception $error) {
                $result['fail'] += 1;

                Log::error(sprintf("%s [%s]:%d | [%s] %s",
                    date("Y-m-d H:i:s"),
                    $error->getFile(),
                    $error->getLine(),
                    $error->getCode(),
                    $error->getMessage()
                ));
            } catch (QueryException $error) {
                Log::error(sprintf("%s [%s]:%d | [%s] %s",
                    date("Y-m-d H:i:s"),
                    $error->getFile(),
                    $error->getLine(),
                    $error->getCode(),
                    $error->getMessage()
                ));
            }
        }
        return $result;
    }

    function storeFile(object $file, string $filename): bool
    {
        try {
            $path = $file->storeAs(FILES_DESTINATION_PATH, $filename);
            return ($path) ? true : false;
        } catch (Exception $error) {
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        }
        return false;
    }

    function deleteFile(string $filename): bool
    {
        try {

            $full_path_filename = sprintf("%s%s", FILES_DESTINATION_PATH, $filename);

            if (Storage::exists($full_path_filename)) {
                $deleted = Storage::delete($full_path_filename);
                return boolval($deleted);
            }
        } catch (Exception $error) {
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        }
        return false;

    }

    function getFile(string $filename): array
    {
        try {

            $full_path_filename = sprintf("%s%s", FILES_DESTINATION_PATH, $filename);

            if (Storage::exists($full_path_filename)) {
                $size = Storage::size($full_path_filename);
                $type = Storage::mimeType($full_path_filename);
                $file = Storage::get($full_path_filename);
                return ['mimeType' => $type, 'file' => $file, 'size' => $size];
            }
        } catch (Exception $error) {
            echo "file do not exist...";
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        }
        return [];

    }

    function processDeleteFile($file_id): bool
    {
        /* Sanitize */
        if (empty($file_id)) {
            throw new \Exception('Array of files is empty');
        }

        try {
            $mediasModel = new MediasModel();

            /* get file data on db */
            $mediaData = $mediasModel->where('id', '=', $file_id)->first();

            if (!$mediaData) {
                throw new \Exception('File not found or already deleted');
            }

            /* delete file data from db */
            $totalAffectedRows = $mediasModel->where('id', '=', $file_id)->delete();

            if ($totalAffectedRows) {
                return $this->deleteFile($mediaData['internal_file_name']);
            }
            else {
                throw new \Exception('File not found or already deleted');
            }

        } catch (Exception $error) {
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        } catch (QueryException $error) {
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        }

        return false;
    }

    function processGetFile($file_id): array
    {
        /* Sanitize */
        if (empty($file_id)) {
            throw new \Exception('Array of files is empty');
        }

        try {
            $mediasModel = new MediasModel();

            /* get file details on db */
            $mediaInfo = $mediasModel->where('id', '=', $file_id)->first();

            if (!$mediaInfo) {
                throw new \Exception('File not found or already deleted');
            }

            $fileMedia = $this->getFile($mediaInfo['internal_file_name']);

            return [
                'file_info' => $mediaInfo,
                'file_media' => $fileMedia
            ];


        } catch (Exception $error) {
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        } catch (QueryException $error) {
            Log::error(sprintf("%s [%s]:%d | [%s] %s",
                date("Y-m-d H:i:s"),
                $error->getFile(),
                $error->getLine(),
                $error->getCode(),
                $error->getMessage()
            ));
        }

        return [];
    }

}
