use hashbrown::HashMap;
// use std::collections::HashMap;
use std::sync::OnceLock;

// 関数呼び出し用のHashMapを作る
type DivergedFunc = fn(f64, f64, usize, f64) -> u8;
static MANDELBROT_FUNC: OnceLock<HashMap<&str, DivergedFunc>> = OnceLock::new();
pub fn init_mandelbrot_func_map() {
    let map = MANDELBROT_FUNC.get_or_init(|| {
        let mut m = HashMap::new();
        m.insert("mandelbrot_type1", get_n_diverged1 as DivergedFunc);
        m.insert("mandelbrot_type2", get_n_diverged2 as DivergedFunc);
        m.insert("mandelbrot_type3", get_n_diverged3 as DivergedFunc);
        m.insert("mandelbrot_type4", get_n_diverged4 as DivergedFunc);
        m.insert("mandelbrot_type5", get_n_diverged5 as DivergedFunc);
        m.insert("mandelbrot_type6", get_n_diverged6 as DivergedFunc);
        m.insert("mandelbrot_type7", get_n_diverged7 as DivergedFunc);
        m.insert("mandelbrot_type8", get_n_diverged8 as DivergedFunc);
        m.insert("mandelbrot_type9", get_n_diverged9 as DivergedFunc);
        m.insert("mandelbrot_type10", get_n_diverged10 as DivergedFunc);
        m
    });
}

// セルの発散判定を行い、判定までのイテレーション回数を返す
// Z = Z^2 + C
fn get_n_diverged1(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    // 複素数znの実部をxn、虚部をynとする
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * xn - yn * yn + c_real;
        let y_next = 2.0 * xn * yn + c_image;
        xn = x_next;
        yn = y_next;
        if yn * yn + xn * xn > lim_sup * lim_sup {
            // 複素数の絶対値がlim_supを超えると発散する
            return i as u8;
        }
    }
    n_limit as u8
}

// Z = Z^3 + C
fn get_n_diverged2(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * (xn * xn - 3.0 * yn * yn) + c_real;
        let y_next = yn * (3.0 * xn * xn - yn * yn) + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = Z^4 + C
fn get_n_diverged3(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * xn * xn * xn - 6.0 * xn * xn * yn * yn + yn * yn * yn * yn + c_real;
        let y_next = 4.0 * xn * yn * (xn * xn - yn * yn) + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = Z^5 + C
fn get_n_diverged4(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next =
            xn * (xn * xn * xn * xn - 10.0 * xn * xn * yn * yn + 5.0 * yn * yn * yn * yn) + c_real;
        let y_next =
            yn * (5.0 * xn * xn * xn * xn - 10.0 * xn * xn * yn * yn + yn * yn * yn * yn) + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = (Z')^2 + C
fn get_n_diverged5(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * xn - yn * yn + c_real;
        let y_next = -2.0 * xn * yn + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = (Z')^3 + C
fn get_n_diverged6(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * (xn * xn - 3.0 * yn * yn) + c_real;
        let y_next = yn * (yn * yn - 3.0 * xn * xn) + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = (Z')^4 + C
fn get_n_diverged7(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * xn * xn * xn - 6.0 * xn * xn * yn * yn + yn * yn * yn * yn + c_real;
        let y_next = 4.0 * xn * yn * (yn * yn - xn * xn) + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = (Z')^5 + C
fn get_n_diverged8(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next =
            xn * (xn * xn * xn * xn - 10.0 * xn * xn * yn * yn + 5.0 * yn * yn * yn * yn) + c_real;
        let y_next = -yn * (5.0 * xn * xn * xn * xn - 10.0 * xn * xn * yn * yn + yn * yn * yn * yn)
            + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = Z^10 + C
fn get_n_diverged9(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * xn * xn * xn * xn * xn * xn * xn * xn * xn
            - 45.0 * xn * xn * xn * xn * xn * xn * xn * xn * yn * yn
            + 210.0 * xn * xn * xn * xn * xn * xn * yn * yn * yn * yn
            - 210.0 * xn * xn * xn * xn * yn * yn * yn * yn * yn * yn
            + 45.0 * xn * xn * yn * yn * yn * yn * yn * yn * yn * yn
            - yn * yn * yn * yn * yn * yn * yn * yn * yn * yn
            + c_real;
        let y_next = 10.0 * xn * xn * xn * xn * xn * xn * xn * xn * xn * yn
            - 120.0 * xn * xn * xn * xn * xn * xn * xn * yn * yn * yn
            + 252.0 * xn * xn * xn * xn * xn * yn * yn * yn * yn * yn
            - 120.0 * xn * xn * xn * yn * yn * yn * yn * yn * yn * yn
            + 10.0 * xn * yn * yn * yn * yn * yn * yn * yn * yn * yn
            + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// Z = (Z')^10 + C
fn get_n_diverged10(c_real: f64, c_image: f64, n_limit: usize, lim_sup: f64) -> u8 {
    let mut xn = 0.0;
    let mut yn = 0.0;
    for i in 1..n_limit {
        let x_next = xn * xn * xn * xn * xn * xn * xn * xn * xn * xn
            - 45.0 * xn * xn * xn * xn * xn * xn * xn * xn * yn * yn
            + 210.0 * xn * xn * xn * xn * xn * xn * yn * yn * yn * yn
            - 210.0 * xn * xn * xn * xn * yn * yn * yn * yn * yn * yn
            + 45.0 * xn * xn * yn * yn * yn * yn * yn * yn * yn * yn
            - yn * yn * yn * yn * yn * yn * yn * yn * yn * yn
            + c_real;
        let y_next = -10.0 * xn * xn * xn * xn * xn * xn * xn * xn * xn * yn
            + 120.0 * xn * xn * xn * xn * xn * xn * xn * yn * yn * yn
            - 252.0 * xn * xn * xn * xn * xn * yn * yn * yn * yn * yn
            + 120.0 * xn * xn * xn * yn * yn * yn * yn * yn * yn * yn
            - 10.0 * xn * yn * yn * yn * yn * yn * yn * yn * yn * yn
            + c_image;
        xn = x_next;
        yn = y_next;
        if xn * xn + yn * yn > lim_sup * lim_sup {
            return i as u8;
        }
    }
    return n_limit as u8;
}

// 各セルについての色情報を格納する関数
pub fn generate_mandelbrot_set(
    canvas_w: usize,
    canvas_h: usize,
    zoom: f64,
    c_real: f64,
    c_image: f64,
    n_limit: usize,
    lim_sup: f64,
    mandelbrot_type: &str,
) -> Vec<u8> {
    let canvas_w_f64 = canvas_w as f64;
    let canvas_h_f64 = canvas_h as f64;
    let y_min = -zoom;
    let y_max = zoom;
    let x_min = -zoom;
    let x_max = zoom;
    // JavaScriptの8ビット符号なし整数の配列であるUint8ClampedArray型をつくりたいため、Vec<u8>で色情報を作る
    let mut data: Vec<u8> = vec![];
    for i in 0..canvas_h {
        let i_f64 = i as f64;
        let y = y_min + (y_max - y_min) * i_f64 / canvas_h_f64;
        for j in 0..canvas_w {
            let x = x_min + (x_max - x_min) * j as f64 / canvas_w_f64;
            // let iter_index = get_n_diverged1(x + c_real, y + c_image, n_limit, lim_sup);
            // 以下のHashMapのアクセスがかなり遅い印象。50[ms]くらいかかってる？
            let iter_index = MANDELBROT_FUNC.get().unwrap().get(mandelbrot_type).unwrap()(
                x + c_real,
                y + c_image,
                n_limit,
                lim_sup,
            );
            let r_color = 255 - iter_index % 255;
            let g_color = iter_index % 16 * 17;
            let b_color = iter_index % 8 * 32; //8色に塗り分ける
            data.push(r_color); //R
            data.push(g_color); //G
            data.push(b_color); //B
            data.push(255); //A
        }
    }
    data
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_get_n_diverged() {
        let max_iter = 10;
        assert_eq!(get_n_diverged1(1.0, 0.0, max_iter, 2.0), 3); // 0->1->2->5で発散と判定
        assert_eq!(get_n_diverged1(0.0, 0.0, max_iter, 2.0), max_iter as u8);
        assert_eq!(get_n_diverged1(0.0, 1.0, max_iter, 2.0), max_iter as u8);
    }
    #[test]
    fn test_generate_mandelbrot_set() {
        init_mandelbrot_func_map();

        let canvas_w = 2;
        let canvas_h = 2;
        // let x_min = -1.0;
        // let x_max = 1.0;
        // let y_min = -1.0;
        // let y_max = 1.0;
        let zoom = 1.0;
        let c_real = 0.0;
        let c_image = 0.0;
        let max_iter = 8;
        let lim_sup = 2.0;
        let mandelbrot_type = "mandelbrot_type1";
        assert_eq!(
            generate_mandelbrot_set(
                canvas_w,
                canvas_h,
                zoom,
                c_real,
                c_image,
                max_iter,
                lim_sup,
                mandelbrot_type,
            ),
            vec![252, 51, 96, 255, 247, 136, 0, 255, 247, 136, 0, 255, 247, 136, 0, 255]
        );
    }
}
