import * as consts from "./consts";

// 「先行」「後攻」の値を取得する
export enum ATTACK_ORDER {
    PLAYER_FIRST,
    ENEMY_FIRST,
};
const ATTACK_ORDER_MAP = new Map<string, ATTACK_ORDER>([
    ["0", ATTACK_ORDER.PLAYER_FIRST],
    ["1", ATTACK_ORDER.ENEMY_FIRST],
]);
export const get_attack_order = (): ATTACK_ORDER => {
    const elem = document.getElementById(consts.ID_ATTACK_ORDER) as HTMLSelectElement;
    return ATTACK_ORDER_MAP.get(elem.value)!;
}

// ゴブレットのサイズを取得する
export const get_gobblet_size = (img_gob: HTMLImageElement): number => {
    let gobsize = -1;
    img_gob.classList.forEach(elem => {
        if (elem == null) return;
        if (elem.toString().startsWith(consts.CLS_GOBBLET_SIZE_PREFIX)) {
            gobsize = Number(elem.toString().split(consts.CLS_GOBBLET_SIZE_PREFIX)[1]);
        }
    });
    return gobsize;
}

// boxの一番上のゴブレットを返す（ないならnullを返す）
export const get_top_gobblet_on_box = (box: HTMLDivElement): HTMLImageElement | null => {
    const gobblets = box.getElementsByClassName(consts.CLS_GOBBLET);
    let max_size = -1;
    let res_img: HTMLImageElement | null = null;
    for (let i = 0; i < gobblets.length; i++) {
        if (gobblets[i] == null) continue;
        const img = gobblets[i] as HTMLImageElement;
        const img_size = get_gobblet_size(img);
        if (img_size > max_size) {
            console.log("update");
            max_size = img_size;
            res_img = img;
        }
    }
    return res_img;
}

// playerとenemyどちらのゴブレットか
// 0:どちらでもない -1:enemy, 1:player
export const which_gobblet = (gob: HTMLImageElement | null): number => {
    if (gob == null) return 0;
    for (let i = 0; i < gob.classList.length; i++) {
        if (gob.classList[i].toString() === consts.CLS_PLAYER_GOBBLET) return 1;
        if (gob.classList[i].toString() === consts.CLS_ENEMY_GOBBLET) return -1;
    }
    return 0;
}

// このゴブレットが所属するboxを返す
export const get_box = (gob: HTMLImageElement): HTMLDivElement | null => {
    const div = gob.parentElement as HTMLDivElement;
    if (div == null) return null;

    // そもそもこのゴブレットはboxに所属しているのか？
    let is_ok = false;
    for (let i = 0; i < div.classList.length; i++) {
        if (div.classList[i] == null) continue;
        if (div.classList[i].toString().startsWith(consts.CLS_BOX)) {
            is_ok = true;
            break;
        }
    }
    if (!is_ok) return null;
    return div;
}

// boxの一番上のゴブレットはプレイヤーのゴブレットか？
export const is_top_gobblet_player = (box: HTMLDivElement): boolean => {
    const top_gob = get_top_gobblet_on_box(box);
    if (top_gob == null) {
        return false;
    }
    for (let i = 0; i < top_gob.classList.length; i++) {
        if (top_gob.classList[i] == null) continue;
        if (top_gob.classList[i].toString().startsWith(consts.CLS_PLAYER_GOBBLET)) {
            return true;
        }
    }
    return false;
}

// このゴブレットはboxの一番上にあるか？
export const is_gobblet_top_on_box = (gob: HTMLImageElement): boolean => {
    const box = gob.parentElement;
    if (box == null) return false;

    // このゴブレットはbox上にあるのか？
    let is_ok = false;
    for (let i = 0; i < box.classList.length; i++) {
        if (box.classList[i] == null) continue;
        if (box.classList[i].toString().startsWith(consts.CLS_BOX)) {
            is_ok = true;
            break;
        }
    }
    if (!is_ok) return false;

    return gob.style.display === "block";
}

// boxのゴブレットをすべて非表示にする
export const all_gobblet_display_none_on_box = (box: HTMLDivElement) => {
    const gobblets = box.getElementsByClassName(consts.CLS_GOBBLET);
    for (let i = 0; i < gobblets.length; i++) {
        if (gobblets[i] == null) continue;
        const gob = gobblets[i] as HTMLImageElement;
        gob.style.display = "none";
    }
}

// ゴブレットはインベントリにあるか？
export const is_in_inventory = (gob: HTMLImageElement): boolean => {
    const div = gob.parentElement!;
    for (let i = 0; i < div.classList.length; i++) {
        if (div.classList[i] == null) continue;
        if (div.classList[i].toString().startsWith(consts.CLS_INVENTORY_LEFT_ROW)) return true;
        if (div.classList[i].toString().startsWith(consts.CLS_INVENTORY_RIGHT_ROW)) return true;
    }
    return false;
}

// ゲームメッセージを更新する
export const update_game_message = (message: string) => {
    const div = document.getElementById(consts.ID_GAME_MESSAGE);
    if (div == null) {
        console.log("Error: In update_game_message, div == null.");
        return;
    }
    div.textContent = message;
}