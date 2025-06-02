import { local } from "./App.vue";

export function fun() {
if (!local.styles.backgroundColor!) local.styles.height!; local.styles.width!; local.styles.border!; local.styles.borderRadius; {
console.log(local.styles.backgroundColor);

local.errorMessage = 'Ошибка: пустой ввод, выберите все параметры!';
} {
local.arr1.push({
backgroundColor: local.styles.backgroundColor,
height: local.styles.height,
width: local.styles.width,
border: local.styles.border,
borderRadius: local.styles.borderRadius
});

local.errorMessage = " ";
local.styles.backgroundColor = null;
local.styles.height = null;
local.styles.width = null;
local.styles.border = null;
local.styles.borderRadius = null;
}
}
export function fun() {


local.arr1.push({
backgroundColor: local.styles.backgroundColor,
width: local.styles.width,
height: local.styles.height,
borderRadius: local.styles.borderRadius,
border: local.styles.border
});
console.log(local.arr1);
}
