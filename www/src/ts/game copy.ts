import * as consts from "./consts";
import * as domops from "./domops";

export enum GameState {
    BEFORE_START, // 開始前
    PLAYER_IDLE, // プレイヤーの操作待機中
    PLAYER_SELECTING_GOBBLET, // ゴブレットを選択中
    ENEMY_TURN,  // 敵の行動
};

const GOBBLET_MAX_SIZE = 3;

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
    private board: Array<Array<GobbletValue>>; // board[coord][gobsize] := 座標coordに大きさgobsizeのゴブレットが置かれているか？
    public state: GameState;
    public selecting_gobblet: HTMLImageElement | null;
    constructor(attack_order: domops.ATTACK_ORDER) {
        this.board = [
            [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY], [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY], [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY],
            [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY], [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY], [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY],
            [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY], [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY], [GobbletValue.EMPTY, GobbletValue.EMPTY, GobbletValue.EMPTY]];
        this.state = GameState.BEFORE_START;
        this.selecting_gobblet = null;

        if (attack_order === domops.ATTACK_ORDER.PLAYER_FIRST) {
            this.state = GameState.PLAYER_IDLE;
        }
        else {
            this.state = GameState.ENEMY_TURN;
        }
    }

    // 選択中のゴブレットをマークする
    private mark_selecting_gobblet() {
        this.selecting_gobblet!.style.border = "2px dotted #00bfa5";
    }

    // 選択中のゴブレットをアンマークする
    private unmark_selecting_gobblet() {
        if (this.selecting_gobblet == null) return;
        this.selecting_gobblet.style.border = "";
    }

    // 座標coordにgobsizeのゴブレットは置けるか？
    public can_put_gobblet(coord: number, gobsize: number): boolean {
        for (let ngob = gobsize; ngob < GOBBLET_MAX_SIZE; ngob++) {
            if (this.board[coord][ngob] !== GobbletValue.EMPTY) return false;
        }
        return true;
    }

    // 座標coordにgobsizeのゴブレットを置く
    public put_gobblet(coord: number, gobsize: number, which_player: GobbletValue) {
        this.board[coord][gobsize] = which_player;
        this.unmark_selecting_gobblet();
    }

    // 座標coord1から座標coord2にゴブレットを移動させる。
    public move_gobblet(coord1: number, coord2: number) {

    }

    // ゴブレットをクリックしたときのアクション
    public action_click_gobblet(e: Event) {
        console.log("action_click_gobblet: ", this.state);

        // ゴブレットがbox上に置いてあるなら、イベントを無視する（boxイベントを優先）
        let ignore_event: boolean = false;
        const img = e.target as HTMLImageElement;
        img.parentElement!.classList.forEach(elem => {
            if (elem == null) return;
            if (elem.toString().startsWith(consts.CLS_BOX)) {
                // イベントを無視する
                ignore_event = true;
                return;
            }
        });
        if (ignore_event) return;

        if (this.state === GameState.PLAYER_IDLE) {
            const img = e.target as HTMLImageElement;
            if (img == null) return;
            console.log(img);
            this.state = GameState.PLAYER_SELECTING_GOBBLET;
            this.selecting_gobblet = img;
            this.mark_selecting_gobblet();
        }
        else if (this.state === GameState.PLAYER_SELECTING_GOBBLET) {
            const img = e.target as HTMLImageElement;
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
            // マス上にゴブレットが存在していればそれを選択中にする
            const gobblets = target.getElementsByClassName(consts.CLS_PLAYER_GOBBLET);
            for (let i = 0; i < gobblets.length; i++) {
                if (gobblets[i] == null) continue;
                const img = gobblets[i] as HTMLImageElement;
                if (img.style.display === "none") continue;
                this.selecting_gobblet = img;
                this.mark_selecting_gobblet();
                this.state = GameState.PLAYER_SELECTING_GOBBLET;
                return;
            }
        }
        else if (this.state === GameState.PLAYER_SELECTING_GOBBLET) {
            // 選択中のゴブレットの場合、選択解除にする
            const res = this.unselect_gobblet_on_box_if_needed(e);
            if (res) return;

            // そこにゴブレットを置けるか？
            const target = e.currentTarget as HTMLDivElement;
            const box_num = Number(target.id.split(consts.ID_BOX_PREFIX)[1]);

            if (this.selecting_gobblet == null) {
                console.log("error: g_selecting_gobblet is null.");
                return;
            }

            // 選択中のゴブレットの大きさを取得する
            let gobsize = -1;
            for (let i = 0; i < this.selecting_gobblet.classList.length; i++) {
                if (this.selecting_gobblet.classList[i] == null) continue;
                if (!this.selecting_gobblet.classList[i].toString().startsWith(consts.CLS_GOBBLET_SIZE_PREFIX)) continue;
                gobsize = Number(this.selecting_gobblet.classList[i].toString().split(consts.CLS_GOBBLET_SIZE_PREFIX)[1]);
            }
            if (gobsize === -1) {
                console.log("Error: gobsize === -1");
                return;
            }

            // ゴブレットを置けるか？
            if (!this.can_put_gobblet(box_num, gobsize)) {
                console.log("message: can't put");
                return;
            }

            // マスにすでにゴブレットがある場合、それらは非表示にする
            const gobblets = target.getElementsByClassName("gobblet");
            for (let i = 0; i < gobblets.length; i++) {
                const img = gobblets[i] as HTMLImageElement;
                img.style.display = "none";
            }

            // ゴブレットを置く
            target.appendChild(this.selecting_gobblet);
            this.put_gobblet(box_num, gobsize, GobbletValue.PLAYER);
            this.selecting_gobblet = null;
            // 敵のターンになる
            this.state = GameState.ENEMY_TURN;
            this.action_enemy_turn();
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
            const r = get_random(6);
            const img_gob = document.getElementById(consts.ID_GOBBLET_WHITE_PREFIX + r.toString()) as HTMLImageElement;
            if (img_gob == null) {
                console.log("Error: gobblet is not found.");
                return;
            }
            const gobsize = domops.get_gobblet_size(img_gob);
            if (gobsize === -1) {
                console.log("Error: gobblet size is -1.");
                return;
            }

            // ランダムに座標を決めて置く
            const r2 = get_random(9);
            if (this.can_put_gobblet(r2, gobsize)) {
                const div = document.getElementById(consts.ID_BOX_PREFIX + r2.toString());
                if (div == null) {
                    console.log("Error: div is null.");
                    return;
                }
                // マスにすでにゴブレットがある場合、それらは非表示にする
                const gobblets = div.getElementsByClassName("gobblet");
                for (let i = 0; i < gobblets.length; i++) {
                    const img = gobblets[i] as HTMLImageElement;
                    img.style.display = "none";
                }
                // ゴブレットを置く
                div!.appendChild(img_gob);
                this.put_gobblet(r2, gobsize, GobbletValue.ENEMY);
                break;
            }
        }
        // プレイヤーのターンになる
        this.state = GameState.PLAYER_IDLE;
        console.log("switch player turn: ", this.state);
    }

    // 敵のアクション
    public action_enemy_turn() {
        // ランダムセレクト
        this.random_select();
    }
}