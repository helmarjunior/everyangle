<?php

namespace App\Models;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriesModel extends Model
{

    protected $table = 'categories';
    protected $guarded = [];
    use HasFactory;

    function list(
        int $item_id = null,
        int $pag_limit = 1,
        int $pag_start = 0,
        string $search_value = null,
        string $sort_column = 'name',
        string $sort_direction = 'asc'
    ) {

        $query = $this
            ->orderBy($sort_column, $sort_direction);

        if($pag_limit >= 1)
            $query->forPage($pag_start, $pag_limit);

        if ($item_id > 0) {
            $query->where('categories.id', '=', $item_id);
        }

        if ($search_value) {
            $query->where('name', 'LIKE', '%' . $search_value . '%')
                ->orWhere('description', '%' . $search_value . '%');
        }

        $data = $query->select(
            DB::raw("SQL_CALC_FOUND_ROWS categories.id"),
            'id',
            'name',
            'description'
        )->get();

        $total = DB::select("SELECT FOUND_ROWS() as `row_count`")[0]->row_count;

        return ['data' => $data, 'total' => $total];
    }

}
