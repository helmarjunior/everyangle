<?php

namespace App\Http\Requests\MediaRequest;

use Illuminate\Foundation\Http\FormRequest;

class CreateRequest extends FormRequest
{

    /**
     * @var mixed
     */
    private $file;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'category_id' => 'required|int',
            'files.*' =>'required|file|mimes:audio/mpeg,mpga,mp3,mp4,wav,aac'
        ];
    }
}
