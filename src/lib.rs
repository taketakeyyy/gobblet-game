mod logic;
mod utils;
use wasm_bindgen::prelude::*;
use wasm_bindgen::{Clamped, JsCast};
use web_sys::ImageData;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace=console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! measure_elapsed_time {
    ($t:tt,$s:block) => {{
        let window = web_sys::window().expect("should have a window in this context");
        let performance = window
            .performance()
            .expect("performance should be available");
        let start = performance.now();
        let result = { $s };
        let end = performance.now();
        console_log!("{}:{}[ms]!", $t, end - start);
        result
    }};
}

// 初期化関数
#[wasm_bindgen]
pub fn init_func_rs() {
    logic::init_mandelbrot_func_map();
}

// generate_mandelbrot_setのラッパー関数
#[wasm_bindgen]
pub fn generate_mandelbrot_set_rs(
    canvas_w: usize,
    canvas_h: usize,
    zoom: f64,
    c_real: f64,
    c_image: f64,
    max_iter: usize,
    lim_sup: f64,
    mandelbrot_type: &str,
) -> Vec<u8> {
    logic::generate_mandelbrot_set(
        canvas_w,
        canvas_h,
        zoom,
        c_real,
        c_image,
        max_iter,
        lim_sup,
        mandelbrot_type,
    )
}

// マンデルブロ集合を描画する
#[wasm_bindgen]
pub fn draw_mandelbrot_set_rs() {
    const CANVAS_ID: &str = "id-canvas_wasm";
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id(CANVAS_ID).unwrap();
    // HhtmlCanvasElement型のAPIを使うためにElement型からキャストする
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();
    // Object型からCanvasRenderingContext2d型にキャストする
    let context = canvas
        .get_context("2d") // Result<Option<Object>, JsValue>
        .unwrap() // Option<Object>
        .unwrap() //Object
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();
    let canvas_w = canvas.width() as usize;
    let canvas_h = canvas.height() as usize;
    const X_MIN: f64 = -1.5;
    const X_MAX: f64 = 0.5;
    const Y_MIN: f64 = -1.0;
    const Y_MAX: f64 = 1.0;
    const zoom: f64 = 2.0;
    // const X_MIN: f64 = -0.000274348423;
    // const X_MAX: f64 = 0.000274348423;
    // const Y_MIN: f64 = -0.000274348423;
    // const Y_MAX: f64 = 0.000274348423;
    const MAX_ITER: usize = 64;
    const LIM_SUP: f64 = 2.0;

    let mut result = measure_elapsed_time!("generate:wasm\telapsed:", {
        let c_real = 0.0;
        let c_image = 0.0;
        logic::generate_mandelbrot_set(
            canvas_w,
            canvas_h,
            zoom,
            c_real,
            c_image,
            MAX_ITER,
            LIM_SUP,
            "mandelbrot_type1",
        )
    });
    measure_elapsed_time!("draw:wasm\telapsed:", {
        let data = ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(&mut result),
            canvas.width(),
            canvas.height(),
        );
        if let Ok(data) = data {
            let _ = context.put_image_data(&data, 0.0, 0.0);
        }
    })
}
