import * as consts from "./consts";
import * as domops from "./domops";

export enum GameState {
    BEFORE_START, // 開始前
    PLAYER_IDLE, // プレイヤーの操作待機中
    PLAYER_SELECTING_GOBBLET, // ゴブレットを選択中
    ENEMY_TURN,  // 敵の行動
    JUDGE_TIME, // 勝敗判定
    GAME_END, // 終了
};

enum JudgeValue {
    ENEMY_WIN = -1, // 敵勝利
    UNFINISHED = 0, // 未決着
    PLAYER_WIN = 1, // プレイヤー勝利
    DRAW = 2, // 引き分け（両者勝利）
}

const GOBBLET_MAX_SIZE = 3; // ゴブレットの最大の大きさ
const GOBBLET_MAX_NUM = 6; // ゴブレットの最大個数
const BOX_H = 3; // boxの横の数
const BOX_W = 3; // boxの縦の数
const BOX_MAX_NUM = BOX_H * BOX_W; // boxの数

// boardの仕様
// 3x3マスの平面に高さ3マスがある立方体をイメージ。
// 高さはゴブレットの大きさを表している。
// 0:空っぽ, 1:プレイヤーが置いている, -1:敵が置いている
export enum GobbletValue {
    ENEMY = -1,
    EMPTY = 0,
    PLAYER = 1,
}
export class Game {
    public state: GameState;
    public selecting_gobblet: HTMLImageElement | null;
    constructor(attack_order: domops.ATTACK_ORDER) {
        this.state = GameState.BEFORE_START;
        this.selecting_gobblet = null;

        if (attack_order === domops.ATTACK_ORDER.PLAYER_FIRST) {
            this.state = GameState.PLAYER_IDLE;
            domops.update_game_message("あなたのターンです😶");
        }
        else {
            this.state = GameState.ENEMY_TURN;
            domops.update_game_message("敵のターンです🤔");
            this.action_enemy_turn();
        }
    }

    // 選択中のゴブレットをマークする
    private mark_selecting_gobblet() {
        this.selecting_gobblet!.style.border = "2px dotted #00bfa5";
    }

    // 選択中のゴブレットをアンマークする
    public unmark_selecting_gobblet() {
        if (this.selecting_gobblet == null) return;
        this.selecting_gobblet.style.border = "";
    }

    // 勝敗判定をする
    // moveでゴブレットを動かしたとき、引き分け（両者勝利）になることがある
    // 0: 未決着, 1: プレイヤー勝利, -1: 敵勝利, 2: 引き分け
    public judge(): JudgeValue {
        let player_win = false;
        let enemy_win = false;

        // 横一列の判定
        for (let h = 0; h < BOX_H; h++) {
            let is_draw = false;
            let box_num = h * BOX_W + 0;
            const box = document.getElementById(consts.ID_BOX_PREFIX + box_num.toString()) as HTMLDivElement;
            const top_gob = domops.get_top_gobblet_on_box(box);
            const v = domops.which_gobblet(top_gob);
            if (v === 0) {
                continue;
            }
            for (let w = 1; w < BOX_W; w++) {
                let box_num2 = h * BOX_W + w;
                const box2 = document.getElementById(consts.ID_BOX_PREFIX + box_num2.toString()) as HTMLDivElement;
                const top_gob2 = domops.get_top_gobblet_on_box(box2);
                const v2 = domops.which_gobblet(top_gob2);
                if (v !== v2) {
                    is_draw = true;
                    break;
                }
            }
            if (!is_draw) {
                if (v === 1) player_win = true;
                else enemy_win = true;
            }
        }

        // 縦一列の判定
        for (let w = 0; w < BOX_W; w++) {
            let is_draw = false;
            let box_num = 0 * BOX_W + w;
            const box = document.getElementById(consts.ID_BOX_PREFIX + box_num.toString()) as HTMLDivElement;
            const top_gob = domops.get_top_gobblet_on_box(box);
            const v = domops.which_gobblet(top_gob);
            if (v === 0) {
                continue;
            }
            for (let h = 1; h < BOX_H; h++) {
                let box_num2 = h * BOX_W + w;
                const box2 = document.getElementById(consts.ID_BOX_PREFIX + box_num2.toString()) as HTMLDivElement;
                const top_gob2 = domops.get_top_gobblet_on_box(box2);
                const v2 = domops.which_gobblet(top_gob2);
                if (v !== v2) {
                    is_draw = true;
                    break;
                }
            }
            if (!is_draw) {
                if (v === 1) player_win = true;
                else enemy_win = true;
            }
        }

        // 左上から右下へのななめ判定
        for (let i = 0; i < 1; i++) {
            let is_draw = false;
            let box_num = 0;
            const box = document.getElementById(consts.ID_BOX_PREFIX + box_num.toString()) as HTMLDivElement;
            const top_gob = domops.get_top_gobblet_on_box(box);
            const v = domops.which_gobblet(top_gob);
            if (v === 0) {
                continue;
            }
            for (let j = 1; j < BOX_H; j++) {
                const box_num2 = j * BOX_W + j;
                const box2 = document.getElementById(consts.ID_BOX_PREFIX + box_num2.toString()) as HTMLDivElement;
                const top_gob2 = domops.get_top_gobblet_on_box(box2);
                const v2 = domops.which_gobblet(top_gob2);
                if (v !== v2) {
                    is_draw = true;
                    break;
                }
            }
            if (!is_draw) {
                if (v === 1) player_win = true;
                else enemy_win = true;
            }
        }

        // 右上から左下へのななめ判定
        for (let i = 0; i < 1; i++) {
            let is_draw = false;
            let box_num = 2;
            const box = document.getElementById(consts.ID_BOX_PREFIX + box_num.toString()) as HTMLDivElement;
            const top_gob = domops.get_top_gobblet_on_box(box);
            const v = domops.which_gobblet(top_gob);
            if (v === 0) {
                continue;
            }
            for (let j = 1; j < BOX_H; j++) {
                const box_num2 = j * BOX_W + (BOX_W - 1 - j);
                const box2 = document.getElementById(consts.ID_BOX_PREFIX + box_num2.toString()) as HTMLDivElement;
                const top_gob2 = domops.get_top_gobblet_on_box(box2);
                const v2 = domops.which_gobblet(top_gob2);
                if (v !== v2) {
                    is_draw = true;
                    break;
                }
            }
            if (!is_draw) {
                if (v === 1) player_win = true;
                else enemy_win = true;
            }
        }

        if (player_win && enemy_win) return JudgeValue.DRAW;
        else if (player_win) return JudgeValue.PLAYER_WIN;
        else if (enemy_win) return JudgeValue.ENEMY_WIN;
        return JudgeValue.UNFINISHED;
    }

    // 座標box_numにgobのゴブレットは置けるか？
    public can_put_gobblet(box: HTMLDivElement, gob: HTMLImageElement): boolean {
        const gobblets = box.getElementsByClassName(consts.CLS_GOBBLET);
        let max_size = -1;
        for (let i = 0; i < gobblets.length; i++) {
            if (gobblets[i] == null) continue;
            const img = gobblets[i] as HTMLImageElement;
            for (let j = 0; j < img.classList.length; j++) {
                if (img.classList[j] == null) continue;
                const class_name: string = img.classList[j].toString();
                if (class_name.startsWith(consts.CLS_GOBBLET_SIZE_PREFIX)) {
                    max_size = Math.max(max_size, Number(class_name.split(consts.CLS_GOBBLET_SIZE_PREFIX)[1]));
                }
            }
        }

        let gobsize = -1;
        for (let i = 0; i < gob.classList.length; i++) {
            if (gob.classList[i] == null) continue;
            if (gob.classList[i].startsWith(consts.CLS_GOBBLET_SIZE_PREFIX)) {
                gobsize = Number(gob.classList[i].split(consts.CLS_GOBBLET_SIZE_PREFIX)[1]);
                break;
            }
        }
        if (max_size < gobsize) return true;
        return false;
    }

    // 座標box_numにgobsizeのゴブレットは置けるか？
    public can_put_gobblet2(box_num: number, gobsize: number): boolean {
        const box = document.getElementById(consts.ID_BOX_PREFIX + box_num.toString()) as HTMLDivElement;
        const gobblets = box.getElementsByClassName(consts.CLS_GOBBLET);
        let max_size = -1;
        for (let i = 0; i < gobblets.length; i++) {
            if (gobblets[i] == null) continue;
            const img = gobblets[i] as HTMLImageElement;
            for (let j = 0; j < img.classList.length; j++) {
                if (img.classList[j] == null) continue;
                const class_name: string = img.classList[j].toString();
                if (class_name.startsWith(consts.CLS_GOBBLET_SIZE_PREFIX)) {
                    max_size = Math.max(max_size, Number(class_name.split(consts.CLS_GOBBLET_SIZE_PREFIX)[1]));
                }
            }
        }
        if (max_size < gobsize) return true;
        return false;
    }

    // 座標box_numにgobsizeのゴブレットを置く
    public put_gobblet(box: HTMLDivElement, gob: HTMLImageElement) {
        // 置くゴブレット以外のゴブレットを非表示にする
        domops.all_gobblet_display_none_on_box(box);
        // ゴブレットを置く
        box.appendChild(gob);
        gob.style.display = "block";
        this.unmark_selecting_gobblet();
    }

    // box1からbox2へゴブレットを移動できるか？
    public can_move_gobblet(box1: HTMLDivElement, box2: HTMLDivElement) {
        // box1の先頭のゴブレットを取得する
        const gob1 = domops.get_top_gobblet_on_box(box1);
        if (gob1 == null) return false;

        // box2の先頭のゴブレットを取得する
        const gob2 = domops.get_top_gobblet_on_box(box2);
        if (gob2 == null) return true;

        // box1のほうがbox2より大きかったら移動できる
        const gobsize1 = domops.get_gobblet_size(gob1);
        const gobsize2 = domops.get_gobblet_size(gob2);
        return gobsize1 > gobsize2;
    }

    // box_num1からbox_num2へゴブレットを移動できるか？
    public can_move_gobblet2(box_num1: number, box_num2: number) {
        const box1 = document.getElementById(consts.ID_BOX_PREFIX + box_num1.toString()) as HTMLDivElement;
        const box2 = document.getElementById(consts.ID_BOX_PREFIX + box_num2.toString()) as HTMLDivElement;

        // box1の先頭のゴブレットを取得する
        const gob1 = domops.get_top_gobblet_on_box(box1);
        if (gob1 == null) return false;

        // box2の先頭のゴブレットを取得する
        const gob2 = domops.get_top_gobblet_on_box(box2);
        if (gob2 == null) return true;

        // box1のほうがbox2より大きかったら移動できる
        const gobsize1 = domops.get_gobblet_size(gob1);
        const gobsize2 = domops.get_gobblet_size(gob2);
        return gobsize1 > gobsize2;
    }

    // box1からbox2にゴブレットを移動させる。
    public move_gobblet(box1: HTMLDivElement, box2: HTMLDivElement) {
        // box2のゴブレットをすべて非表示にする
        domops.all_gobblet_display_none_on_box(box2);

        // box1の先頭のゴブレットをbox2に移動させる
        const gob1 = domops.get_top_gobblet_on_box(box1);
        if (gob1 == null) {
            console.log("Error: In move_gobblet, gob1 == null.");
            return;
        }
        box2.appendChild(gob1);

        // box1のゴブレットのうち、最も大きいものを表示する
        const new_gob1 = domops.get_top_gobblet_on_box(box1);
        console.log("baka: ", new_gob1);
        if (new_gob1 != null) {
            console.log("hogehoge");
            new_gob1.style.display = "block";
        }
        this.unmark_selecting_gobblet();
    }

    // 座標box_num1から座標box_num2にゴブレットを移動させる。
    public move_gobblet2(box_num1: number, box_num2: number) {
        const box1 = document.getElementById(consts.ID_BOX_PREFIX + box_num1.toString()) as HTMLDivElement;
        const box2 = document.getElementById(consts.ID_BOX_PREFIX + box_num2.toString()) as HTMLDivElement;

        // box2のゴブレットをすべて非表示にする
        domops.all_gobblet_display_none_on_box(box2);

        // box1の先頭のゴブレットをbox2に移動させる
        const gob1 = domops.get_top_gobblet_on_box(box1);
        if (gob1 == null) {
            console.log("Error: In move_gobblet, gob1 == null.");
            return;
        }
        box2.appendChild(gob1);

        // box1の新しい先頭のゴブレットを表示する
        const new_gob1 = domops.get_top_gobblet_on_box(box1);
        if (new_gob1 != null) {
            new_gob1.style.display = "block";
        }
    }

    // ゴブレットをクリックしたときのアクション
    public action_click_gobblet(e: Event) {
        console.log("action_click_gobblet: ", this.state);

        // ゴブレットがbox上に置いてあるなら、イベントを無視する（boxイベントを優先）
        let ignore_event: boolean = false;
        const img = e.currentTarget as HTMLImageElement;
        const box = domops.get_box(img);
        if (box != null) return;

        if (this.state === GameState.PLAYER_IDLE) {
            const img = e.currentTarget as HTMLImageElement;
            if (img == null) return;
            console.log(img);
            this.state = GameState.PLAYER_SELECTING_GOBBLET;
            this.selecting_gobblet = img;
            this.mark_selecting_gobblet();
            return;
        }
        else if (this.state === GameState.PLAYER_SELECTING_GOBBLET) {
            const img = e.currentTarget as HTMLImageElement;
            if (img == null) return;
            if (img === this.selecting_gobblet) {
                // 選択を解除
                this.unmark_selecting_gobblet();
                this.state = GameState.PLAYER_IDLE;
                this.selecting_gobblet = null;
            }
            else {
                this.unmark_selecting_gobblet();
                this.selecting_gobblet = img;
                this.mark_selecting_gobblet();
            }
            return;
        }
    }

    // マス上にゴブレットが存在していて、それが選択中のゴブレットだったら、選択解除する
    private unselect_gobblet_on_box_if_needed(e: Event) {
        const box = e.currentTarget as HTMLDivElement;
        const img = domops.get_top_gobblet_on_box(box);
        if (img == null) return false;
        if (img === this.selecting_gobblet) {
            this.unmark_selecting_gobblet();
            this.state = GameState.PLAYER_IDLE;
            return true;
        }
        return false;
    }

    // マスをクリックしたときのアクション
    public action_click_box(e: Event) {
        console.log("action_click_box: ", this.state);

        if (this.state === GameState.PLAYER_IDLE) {
            // マス上のゴブレットを選択する
            const target = e.currentTarget as HTMLDivElement;
            // マス上にプレイヤーのゴブレットが存在していればそれを選択中にする
            if (!domops.is_top_gobblet_player(target)) {
                return;
            }
            const img = domops.get_top_gobblet_on_box(target);
            if (img == null) return;
            this.selecting_gobblet = img;
            this.mark_selecting_gobblet();
            this.state = GameState.PLAYER_SELECTING_GOBBLET;
            return;
        }
        else if (this.state === GameState.PLAYER_SELECTING_GOBBLET) {
            // 選択中のゴブレットの場合、選択解除にする
            const res = this.unselect_gobblet_on_box_if_needed(e);
            if (res) return;

            if (this.selecting_gobblet == null) {
                console.log("Error: selecting_gobblet is null.");
                return;
            }
            const target = e.currentTarget as HTMLDivElement;

            // putかmoveか？
            if (domops.is_in_inventory(this.selecting_gobblet)) {
                // put処理
                // ゴブレットを置けるか？
                if (!this.can_put_gobblet(target, this.selecting_gobblet)) {
                    console.log("Message: can't put");
                    return;
                }
                // ゴブレットを置く
                this.put_gobblet(target, this.selecting_gobblet);
                this.selecting_gobblet = null;
                // 勝敗判定
                const res_judge = this.judge();
                if (res_judge === JudgeValue.PLAYER_WIN) {
                    // プレイヤー勝利
                    this.state = GameState.GAME_END;
                    domops.update_game_message("あなたの勝ちです🥳");
                    return;
                }
                else if (res_judge === JudgeValue.ENEMY_WIN) {
                    // 敵勝利
                    this.state = GameState.GAME_END;
                    domops.update_game_message("あなたの負けです😔");
                    return;
                }
                else if (res_judge === JudgeValue.DRAW) {
                    // 引き分け（両者勝利）
                    this.state = GameState.GAME_END;
                    domops.update_game_message("引き分けです😲");
                    return;
                }
                // 敵のターンになる
                this.state = GameState.ENEMY_TURN;
                this.action_enemy_turn();
                return;
            }
            else {
                // move処理
                const box1 = domops.get_box(this.selecting_gobblet);
                if (box1 == null) {
                    console.log("Error: In action_click_box, box1 == null.");
                    return;
                }
                // ゴブレットを移動できるか？
                if (!this.can_move_gobblet(box1, target)) {
                    console.log("Message: can't move.");
                    return;
                }
                // ゴブレットを移動させる
                this.move_gobblet(box1, target);
                // 勝敗判定
                const res_judge = this.judge();
                if (res_judge === JudgeValue.PLAYER_WIN) {
                    // プレイヤー勝利
                    this.state = GameState.GAME_END;
                    domops.update_game_message("あなたの勝ちです🥳");
                    return;
                }
                else if (res_judge === JudgeValue.ENEMY_WIN) {
                    // 敵勝利
                    this.state = GameState.GAME_END;
                    domops.update_game_message("あなたの負けです😔");
                    return;
                }
                else if (res_judge === JudgeValue.DRAW) {
                    // 引き分け（両者勝利）
                    this.state = GameState.GAME_END;
                    domops.update_game_message("引き分けです😲");
                    return;
                }
                // 敵のターンになる
                this.state = GameState.ENEMY_TURN;
                domops.update_game_message("敵のターンです🤔");
                this.action_enemy_turn();
                return;
            }
        }
    }

    // ゴブレットが置けるところをランダムに選択する
    private random_select() {
        // [0, max)の乱数を得る
        const get_random = (max: number) => {
            return Math.floor(Math.random() * max);
        }
        // ランダムにゴブレットを選び、置く
        while (1) {
            // ランダムにゴブレットを選ぶ
            const r = get_random(GOBBLET_MAX_NUM);
            const gob = document.getElementById(consts.ID_GOBBLET_WHITE_PREFIX + r.toString()) as HTMLImageElement;
            // 選んだゴブレットはインベントリにあるか？
            if (domops.is_in_inventory(gob)) {
                // マスを適当に選んで置く
                const r2 = get_random(BOX_MAX_NUM);
                const target_box = document.getElementById(consts.ID_BOX_PREFIX + r2.toString()) as HTMLDivElement;
                if (!this.can_put_gobblet(target_box, gob)) continue;
                this.put_gobblet(target_box, gob);
                break;
            }
            else {
                if (!domops.is_gobblet_top_on_box(gob)) continue;
                const box1 = domops.get_box(gob)!;
                // マスを適当に選んで移動させる
                const r2 = get_random(BOX_MAX_NUM);
                const box2 = document.getElementById(consts.ID_BOX_PREFIX + r2.toString()) as HTMLDivElement;
                if (!this.can_move_gobblet(box1, box2)) continue;
                this.move_gobblet(box1, box2);
                break;
            }
        }
    }

    // 敵のアクション
    public action_enemy_turn() {
        // ランダムセレクト
        this.random_select();
        // 勝敗判定
        const res_judge = this.judge();
        if (res_judge === JudgeValue.PLAYER_WIN) {
            // プレイヤー勝利
            this.state = GameState.GAME_END;
            domops.update_game_message("あなたの勝ちです🥳");
            return;
        }
        else if (res_judge === JudgeValue.ENEMY_WIN) {
            // 敵勝利
            this.state = GameState.GAME_END;
            domops.update_game_message("あなたの負けです😔");
            return;
        }
        else if (res_judge === JudgeValue.DRAW) {
            // 引き分け（両者勝利）
            this.state = GameState.GAME_END;
            domops.update_game_message("引き分けです😲");
            return;
        }
        // プレイヤーのターンになる
        this.state = GameState.PLAYER_IDLE;
        domops.update_game_message("あなたのターンです😶");
    }
}