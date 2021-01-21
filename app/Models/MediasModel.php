<?php

namespace App\Models;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediasModel extends Model
{
    protected $table = 'medias';
    protected $guarded = [];
    use HasFactory;

    function list(
        int $item_id = null,
        int $category_id = null,
        int $pag_limit = 1,
        int $pag_start = 0,
        string $search_value = null,
        string $sort_column = 'original_file_name',
        string $sort_direction = 'asc'
    ) {

        $query = $this
            ->orderBy($sort_column, $sort_direction);

        if($pag_limit >= 1)
            $query->forPage($pag_start, $pag_limit);

        if ($item_id > 0) {
            $query->where('medias.id', '=', $item_id);
        }

        if($category_id > 0) {
            $query->where('category_id', '=', $category_id);
        }

        if ($search_value) {
            $query->where('original_file_name', 'LIKE', '%' . $search_value . '%');
        }

        $data = $query->select(
            DB::raw("SQL_CALC_FOUND_ROWS medias.id"),
            'id',
            'category_id',
            'original_file_name',
            'internal_file_name',
            'play_count',
            'created_at'
        )->get();

        $total = DB::select("SELECT FOUND_ROWS() as `row_count`")[0]->row_count;

        return ['data' => $data, 'total' => $total];
    }
}
