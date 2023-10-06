'use strict'

import './index.scss';
import './scss/board.scss';
import './scss/footer.scss';
import './scss/gobblet.scss';
import './scss/desk.scss';
import './scss/inventory.scss';
import './scss/setting.scss';
import './scss/game-message.scss';
import './image/kuro.png';
import './image/siro.png';
import { init_func_rs, generate_mandelbrot_set_rs } from "../../pkg/mandelbrot";
import * as domops from "./ts/domops";
import { Game, GameState } from "./ts/game";
// import { generateMandelbrotSet } from "./ts/mandelbrot";
import * as consts from "./ts/consts";

let g_game: Game;

console.log("start loading wasm");
const wasmMod = import("../../pkg").catch(console.error);


// wasmの読み込みは非同期で行われるので、Promiseで読み込み完了を待って、button要素のonClickに登録。
Promise.all([wasmMod]).then(async function () {
    console.log("finished loading wasm");
    init_func_rs();
});

// ページの読み込み完了待ってから実行
window.onload = function () {
    add_event_click_gobblet();
    add_event_click_game_start();
    add_event_click_box();
}

// ゴブレットをクリックしたときのイベント
const click_gobblet = (e: Event) => {
    if (g_game == null) return;
    g_game.action_click_gobblet(e);
}

// ゴブレットをクリックしたときのイベント追加
const add_event_click_gobblet = () => {
    const gobs = document.getElementsByClassName(consts.CLS_PLAYER_GOBBLET);
    for (let i = 0; i < gobs.length; i++) {
        gobs[i].addEventListener("click", click_gobblet);
    }
};

// 「開始」ボタンをクリックしたときのイベント
const click_game_start = () => {
    // すべて初期化
    if (g_game != null) {
        g_game.unmark_selecting_gobblet();
    }
    initialize_inventory();
    g_game = new Game(domops.get_attack_order());
}

// 「開始」ボタンをクリックしたときのイベント追加
const add_event_click_game_start = () => {
    const btn = document.getElementById(consts.ID_GAME_START_BTN) as HTMLButtonElement;
    btn.addEventListener("click", click_game_start);
}

// マスをクリックしたときのイベント
const click_box = (e: Event) => {
    if (g_game == null) return;
    g_game.action_click_box(e);
}

// マスをクリックしたときのイベント追加
const add_event_click_box = () => {
    const boxs = document.getElementsByClassName(consts.CLS_BOX);
    for (let i = 0; i < boxs.length; i++) {
        boxs[i].addEventListener("click", click_box);
    }
}

// インベントリを初期化する
const initialize_inventory = () => {
    const f = (id_inventory_row_size_prefix: string, id_gobblet_prefix: string) => {
        let gob_id = 0;
        for (let size = 0; size < 3; size++) {
            const div = document.getElementById(id_inventory_row_size_prefix + size.toString()) as HTMLDivElement;
            for (let i = 0; i < 2; i++) {
                const img = document.getElementById(id_gobblet_prefix + gob_id.toString()) as HTMLImageElement;
                div.appendChild(img);
                img.style.display = "block";
                gob_id += 1;
            }
        }
    };

    // 左側インベントリの初期化
    f(consts.ID_INVENTORY_LEFT_ROW_SIZE_PREFIX, consts.ID_GOBBLET_BLACK_PREFIX);

    // 右側インベントリの初期化
    f(consts.ID_INVENTORY_RIGHT_ROW_SIZE_PREFIX, consts.ID_GOBBLET_WHITE_PREFIX);

}